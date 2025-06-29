import React, { useState, useRef } from 'react';
import { queryModel } from '../API/queryModel';
import './ResumeAnalyzer.css';

const formatAnalysisOutput = (text) => {
  if (!text) return null;

  // Split the text into sections based on emojis and keywords
  const sections = [];
  
  // Extract strengths section
  const strengthsMatch = text.match(/💪\s*Strengths?\s*:?([\s\S]*?)(?=⚡|🚀|$)/i);
  if (strengthsMatch) {
    const content = strengthsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'strengths',
      emoji: '💪',
      title: 'Strengths',
      points: points
    });
  }

  // Extract weaknesses section
  const weaknessesMatch = text.match(/⚡\s*Weaknesses?\s*:?([\s\S]*?)(?=💪|🚀|$)/i);
  if (weaknessesMatch) {
    const content = weaknessesMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'weaknesses',
      emoji: '⚡',
      title: 'Areas for Improvement',
      points: points
    });
  }

  // Extract improvements/suggestions section
  const improvementsMatch = text.match(/🚀\s*(?:Improvements?|Suggestions?)\s*:?([\s\S]*?)(?=💪|⚡|$)/i);
  if (improvementsMatch) {
    const content = improvementsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'suggestions',
      emoji: '🚀',
      title: 'Suggestions for Enhancement',
      points: points
    });
  }

  return sections.map((section, index) => (
    <div key={index} className={`analysis-box ${section.type}-box`}>
      <div className="analysis-header">
        <span className="analysis-emoji">{section.emoji}</span>
        <h4 className="analysis-title">{section.title}</h4>
      </div>
      <ul className="analysis-list">
        {section.points.map((point, pointIndex) => (
          <li key={pointIndex} className="analysis-item">
            {point}
          </li>
        ))}
      </ul>
    </div>
  ));
};

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please upload a resume or paste text first!");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `
        You are a professional resume reviewer with expertise in ATS optimization and career development.
        
        Analyze this resume and provide detailed feedback:
        ${resumeText}
        
        Please provide your analysis in the following format:

        💪 Strengths:
        - [List 4-5 specific strengths with detailed explanations]
        - [Each point should be on a new line starting with a dash]
        
        ⚡ Weaknesses:
        - [List 4-5 areas that need improvement with specific examples]
        - [Each point should be on a new line starting with a dash]
        
        🚀 Improvements:
        - [List 4-5 actionable suggestions for enhancement]
        - [Each point should be on a new line starting with a dash]
        
        Make sure each section has exactly 4-5 bullet points and be specific with your feedback.
      `;

      const result = await queryModel(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis('');
    setResumeText('');
    setFileName('');
  };

  return (
    <div className="resume-container">
      <div className="header-section">
        <h2 className="resume-title">📄 AI Resume Analyzer</h2>
        <p className="resume-subtitle">Get professional insights to enhance your resume</p>
      </div>

      <div className="upload-section">
        <div className="file-upload" onClick={() => fileInputRef.current.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div className="upload-icon">📁</div>
          <p className="upload-text">Drop your resume here or click to upload</p>
          <p className="upload-hint">Supports .txt, .pdf, .doc, .docx files</p>
          {fileName && <p className="file-name">📋 {fileName}</p>}
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <textarea
          className="resume-textarea"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <div className="action-section">
        <button 
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={isLoading || !resumeText.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing Resume...
            </>
          ) : (
            <>
              ✨ Analyze Resume
            </>
          )}
        </button>

        {analysis && (
          <button 
            className="clear-button"
            onClick={clearAnalysis}
          >
            🔄 Clear & Start Over
          </button>
        )}
      </div>

      {analysis && (
        <div className="results-section">
          <div className="results-header">
            <h3 className="results-title">🧠 AI Analysis Results</h3>
            <p className="results-subtitle">Here's your detailed resume feedback</p>
          </div>
          
          <div className="analysis-grid">
            {formatAnalysisOutput(analysis)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;