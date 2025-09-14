import React, { useState } from "react";
import "./App.css";
import UploadTab from "./components/UploadTab";
import HistoryTab from "./components/HistoryTab";

function App() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="container">
      <h1> Smart Resume Analyzer</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload New Resume
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          View History
        </button>
      </div>
      {activeTab === "upload" && <UploadTab />}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
}
export default App;
