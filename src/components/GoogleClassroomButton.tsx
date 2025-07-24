import React from 'react';

const scopes = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.rosters',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/drive'
].join(' ');

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(scopes)}`;

const GoogleClassroomButton: React.FC = () => (
  <button
    onClick={() => window.location.href = authUrl}
    className="flex items-center gap-2 px-5 py-2 rounded-full bg-accentPurple text-background hover:bg-[#181A20] hover:text-accentBlue font-semibold shadow transition-all duration-200"
    title="Sign in with Google Classroom"
  >
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path></svg>
    Google Classroom
  </button>
);

export default GoogleClassroomButton; 