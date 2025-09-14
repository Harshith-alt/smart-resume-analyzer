import React, { useState } from "react";
import axios from "axios";
import ResumeDisplay from "./ResumeDisplay";

function UploadTab() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setAnalysisResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload", // ✅ backend route
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAnalysisResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "An error occurred during analysis."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Upload Your Resume</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button type="submit" disabled={isLoading} className="details-button">
            {isLoading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>
      </div>
      {isLoading && (
        <div className="loading-spinner">Analyzing... Please wait.</div>
      )}
      {error && <div className="error-message card">{error}</div>}
      {analysisResult && <ResumeDisplay data={analysisResult} />}
    </div>
  );
}

export default UploadTab;
