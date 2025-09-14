import React from "react";

function ResumeDisplay({ data }) {
  const { extracted_data, llm_analysis } = data;

  if (!extracted_data || !llm_analysis) {
    return <div className="error-message">Incomplete analysis data.</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>AI Analysis & Feedback</h2>
        <h3>Overall Rating: {llm_analysis.resume_rating?.score}/10</h3>
        <p>
          <strong>Justification:</strong>{" "}
          {llm_analysis.resume_rating?.justification}
        </p>
        <h3>💡 Improvement Areas</h3>
        <p>{llm_analysis.improvement_areas?.summary}</p>
        <ul>
          {llm_analysis.improvement_areas?.sections?.map((item, index) => (
            <li key={index}>
              <strong>{item.section_name}:</strong> {item.feedback}
            </li>
          ))}
        </ul>
        <h3>🚀 Upskill Suggestions</h3>
        <ul>
          {llm_analysis.upskill_suggestions?.map((item, index) => (
            <li key={index}>
              <strong>{item.skill}:</strong> {item.reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Extracted Information</h2>
        <h3>Personal Info</h3>
        <p>
          <strong>Name:</strong> {extracted_data.personal_info?.name}
        </p>
        <p>
          <strong>Email:</strong> {extracted_data.personal_info?.email}
        </p>
        <p>
          <strong>Phone:</strong> {extracted_data.personal_info?.phone}
        </p>
        <h3>Summary</h3>
        <p>{extracted_data.summary}</p>
        <h3>Skills</h3>
        <div className="skills-container">
          <div>
            <h4>Technical</h4>
            <ul className="skill-list">
              {extracted_data.skills?.technical?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Soft Skills</h4>
            <ul className="skill-list">
              {extracted_data.skills?.soft?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Tools</h4>
            <ul className="skill-list">
              {extracted_data.skills?.tools?.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </div>
        <h3>Work Experience</h3>
        {extracted_data.work_experience?.map((job, index) => (
          <div key={index}>
            <h4>
              {job.job_title} at {job.company}
            </h4>
            <p>
              {job.start_date} - {job.end_date} | {job.location}
            </p>
            <ul>
              {job.description?.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ResumeDisplay;
