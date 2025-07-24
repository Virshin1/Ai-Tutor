# 🎓 Google Classroom Integration Setup Guide

## Overview
This guide will help you set up Google Classroom integration for your AI Tutor Tools application. The integration allows you to:

- ✅ Import Google Classroom courses and students
- ✅ Sync generated content directly to Google Classroom
- ✅ Create assignments, materials, and announcements
- ✅ Manage student submissions and grades
- ✅ Export content to Google Drive

## 🚀 Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Classroom API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Classroom API"
   - Click "Enable"

### 2. Configure OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
5. Copy the Client ID and Client Secret

### 3. Environment Variables

Add these to your `.env` file:

```env
# Google Classroom Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### 4. Frontend Environment Variables

Create a `.env` file in your frontend directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

## 🔧 API Endpoints

### Authentication
- `GET /google-classroom/courses?accessToken={token}` - Get user's courses
- `GET /google-classroom/courses/{courseId}/students?accessToken={token}` - Get course students

### Content Sync
- `POST /google-classroom/sync` - Sync content to Google Classroom
- `POST /google-classroom/create-assignment` - Create assignment
- `POST /google-classroom/create-material` - Create material

### Submissions & Grading
- `GET /google-classroom/courses/{courseId}/assignments/{assignmentId}/submissions` - Get submissions
- `POST /google-classroom/grade-submission` - Grade a submission

## 📱 Usage

### 1. Connect to Google Classroom
1. Click "Connect with Google" in the integration component
2. Authorize the application with your Google account
3. Grant permissions for Google Classroom access

### 2. Select Course
1. Choose a course from your Google Classroom
2. View students enrolled in the course
3. Select content type (assignment, material, announcement)

### 3. Sync Content
1. Generate content using any AI tool
2. Use the Google Classroom integration component
3. Choose sync option:
   - **Sync Content**: General content sync
   - **Create Assignment**: Create graded assignment
   - **Create Material**: Create course material

## 🔒 Security Considerations

### OAuth Flow
- Uses OAuth 2.0 for secure authentication
- Access tokens are temporary and not stored
- Users must re-authenticate when tokens expire

### Permissions
The integration requests these scopes:
- `https://www.googleapis.com/auth/classroom.courses` - Read/write courses
- `https://www.googleapis.com/auth/classroom.rosters` - Read course rosters
- `https://www.googleapis.com/auth/classroom.coursework.me` - Manage coursework
- `https://www.googleapis.com/auth/drive` - Create and share Google Drive files

### Data Privacy
- No user data is stored permanently
- Access tokens are used only for API calls
- Users can disconnect at any time

## 🛠 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URI matches exactly in Google Cloud Console
   - Check for trailing slashes or protocol mismatches

2. **"Access token expired"**
   - Re-authenticate with Google
   - Check token expiration time

3. **"Permission denied"**
   - Ensure Google Classroom API is enabled
   - Check that user has teacher permissions in Google Classroom

4. **"Course not found"**
   - Verify course ID is correct
   - Ensure user has access to the course

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=google-classroom:*
```

## 📊 Features

### ✅ Implemented
- [x] OAuth 2.0 authentication
- [x] Course listing and selection
- [x] Student roster viewing
- [x] Content sync to Google Classroom
- [x] Assignment creation
- [x] Material creation
- [x] Google Drive integration
- [x] Error handling and validation

### 🚧 Future Enhancements
- [ ] Bulk content sync
- [ ] Grade import/export
- [ ] Real-time notifications
- [ ] Template sync
- [ ] Advanced scheduling
- [ ] Analytics integration

## 🎯 Best Practices

1. **Test in Development First**
   - Use test Google Classroom courses
   - Verify all permissions work correctly

2. **Handle Errors Gracefully**
   - Provide clear error messages
   - Offer retry options for failed operations

3. **Respect Rate Limits**
   - Google Classroom API has rate limits
   - Implement appropriate delays between requests

4. **User Education**
   - Explain what permissions are needed
   - Provide clear instructions for setup

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your Google Cloud Console configuration
3. Test with a simple course first
4. Review Google Classroom API documentation

## 🔗 Resources

- [Google Classroom API Documentation](https://developers.google.com/classroom)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Classroom API Reference](https://developers.google.com/classroom/reference/rest) 