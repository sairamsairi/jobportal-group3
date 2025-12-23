# Profile Management Feature - Implementation Guide

## Overview
This update adds comprehensive profile management functionality for both **Job Seekers** and **Employers** in your React Job Portal application.

## Features Added

### For Job Seekers
- **Personal Information**: Full name, email, phone, location, and about section
- **Education Management**: Add multiple education entries with institution, degree, field of study, and years
- **Work Experience**: Track multiple work experiences with company, role, dates, and descriptions
- **Skills**: Add and manage a list of skills with visual tags
- **Portfolio Links**: Add multiple portfolio/LinkedIn/GitHub links
- **Resume Upload**: Upload resume in PDF or DOC format (max 5MB) with Cloudinary storage

### For Employers
- **Personal Information**: Full name, email, phone, location, and about section
- **Company Information**: Company name, website, size, industry, and description
- **Company Logo**: Upload company logo (PNG/JPG/WEBP, max 2MB) with preview
- **Contact Details**: Dedicated contact person, email, and phone for job seekers to reach out

## Files Created/Modified

### Backend Files
1. **`backend/models/profileSchema.js`** - Enhanced profile schema supporting both user types
2. **`backend/controllers/profileController.js`** - New controller with file upload support
3. **`backend/routes/profileRoute.js`** - Updated routes using new controller

### Frontend Files
1. **`frontend/src/components/Job/JobSeekerProfile.jsx`** - Job seeker profile component
2. **`frontend/src/components/Job/EmployerProfile.jsx`** - Employer profile component
3. **`frontend/src/components/Job/profile.css`** - Modern, premium styling
4. **`frontend/src/App.jsx`** - Added profile routes
5. **`frontend/src/components/Layout/Navbar.jsx`** - Updated with role-specific profile links

## Routes

- **Job Seeker Profile**: `/profile/jobseeker`
- **Employer Profile**: `/profile/employer`

The navbar automatically routes users to the correct profile page based on their role.

## API Endpoints

### Profile Management
- **POST** `/api/v1/profile` - Create or update profile (authenticated)
- **GET** `/api/v1/profile/me` - Get logged-in user's profile (authenticated)
- **GET** `/api/v1/profile/:userId` - Get profile by user ID (public)
- **DELETE** `/api/v1/profile/me` - Delete profile (authenticated)

## Database Schema

### Profile Model Fields

#### Common Fields (Both Roles)
- `user` - Reference to User model (unique)
- `userRole` - "Job Seeker" or "Employer"
- `fullName` - Full name (required)
- `email` - Email address (required)
- `phone` - Phone number (required)
- `location` - City, Country
- `about` - About/bio text

#### Job Seeker Specific
- `education[]` - Array of education objects
  - `institution`, `degree`, `fieldOfStudy`, `startYear`, `endYear`
- `experience[]` - Array of work experience objects
  - `company`, `role`, `startDate`, `endDate`, `description`
- `skills[]` - Array of skill strings
- `resume` - Object with `public_id` and `url` (Cloudinary)
- `portfolioLinks[]` - Array of portfolio URLs

#### Employer Specific
- `companyName` - Company name
- `companyWebsite` - Company website URL
- `companySize` - Employee count range
- `industry` - Industry type
- `companyDescription` - Detailed company description
- `companyLogo` - Object with `public_id` and `url` (Cloudinary)
- `contactPerson` - HR/Contact person name
- `contactEmail` - Contact email
- `contactPhone` - Contact phone

## Design Features

### Modern UI/UX
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** matching your app theme
- **Smooth animations** on hover and interactions
- **Responsive design** for all screen sizes
- **Premium styling** with shadows and transitions
- **Interactive elements** with visual feedback

### Form Features
- Dynamic add/remove for education and experience
- Tag-based skill management with visual chips
- File upload with validation and preview
- Real-time form validation
- Loading states during submission
- Success/error toast notifications

## Usage Instructions

### For Users

1. **Login** to your account
2. Click **PROFILE** in the navigation bar
3. Fill out your profile information:
   - **Job Seekers**: Add education, experience, skills, and upload resume
   - **Employers**: Add company details, upload logo, and provide contact info
4. Click **Save Profile** to submit
5. Profile can be updated anytime by revisiting the page

### 3. Resume & File Handling
- **Resume Upload**: Job seekers can upload resumes (PDF, DOC, DOCX) up to 5MB.
- **Cloud Storage**: Files are securely stored on Cloudinary.
- **smart Viewing**: Resumes are linked via `secure_url`. When a user clicks "View Resume", it opens in a new tab (`target="_blank"`), utilizing the browser's native PDF viewer for a seamless experience without forced downloads.
- **Company Logos**: Employers can upload company logos (PNG, JPG, WEBP) which are displayed in the profile header.

## Technical Implementation

### File Upload Flow
1. Files are sent as `multipart/form-data`
2. Backend validates file type and size
3. Files are uploaded to Cloudinary
4. Old files are automatically deleted when updating
5. URLs and public IDs are stored in MongoDB

### Authentication
- All profile operations require authentication
- JWT token is sent in Authorization header
- User role determines which profile component is shown

### Data Validation
- Frontend: Real-time validation with user feedback
- Backend: Schema validation and file type checking
- Error handling with descriptive messages

## Next Steps

You can now:
1. Test the profile creation for both user types
2. Customize the styling in `profile.css` if needed
3. Add profile viewing functionality for other users
4. Integrate profile data into job applications
5. Add profile completion indicators
6. Implement profile picture upload for job seekers

## Notes

- Ensure Cloudinary credentials are properly configured in your backend `.env` file
- The profile schema uses a single collection for both user types with conditional fields
- File uploads are handled by `express-fileupload` middleware
- All file operations include cleanup of old files to prevent storage bloat

---

**Created**: December 2025
**Version**: 1.0
