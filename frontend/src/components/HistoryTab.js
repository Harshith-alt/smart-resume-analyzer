import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeDetailModal from "./ResumeDetailModal";

function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/resumes");
        setHistory(response.data);
      } catch (err) {
        setError("Failed to fetch submission history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading)
    return <div className="loading-spinner">Loading history...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="card">
      <h2>Submission History</h2>
      {history.length === 0 ? (
        <p>No resumes have been analyzed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Name</th>
              <th>Email</th>
              <th>Uploaded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.filename}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.uploaded_at}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => setSelectedResumeId(item.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedResumeId && (
        <ResumeDetailModal
          resumeId={selectedResumeId}
          onClose={() => setSelectedResumeId(null)}
        />
      )}
    </div>
  );
}
export default HistoryTab;
