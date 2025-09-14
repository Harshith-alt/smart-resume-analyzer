# Smart Resume Analyzer

A web-based resume processing API that extracts structured data from resumes using Google Gemini LLM and provides automated career analysis. Built with **FastAPI**, **LangChain**, **SQLAlchemy**, and **pdfplumber**.

---

## Features

- Upload PDF resumes and extract structured information:
  - Personal Information
  - Summary
  - Work Experience
  - Education
  - Skills (technical, soft, tools)
  - Projects
  - Certifications
- Analyze resumes automatically to provide:
  - Resume rating (1-10) with justification
  - Improvement areas (section-specific feedback)
  - Upskill suggestions
- Resume history management with retrieval endpoints
- CORS enabled for React frontend

---

## Tech Stack

- **Backend:** FastAPI, Python 3.13
- **Database:** SQLite (via SQLAlchemy ORM)
- **LLM Integration:** LangChain + Google Gemini API
- **PDF Processing:** pdfplumber
- **Frontend:** (Optional) React.js or any other frontend framework
- **CORS:** Enabled for localhost frontend development

---

## Prerequisites

- Python 3.13+
- pip
- Google Gemini API key
- SQLite (or any DB supported by SQLAlchemy)

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Harshith-alt/smart-resume-analyzer.git
cd smart-resume-analyzer/backend
```
