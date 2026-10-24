# Authentication, Authorization, and Security

## 1. Authentication

TeacherHub currently uses frontend-only demonstration authentication. Registration stores user information in browser localStorage under the `teacherHubUsers` key. Login checks the entered email and password against the stored records.

When login succeeds, the application stores the current user's name and email under the `teacherHubUser` key.

## 2. Authorization

The current localStorage-based login does not provide secure server-side authorization. A user may access dashboard routes directly or modify browser storage. Therefore, the login flow must not be considered sufficient protection for private data.

## 3. Security Limitations

- Passwords are stored in plain text in browser localStorage.
- Users can inspect or modify localStorage.
- Authentication data is not shared between localhost and the deployed website.
- Client-side checks alone cannot protect sensitive pages or API endpoints.
- This demonstration is not suitable for real accounts or confidential information.

## 4. Security Improvements

Future versions should implement:

- Server-side authentication.
- Secure password hashing.
- Secure session cookies.
- Server-side authorization checks for protected pages and API routes.
- Input validation and appropriate error handling.
- A secure database for user information.

## 5. Current Security Status

The current authentication is for demonstration purposes only. No claim of secure production authentication or server-side authorization is made.
