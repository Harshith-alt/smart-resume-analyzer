import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeDisplay from "./ResumeDisplay";

function ResumeDetailModal({ resumeId, onClose }) {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) return;
    const fetchResumeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/resumes/${resumeId}`
        );

        setResumeData(response.data);
      } catch (err) {
        setError("Failed to fetch resume details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumeDetails();
  }, [resumeId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {isLoading && <div className="loading-spinner">Loading details...</div>}
        {error && <div className="error-message">{error}</div>}
        {resumeData && <ResumeDisplay data={resumeData} />}
      </div>
    </div>
  );
}
export default ResumeDetailModal;
