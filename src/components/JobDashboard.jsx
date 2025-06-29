import React, { useState } from 'react';
import { queryModel } from '../API/queryModel';
import './JobDashboard.css';

const formatRoadmapOutput = (text) => {
  if (!text) return null;

  const sections = [];
  
  // Extract Skills section
  const skillsMatch = text.match(/(?:🛠️|Skills?)\s*:?([\s\S]*?)(?=🏆|Certifications?|❓|Interview|💡|Tips?|$)/i);
  if (skillsMatch) {
    const content = skillsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'skills',
      emoji: '🛠️',
      title: 'Essential Skills to Develop',
      points: points
    });
  }

  // Extract Certifications section
  const certificationsMatch = text.match(/(?:🏆|Certifications?)\s*:?([\s\S]*?)(?=🛠️|Skills?|❓|Interview|💡|Tips?|$)/i);
  if (certificationsMatch) {
    const content = certificationsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'certifications',
      emoji: '🏆',
      title: 'Recommended Certifications',
      points: points
    });
  }

  // Extract Interview Questions section
  const questionsMatch = text.match(/(?:❓|Interview\s*Questions?)\s*:?([\s\S]*?)(?=🛠️|Skills?|🏆|Certifications?|💡|Tips?|$)/i);
  if (questionsMatch) {
    const content = questionsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'questions',
      emoji: '❓',
      title: 'Common Interview Questions',
      points: points
    });
  }

  // Extract Tips section
  const tipsMatch = text.match(/(?:💡|Tips?|Advice)\s*:?([\s\S]*?)(?=🛠️|Skills?|🏆|Certifications?|❓|Interview|$)/i);
  if (tipsMatch) {
    const content = tipsMatch[1].trim();
    const points = content.split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
    
    sections.push({
      type: 'tips',
      emoji: '💡',
      title: 'Pro Interview Tips',
      points: points
    });
  }

  return sections.map((section, index) => (
    <div key={index} className={`roadmap-box ${section.type}-box`}>
      <div className="roadmap-header">
        <span className="roadmap-emoji">{section.emoji}</span>
        <h4 className="roadmap-title">{section.title}</h4>
      </div>
      <ul className="roadmap-list">
        {section.points.map((point, pointIndex) => (
          <li key={pointIndex} className="roadmap-item">
            {point}
          </li>
        ))}
      </ul>
    </div>
  ));
};

const JobDashboard = () => {
  const [goal, setGoal] = useState('');
  const [company, setCompany] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      alert("Please enter your career goal first!");
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        You are an expert career advisor and industry professional with deep knowledge of hiring trends and skill requirements.

        Career Goal: ${goal}
        Preferred Company/Industry: ${company || "Any industry"}

        Please provide a comprehensive career roadmap in the following format:

        🛠️ Skills:
        - [List 5 specific technical and soft skills needed for this role]
        - [Each skill should be on a new line starting with a dash]
        
        🏆 Certifications:
        - [List 2-3 valuable certifications for this career path]
        - [Each certification should be on a new line starting with a dash]
        
        ❓ Interview Questions:
        - [List 3-4 common interview questions for this role]
        - [Each question should be on a new line starting with a dash]
        
        💡 Tips:
        - [List 2-3 actionable tips for landing this job]
        - [Each tip should be on a new line starting with a dash]

        Make sure to be specific and actionable with your recommendations.
      `;

      const result = await queryModel(prompt);
      setRoadmap(result);
    } catch (error) {
      console.error('Roadmap generation error:', error);
      alert('Error generating roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearRoadmap = () => {
    setRoadmap('');
    setGoal('');
    setCompany('');
  };

  const popularCareers = [
    'Data Scientist', 'Software Engineer', 'Product Manager', 'UX Designer',
    'Digital Marketing Manager', 'Cybersecurity Analyst', 'DevOps Engineer',
    'Business Analyst', 'Machine Learning Engineer', 'Full Stack Developer'
  ];

  const handleCareerSuggestion = (career) => {
    setGoal(career);
  };

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h2 className="dashboard-title">🧠 AI Career Roadmap Generator</h2>
        <p className="dashboard-subtitle">Get personalized career guidance and interview preparation</p>
      </div>

      <div className="input-section">
        <div className="form-group">
          <label className="form-label">🎯 Career Goal</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Data Scientist, Software Engineer, Product Manager..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          
          <div className="career-suggestions">
            <p className="suggestions-label">Popular careers:</p>
            <div className="suggestions-grid">
              {popularCareers.map((career, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleCareerSuggestion(career)}
                >
                  {career}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">🏢 Target Company/Industry (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Google, Microsoft, Healthcare, FinTech..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="action-section">
          <button 
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading || !goal.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Roadmap...
              </>
            ) : (
              <>
                🚀 Generate Career Roadmap
              </>
            )}
          </button>

          {roadmap && (
            <button 
              className="clear-button"
              onClick={clearRoadmap}
            >
              🔄 Start Over
            </button>
          )}
        </div>
      </div>

      {roadmap && (
        <div className="results-section">
          <div className="results-header">
            <h3 className="results-title">🎯 Your Personalized Career Roadmap</h3>
            <p className="results-subtitle">
              {goal && `Roadmap for: ${goal}`}
              {company && ` at ${company}`}
            </p>
          </div>
          
          <div className="roadmap-grid">
            {formatRoadmapOutput(roadmap)}
          </div>

          <div className="action-footer">
            <div className="progress-tracker">
              <h4 className="tracker-title">📊 Track Your Progress</h4>
              <p className="tracker-text">
                Save this roadmap and check off items as you complete them. 
                Remember, career growth is a journey - take it one step at a time!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDashboard;