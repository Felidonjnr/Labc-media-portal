// src/pages/MediaStudio.js
import { useState } from 'react';
import { useToast } from '../hooks/useToast';

export default function MediaStudio() {
  return (
    <div className="page-wrap">
      <div className="section-title">MEDIA STUDIO</div>
      <div className="section-sub">CONTENT FROM PHOTOS & STORIES</div>
      
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
          <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>Member Spotlight & Events</div>
          <p style={{ fontSize: '0.72rem', color: '#9AA3B2', marginTop: '0.5rem' }}>Tools for generating captions for members and church events coming soon.</p>
        </div>
      </div>
    </div>
  );
}
