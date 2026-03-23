# INR99.Academy Demo Accounts Guide

## Overview

This guide provides comprehensive information about all demo accounts available for testing the INR99.Academy LMS platform. Demo accounts allow users to explore different roles and features without registration. All demo accounts use the same password for easy testing.

## Quick Reference

**Password for all demo accounts:** `demo123`

---

## Demo Account Credentials

### Admin Accounts

| Email | Password | Name | Role | Dashboard |
|-------|----------|------|------|----------|
| admin1@inr99.com | demo123 | Demo Admin 1 | ADMIN | /dashboard/admin |
| admin2@inr99.com | demo123 | Demo Admin 2 | ADMIN | /dashboard/admin |
| admin3@inr99.com | demo123 | Demo Admin 3 | ADMIN | /dashboard/admin |
| admin4@inr99.com | demo123 | Demo Admin 4 | ADMIN | /dashboard/admin |
| admin5@inr99.com | demo123 | Demo Admin 5 | ADMIN | /dashboard/admin |

**Admin Features:**

- Full admin dashboard access
- User management with role assignment
- Platform analytics and reporting
- Content moderation tools
- System configuration
- Course and category management
- Financial reports and earnings tracking

### Instructor/Teacher Accounts

| Email | Password | Name | Role | Dashboard |
|-------|----------|------|------|----------|
| instructor1@inr99.com | demo123 | Demo Instructor 1 | INSTRUCTOR | /dashboard/instructor |
| instructor2@inr99.com | demo123 | Demo Instructor 2 | INSTRUCTOR | /dashboard/instructor |
| instructor3@inr99.com | demo123 | Demo Instructor 3 | INSTRUCTOR | /dashboard/instructor |
| teacher1@inr99.com | demo123 | Demo Teacher 1 | INSTRUCTOR | /dashboard/instructor |
| teacher2@inr99.com | demo123 | Demo Teacher 2 | INSTRUCTOR | /dashboard/instructor |
| teacher3@inr99.com | demo123 | Demo Teacher 3 | INSTRUCTOR | /dashboard/instructor |

**Instructor Features:**

- Complete instructor dashboard
- Course creation and management
- Lesson and module organization
- Student enrollment tracking
- Earnings and analytics
- Assessment and quiz creation
- Profile and bio management

### Student Accounts

| Email | Password | Name | Role | Dashboard |
|-------|----------|------|------|----------|
| student1@inr99.com | demo123 | Demo Student 1 | STUDENT | /dashboard/student |
| student2@inr99.com | demo123 | Demo Student 2 | STUDENT | /dashboard/student |
| student3@inr99.com | demo123 | Demo Student 3 | STUDENT | /dashboard/student |
| student4@inr99.com | demo123 | Demo Student 4 | STUDENT | /dashboard/student |
| student5@inr99.com | demo123 | Demo Student 5 | STUDENT | /dashboard/student |

**Student Features:**

- Full student dashboard
- Course enrollment and progress tracking
- Learning path visualization
- Certificate viewing and downloads
- Community discussions
- Profile management with settings
- Assessment taking and results

### Super Admin Account

| Email | Password | Name | Role | Dashboard |
|-------|----------|------|------|----------|
| superadmin1@inr99.com | demo123 | Super Admin | SUPER_ADMIN | /dashboard/admin |

**Super Admin Features:**

- All admin privileges
- Platform-wide management
- System administration
- Advanced analytics
- User role management
- Platform settings configuration

---

## Authentication Process

### Step 1: Login

1. Navigate to the login page at `/auth/login`
2. Enter any demo email from the credentials table above
3. Enter the password: `demo123`
4. Click "Sign In" button

### Step 2: Dashboard Access

After successful login, you will be redirected based on your role:

| Role | Dashboard URL | Description |
|------|--------------|-------------|
| ADMIN | /dashboard/admin | Admin dashboard with platform management tools |
| INSTRUCTOR | /dashboard/instructor | Instructor dashboard for course and student management |
| STUDENT | /dashboard/student | Student dashboard for learning and progress tracking |
| SUPER_ADMIN | /dashboard/admin | Full admin access with additional super user privileges |

---

## Testing Different Roles

### Testing Admin Features

1. Login with Admin account (e.g., `admin1@inr99.com`)
2. Access Admin Dashboard from profile dropdown or direct URL
3. Explore the following features:

   - **User Management:** View, create, edit, and manage user accounts
   - **Platform Statistics:** Monitor total users, courses, and revenue
   - **Course Management:** Review and moderate course content
   - **Category Management:** Organize courses into categories
   - **Analytics Dashboard:** View detailed platform metrics
   - **System Settings:** Configure platform-wide settings

### Testing Instructor Features

1. Login with Instructor account (e.g., `instructor1@inr99.com`)
2. Access Instructor Dashboard from profile dropdown
3. Test the following capabilities:

   - **Course Builder:** Create new courses with modules and lessons
   - **Content Management:** Edit and update course content
   - **Student Tracking:** Monitor student enrollment and progress
   - **Earnings Dashboard:** View revenue and payment history
   - **Assessment Creation:** Build quizzes and assessments
   - **Profile Settings:** Update instructor bio and expertise

### Testing Teacher Features

Teachers have the same INSTRUCTOR role but with specialized functionality:

1. Login with Teacher account (e.g., `teacher1@inr99.com`)
2. Access the Instructor Dashboard
3. Test educational features:

   - **Class Management:** Organize students into classes
   - **Assignment Creation:** Create and distribute assignments
   - **Progress Monitoring:** Track individual student progress
   - **Parent Communication:** View parent-student links
   - **School Integration:** Access school-specific features

### Testing Student Features

1. Login with Student account (e.g., `student1@inr99.com`)
2. Access Student Dashboard
3. Explore learning features:

   - **Course Catalog:** Browse and enroll in courses
   - **Learning Interface:** Watch lessons and complete assessments
   - **Progress Tracking:** View completion percentages
   - **Certificates:** Access earned certificates
   - **Community:** Participate in discussions
   - **Profile:** Update personal information and preferences

---

## Profile Management Features

### Student Profile (`/profile`)

The student profile includes comprehensive personal and learning settings:

- **Personal Information:** Name, email, bio, location, website
- **Notification Preferences:** Email, SMS, and push notification settings
- **Privacy Controls:** Profile visibility and progress sharing options
- **Learning Settings:** Learning mode and reminder preferences
- **Statistics Dashboard:** Course progress, time spent, certificates earned

### Instructor Profile (`/instructor`)

Instructors have access to specialized profile and dashboard features:

- **Application Form:** Complete instructor application process
- **Dashboard:** Course management and student tracking central hub
- **Analytics:** Performance metrics and earnings reports
- **Profile:** Bio, expertise areas, and qualifications
- **Settings:** Teaching style and social media links

### Teacher Profile

Teachers (INSTRUCTOR role) have additional school-oriented features:

- **Class Overview:** View assigned classes and students
- **Assignment Dashboard:** Manage homework and assessments
- **Parent Portal Access:** View parent-student relationships
- **School Integration:** Access school-specific tools and settings

### Admin Features (`/admin`)

Administrators have comprehensive platform management capabilities:

- **User Management:** Full CRUD operations with role assignment
- **Analytics:** Platform usage, revenue tracking, and trends
- **Content Moderation:** Review and approve course submissions
- **System Settings:** Configure platform-wide options
- **Verification Management:** Handle institution verification requests

---

## Testing the Learning Flow

### 1. Course Discovery

Students can explore courses through multiple pathways:

- Use categories dropdown to browse by subject
- Search for specific courses using the search bar
- Browse featured and recommended courses
- View course listings with filters (difficulty, duration, price)

### 2. Course Enrollment

To enroll in a course:

1. Click on a course from the catalog
2. View course details, curriculum, and instructor info
3. Click "Enroll" or "Start Learning" button
4. Access the course from the student dashboard

### 3. Learning Experience

The learning interface provides:

- Video lessons with playback controls
- Text content and downloadable resources
- Quizzes and assessments after each lesson
- Progress tracking with completion indicators
- Note-taking and bookmarking capabilities

### 4. Profile Integration

Access profile features from the dropdown menu:

- Update personal information
- Configure learning preferences
- View learning statistics and achievements
- Manage notification settings
- Download certificates

---

## Feature Availability Summary

### Completed Features

- Role-based access control (Student/Instructor/Admin/Super Admin)
- Complete profile management system
- Instructor dashboard and course management
- Student learning dashboard and progress tracking
- Categories dropdown with proper navigation
- Demo authentication system
- Course creation and management
- Student enrollment tracking
- Learning statistics and analytics
- Assessment and quiz system
- Certificate generation and viewing
- Community discussion features
- Live session management
- Multi-user institutional support
- White-label customization options

---

## Demo Testing Checklist

Use this checklist to ensure comprehensive testing:

### Authentication Testing

- [ ] Login with Admin account (all 3 accounts)
- [ ] Login with Instructor account (all 3 accounts)
- [ ] Login with Teacher account (both accounts)
- [ ] Login with Student account (all 5 accounts)
- [ ] Login with Super Admin account
- [ ] Test incorrect password handling
- [ ] Test non-existent email handling

### Role-Based Navigation

- [ ] Verify admin redirect to /dashboard/admin
- [ ] Verify instructor redirect to /dashboard/instructor
- [ ] Verify student redirect to /dashboard/student
- [ ] Test role-specific navigation menus
- [ ] Verify unauthorized access prevention

### Dashboard Features

- [ ] Explore admin dashboard sections
- [ ] Test instructor course creation
- [ ] Monitor student progress tracking
- [ ] Access profile management features
- [ ] Test notification settings

### Learning Features

- [ ] Browse course catalog
- [ ] Enroll in a course
- [ ] Complete a lesson
- [ ] Take a quiz
- [ ] View progress statistics
- [ ] Download a certificate

---

## Troubleshooting

### Login Issues

If you experience difficulties logging in:

1. **Verify email format:** Use exact demo emails as listed in the credentials table
2. **Check password:** Ensure you are using `demo123` as the password
3. **Clear browser cache:** Delete cookies and cache, then try again
4. **Try different account:** Switch to another demo account of the same role

### Role Not Displaying

If your role information does not appear correctly:

1. Logout and login again with the same credentials
2. Clear browser cache and cookies
3. Verify you are using the correct account for your intended role
4. Check the profile dropdown to see your current role

### Dashboard Not Loading

If dashboards fail to load or show errors:

1. Verify you have the correct role for the requested dashboard
2. Check your internet connection
3. Try refreshing the page
4. Clear browser cache and attempt to login again

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Invalid email or password" | Incorrect credentials | Double-check email and password |
| "Account is disabled" | Account has been deactivated | Contact support team |
| "Too many login attempts" | Rate limit triggered | Wait 15 minutes and retry |

---

## Support and Feedback

For additional assistance with demo accounts or platform testing:

1. Review this documentation for credential information
2. Test with different demo accounts to isolate issues
3. Check browser console for error messages
4. Contact the development team for platform-related questions

---

## Account Purpose Guidelines

### Admin Accounts

Use admin accounts to test:

- Platform-wide management features
- User role management
- Content moderation workflows
- System configuration options
- Analytics and reporting

### Instructor/Teacher Accounts

Use instructor and teacher accounts to test:

- Course creation and editing
- Student management features
- Assessment and quiz tools
- Earnings and payment features
- Communication with students

### Student Accounts

Use student accounts to test:

- Course discovery and enrollment
- Learning experience features
- Progress tracking functionality
- Certificate generation
- Community participation

---

**INR99.Academy - Empowering learners worldwide with affordable, high-quality education.**

The platform supports full role-based access with comprehensive profile management, instructor tools, student learning features, and admin controls - making it a production-ready LMS solution for institutions of all sizes.
