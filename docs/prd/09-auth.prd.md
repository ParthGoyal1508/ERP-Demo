# PRD: Authentication & Account Management

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Authentication (Login, Forgot Password, Account Creation)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction ERP systems require secure, role-based access for users ranging from site workers to super admins. Currently there is no self-service password recovery — forgotten credentials require manual admin intervention, causing delays for field staff who need immediate system access. Account provisioning is also manual and disconnected from the user management workflow.

---

## Proposed Solution

A complete authentication flow with login, forgot password (email-based OTP reset), and admin-only account creation. Integrates with the existing Roles & Permissions system to enforce access control from first login.

---

## Key Features

### 1. Login (`/login`)
- **Login Form**
  - Fields: Email, Password
  - Show/Hide password toggle (eye icon)
  - "Remember Me" checkbox (extends session validity via a long-lived refresh token)
  - "Sign In" button
  - "Forgot Password?" link → navigates to forgot password flow
- **Validation**
  - Empty field validation with inline error messages
  - Invalid credentials → generic error message "Invalid email or password" (does not reveal whether the email exists, to prevent user enumeration)
  - Successful login → redirect to Dashboard, confirmation message "Welcome back, {name}!"
- **Session Management**
  - On successful login, the backend issues a short-lived access token and a refresh token; the access token is used to authorize API requests and is re-validated against the user's current role and status on every request
  - Session persists across page refresh when "Remember Me" is checked, via secure refresh-token renewal
  - Logout revokes the current session/refresh token server-side and redirects to the login page
- **Brute-force protection**
  - Failed login attempts are rate-limited per account and per IP address
  - After 5 consecutive failed attempts, the account is temporarily locked for 15 minutes and the user is notified by email

### 2. Forgot Password (`/forgot-password`)
- **Step 1: Email Verification**
  - Field: Registered Email
  - "Send OTP" button
  - The system checks whether the email exists; regardless of outcome, the UI shows a neutral message ("If an account exists for this email, a verification code has been sent") to prevent user enumeration
  - If the email exists, the backend generates a cryptographically random 6-digit OTP, stores its hash with a 10-minute expiry, and dispatches it via the transactional email service (and SMS, if a mobile number is on file)
- **Step 2: OTP Verification**
  - Field: 6-digit OTP input (auto-focus, numeric only)
  - "Verify OTP" button
  - Resend OTP link with a 60-second cooldown timer; each resend invalidates the previous code
  - OTP verification is rate-limited (max 5 attempts per request) and expires after 10 minutes
  - Invalid or expired OTP → error message "Invalid or expired code, please try again"
  - Valid OTP → issues a short-lived, single-use reset token and advances to Step 3
- **Step 3: Reset Password**
  - Fields: New Password, Confirm Password
  - Password requirements enforced both client-side (UX) and server-side (authoritative): minimum 8 characters, at least 1 uppercase, 1 number, 1 special character; rejects passwords found in common breached-password lists
  - Real-time password strength indicator (Weak/Medium/Strong)
  - Mismatch validation: "Passwords do not match"
  - "Reset Password" button → the reset token is validated and consumed, the new password is hashed and stored, all existing sessions for the account are revoked, confirmation message "Password reset successfully," redirects to Login
- **Back to Login** link available on all steps

### 3. Account Creation (Admin Only — via Settings → Users)
- **Access Control:** Only users with Super Admin or HO User role can create accounts; enforced server-side on the account-creation endpoint
- **Create Account Form** (from `/settings/users` → "Add User" button)
  - **Fields:**
    - Full Name (required)
    - Email (required, unique — server returns "Email already registered" on duplicate)
    - Temporary Password (required, with a "Generate Password" option)
    - Role (dropdown from Roles master — Super Admin, Site Admin, Project Manager, HO User, Accountant, Site Engineer, Store Keeper, Site User, Viewer)
    - Company (dropdown — for multi-company assignment)
    - Linked Employee (optional dropdown — associates the user account with an employee record for My Workspace access)
    - Status: Active (default)
  - "Create Account" button → creates the user record and sends the new user an account-setup email containing a secure, time-limited link to set their own password (rather than transmitting the temporary password in plain text); confirmation message "Account created for {name}"
- **Generated Password Option**
  - "Generate Password" button creates a random 12-character password (letters + numbers + special characters) that is shown once to the admin and never stored or logged in plain text
  - Copy-to-clipboard button next to the generated password, for cases where the admin must communicate it directly (e.g., no email on file yet)
- **First Login Flow**
  - Accounts created with a temporary password are flagged `mustChangePassword: true`; on first successful login, the user is required to set a new password (meeting the same requirements as password reset) before accessing the app
- **Account Deactivation**
  - Admin can toggle user Status to Inactive → the backend immediately revokes all active sessions for that user and rejects further login attempts
  - Confirmation message: "Account deactivated for {name}"
  - Reactivation restores login capability immediately; the user must still complete any pending mandatory password change

### 4. Password Change (Logged-in User)
- Accessible from User Menu dropdown → "Change Password"
- **Fields:** Current Password, New Password, Confirm New Password
- Current password is re-verified against the stored hash before allowing the change
- Same password requirements and strength indicator as password reset
- "Update Password" button → the new password is hashed and stored, other active sessions for the account are revoked (the current session remains valid), confirmation message "Password updated successfully"

---

## Non-Functional Requirements

- **Password storage:** Passwords are hashed using a modern adaptive hashing algorithm (bcrypt or Argon2) with a per-user salt; plain-text passwords are never logged, stored, or transmitted outside the initial account-setup email link.
- **Session/token security:** Access tokens are short-lived (e.g., 15–60 minutes); refresh tokens are long-lived but revocable, stored as secure, httpOnly, SameSite cookies (or platform-equivalent secure storage on mobile).
- **OTP delivery:** OTPs are delivered via a real transactional email/SMS provider integration; OTP values are never returned in API responses or client-visible logs.
- **Transport security:** All authentication endpoints are served exclusively over TLS; no credentials are ever transmitted or accepted over plain HTTP.
- **Auditability:** Login attempts (success/failure), password resets, account creation, role changes, and deactivations are recorded in the Activity Log with actor identity, timestamp, and IP address.
- **Enumeration resistance:** Login and forgot-password responses avoid disclosing whether a given email is registered in the system.
- **Compliance:** Password policy and account lockout behavior are configurable per company to align with the organization's security policy.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Login success rate | > 99% for valid credentials |
| Password reset completion | 90%+ of forgot password flows completed without admin help |
| Account provisioning time | < 2 minutes per new user (admin) |
| First-login password change | 100% of new accounts forced to change temp password |
| Unauthorized access attempts | Zero successful logins with deactivated accounts |
| Credential compromise incidents | Zero passwords recoverable in plain text from stored data |
