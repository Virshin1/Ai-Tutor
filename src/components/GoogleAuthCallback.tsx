import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access token from the URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const tokenType = params.get('token_type');
      const expiresIn = params.get('expires_in');
      const scope = params.get('scope');

      if (accessToken) {
        localStorage.setItem('google_access_token', accessToken);
        localStorage.setItem('google_token_expires', expiresIn || '3600');
        localStorage.setItem('google_token_scope', scope || '');
        // Redirect back to the previous page or dashboard
        const previousPage = localStorage.getItem('google_auth_previous_page') || '/';
        navigate(previousPage, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentBlue mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing Google Authentication...</h2>
        <p className="text-textSecondary">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback; 