// src/utils/formatOutput.js

import React from 'react';

export function formatAnalysisOutput(rawText) {
  if (!rawText) return null;

  // Split the text into sections based on emojis and common patterns
  const sections = rawText.split(/(?=💪|⚡|🚀|\*\*[^*]+\*\*)/g).filter(section => section.trim());

  return sections.map((section, index) => {
    let title = "";
    let emoji = "";
    let bgColor = "";
    let borderColor = "";
    let textColor = "";

    // Extract title from markdown-style headers
    const titleMatch = section.match(/\*\*([^*]+)\*\*/);
    const extractedTitle = titleMatch ? titleMatch[1] : '';

    // Determine section type based on content
    if (section.includes("💪") || section.toLowerCase().includes("strength")) {
      title = extractedTitle || "Strengths";
      emoji = "💪";
      bgColor = "#f3e5f5";
      borderColor = "#9c27b0";
      textColor = "#4a148c";
    } else if (section.includes("⚡") || section.toLowerCase().includes("weakness")) {
      title = extractedTitle || "Areas for Improvement";
      emoji = "⚡";
      bgColor = "#ffebee";
      borderColor = "#f44336";
      textColor = "#b71c1c";
    } else if (section.includes("🚀") || section.toLowerCase().includes("improvement") || section.toLowerCase().includes("tip")) {
      title = extractedTitle || "Recommendations";
      emoji = "🚀";
      bgColor = "#e8f5e8";
      borderColor = "#4caf50";
      textColor = "#1b5e20";
    } else {
      title = extractedTitle || "Analysis";
      emoji = "📋";
      bgColor = "#f5f5f5";
      borderColor = "#9e9e9e";
      textColor = "#424242";
    }

    // Clean the content by removing the title and formatting
    let content = section.replace(/\*\*[^*]+\*\*/, '').replace(/^[💪⚡🚀]/, '').trim();

    return (
      <div
        key={index}
        style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          backgroundColor: bgColor,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: textColor
        }}>
          <span style={{ marginRight: '0.5rem', fontSize: '1.4rem' }}>{emoji}</span>
          {title}
        </div>
        <div style={{ lineHeight: '1.6', color: textColor }}>
          {content.split('\n').map((line, lineIndex) => {
            if (line.trim()) {
              // Format numbered lists
              if (/^\d+\./.test(line.trim())) {
                return (
                  <div key={lineIndex} style={{
                    marginBottom: '0.8rem',
                    paddingLeft: '1rem',
                    fontWeight: '500'
                  }}>
                    <span style={{ color: borderColor, marginRight: '0.5rem' }}>▶</span>
                    {line.trim().replace(/^\d+\.\s*/, '')}
                  </div>
                );
              }
              // Format bullet points
              if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                return (
                  <div key={lineIndex} style={{
                    marginBottom: '0.6rem',
                    paddingLeft: '1rem'
                  }}>
                    <span style={{ color: borderColor, marginRight: '0.5rem' }}>•</span>
                    {line.trim().replace(/^[•-]\s*/, '')}
                  </div>
                );
              }
              // Regular paragraphs
              return (
                <p key={lineIndex} style={{
                  marginBottom: '0.8rem',
                  lineHeight: '1.6'
                }}>
                  {line.trim()}
                </p>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>
      </div>
    );
  });
}
