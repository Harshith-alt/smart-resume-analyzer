import os
import json
from dotenv import load_dotenv
import pdfplumber
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
from models import get_db, Resume
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser


load_dotenv()
app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.2
)
extraction_template = """
You are an expert HR data extraction system. Your task is to parse the following resume text and convert it into a structured JSON object.
Your output MUST be ONLY the JSON object, with no introductory text, explanations, or markdown formatting. The JSON schema you must adhere to is:
{{
  "personal_info": {{"name": "string", "email": "string", "phone": "string", "location": "string", "linkedin_url": "string | null", "github_url": "string | null", "portfolio_url": "string | null"}},
  "summary": "string",
  "work_experience": [{{"job_title": "string", "company": "string", "location": "string", "start_date": "string", "end_date": "string", "description": ["string"]}}],
  "education": [{{"institution": "string", "degree": "string", "field_of_study": "string", "start_date": "string", "end_date": "string"}}],
  "skills": {{ "technical": ["string"], "soft": ["string"], "tools": ["string"] }},
  "projects": [{{"name": "string", "description": "string", "technologies": ["string"], "link": "string | null"}}],
  "certifications": ["string"]
}}
If a field or section is not present, use null or an empty array [].
Resume text:
{resume_text}
"""
extraction_prompt = PromptTemplate.from_template(extraction_template)

analysis_template = """
You are an expert career coach. Based on the provided structured resume data in JSON format, provide a critical analysis.
Your output MUST be ONLY a JSON object with the following schema:
{{
  "resume_rating": {{ "score": "number (1-10)", "justification": "string" }},
  "improvement_areas": {{ "summary": "string", "sections": [{{"section_name": "string", "feedback": "string"}}] }},
  "upskill_suggestions": [{{ "skill": "string", "reason": "string" }}]
}}
Analyze the data critically. Be specific and avoid generic advice.
Structured resume data:
{structured_data}
"""

analysis_prompt = PromptTemplate.from_template(analysis_template)


extraction_chain = extraction_prompt | llm | StrOutputParser()
analysis_chain = analysis_prompt | llm | StrOutputParser()


def parse_llm_json_output(text: str):
    try:
        cleaned_text = text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse LLM JSON output.")


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")
    try:
        with pdfplumber.open(file.file) as pdf:
            resume_text = "".join(page.extract_text() or "" for page in pdf.pages)
        
        
        extraction_result_str = extraction_chain.invoke({"resume_text": resume_text})
        extracted_data = parse_llm_json_output(extraction_result_str)
        
      
        analysis_result_str = analysis_chain.invoke({"structured_data": json.dumps(extracted_data, indent=2)})
        llm_analysis = parse_llm_json_output(analysis_result_str)
        
     
        new_resume = Resume(
            filename=file.filename,
            extracted_data=json.dumps(extracted_data),
            llm_analysis=json.dumps(llm_analysis)
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)
        
        return {
            "id": new_resume.id,
            "filename": new_resume.filename,
            "uploaded_at": new_resume.uploaded_at.isoformat(),
            "extracted_data": extracted_data,
            "llm_analysis": llm_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during resume processing: {str(e)}")


@app.get("/api/resumes")
def get_resumes_history(db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).order_by(models.Resume.uploaded_at.desc()).all()
    history = []
    for r in resumes:
        personal_info = json.loads(r.extracted_data).get("personal_info", {})
        history.append({
            "id": r.id,
            "filename": r.filename,
            "name": personal_info.get("name", "N/A"),
            "email": personal_info.get("email", "N/A"),
            "uploaded_at": r.uploaded_at.isoformat()
        })
    return history


@app.get("/api/resumes/{resume_id}")
def get_resume_details(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": resume.id,
        "filename": resume.filename,
        "uploaded_at": resume.uploaded_at.isoformat(),
        "extracted_data": json.loads(resume.extracted_data),
        "llm_analysis": json.loads(resume.llm_analysis)
    }
