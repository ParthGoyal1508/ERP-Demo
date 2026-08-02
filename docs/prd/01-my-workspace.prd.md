# PRD: My Workspace Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** My Workspace
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Field workers and site employees in construction companies lack a self-service portal for basic HR tasks. They rely on site supervisors or HR staff to record attendance, apply for leave, and access salary information — creating bottlenecks, data entry errors, and delays. Biometric enrolment for face-based attendance currently requires physical visits to HR offices.

---

## Proposed Solution

A self-service workspace within BuildCore ERP that allows every employee to:
- Punch in/out using their device camera and live GPS location
- View attendance history and apply for leave
- Access their own salary slips
- Enrol face biometrics remotely with consent management

All actions are submitted to the backend and reflected directly in the admin-facing HR & Payroll module with no duplicate data entry.

---

## Key Features

### 1. My Punch (`/my/punch`)
- **Monthly Attendance History Table**
  - Columns: Date, Day, In Time, Out Time, OT Hours, Status
  - Status badges: Present (green), Absent (red), Weekly Off (gray), Holiday (gray)
- **Punch In/Out Screen**
  - Live clock display with current server-synced time
  - Three info boxes: IN TIME, OUT TIME, WORKED hours
  - "Punch In" / "Punch Out" button
  - Live device camera capture for face verification against enrolled biometric photos
  - Device GPS location captured at time of punch and validated server-side against the assigned site's geofence radius
  - Payroll lock warning: month is locked once payroll is processed (no edits allowed) per company payroll lock-day setting
- **Behaviors**
  - Punch submissions are sent to the backend and recorded in the admin Attendance module in real time
  - Punches outside the geofence radius are flagged as exceptions and routed to Attendance → Exceptions for review
  - Face verification failures require a supervisor override or manual approval
  - Month/year navigation for history

### 2. My Leave (`/my/leave`)
- **Leave Balance Table**
  - Columns: Leave Type, Opening, Accrued, Used, Balance
  - Types: Earned Leave, Casual Leave, Sick Leave, Leave Without Pay
  - Financial year selector for historical view
- **My Applications Table**
  - Columns: Type, From–To Dates, Days, Reason, Status, Remarks, Action (Cancel)
  - Status: Pending (yellow), Approved (green), Rejected (red)
  - Cancel action available only for Pending applications
- **Apply Leave Form**
  - Fields: Leave Type (dropdown), From Date, To Date, Reason (textarea)
  - Auto-calculates number of days (excluding weekends/holidays, based on the site's Holiday calendar)
  - Validation: cannot exceed available balance (except LWP)
- **Behaviors**
  - Applications are submitted to the backend and appear in admin Leave Summary for approval
  - Approved leaves auto-reflect in attendance as "On Leave" status
  - Applicants receive a notification when their application is approved or rejected

### 3. My Salary Summary (`/my/salary`)
- **Salary Slip View** (read-only, same format as admin payroll slip)
  - Employee info header (name, code, department, designation)
  - Attendance summary: Month Days, Payable Days, LOP Days, OT Hours
  - Earnings table: Basic, HRA, Conveyance, Site Allowance, Special Allowance, OT
  - Deductions table: PF, ESIC, PT, TDS, Loan EMI, Advance Recovery
  - Employer Contributions (informational): PF, EPS, EDLI, Admin Charges, Gratuity, Bonus
  - Net Pay with amount in words
  - Minimum wages compliance note
- **Month Selector:** Only shows months where payroll has been processed (status = Processed or Paid)
- **Download:** Employee can download their salary slip as a PDF for personal records

### 4. Face Enrolment (`/my/face-enrol`)
- **Enrolment Status Display**
  - "Not enrolled yet" (gray badge) or "Enrolled on DD MMM YYYY" (green badge)
- **Photo Capture Section**
  - Counter: X/5 photos captured (max 5)
  - Thumbnail grid of captured photos
  - "Capture" button — activates the device camera for live photo capture
  - Minimum 3 photos required for enrolment
- **Biometric Consent Section**
  - Consent Method dropdown: Signed Paper / Digital / Verbal
  - Consent Acknowledgement checkbox with data usage terms
  - Note on the employee's right to withdraw consent and request deletion of biometric data
- **Enrol Action**
  - Disabled until: >= 3 photos captured AND consent checkbox checked
  - On submit: photos are uploaded and processed into a biometric face template stored securely; confirmation message "Face enrolled successfully"
- **Re-enrolment Flow (Admin-Gated)**
  - Once an employee is enrolled, the photo capture and Enrol controls are locked — an employee cannot silently overwrite their existing biometric template
  - **Step 1 — Request:** Employee clicks "Request Re-enrolment," selects a reason (e.g., Face not recognized, Device changed, Appearance change), and submits. Status badge changes to "Re-enrolment Requested (Pending Approval)"
  - **Step 2 — Admin Review:** The request appears in a "Biometric Re-enrolment Requests" queue (HR & Payroll module) showing Employee, Site, Reason, Requested On, and Approve/Reject actions. A Notification is raised for HR/Admin users
  - **Step 3 — Grant:** Admin clicks Approve (optional remarks) → the employee's Face Enrolment page unlocks a one-time-use "Re-enrol Now" action; Admin clicks Reject (mandatory remarks) → request closed, employee notified, no unlock granted
  - **Step 4 — Re-capture:** Employee (or, for an on-site reset, the Site Supervisor) completes fresh photo capture (min 3, max 5) and consent re-acknowledgement; on submit, the previous biometric template is securely deleted and replaced with the new one, and the one-time unlock is consumed
  - The unlock expires after 7 days if unused, requiring a new request
  - All requests, approvals, rejections, and completed re-enrolments are recorded in the Activity Log

---

## Non-Functional Requirements

- **Device integration:** Camera capture uses the device's native camera (browser MediaDevices API on web, native camera SDK on mobile apps); geolocation uses the device's GPS via the platform Geolocation API with a minimum accuracy threshold before a punch is accepted.
- **Server-side validation:** Geofence checks and face-match confidence scoring are performed on the backend, not the client, to prevent spoofing.
- **Biometric data protection:** Captured photos and derived face templates are encrypted at rest, access-logged, and retained per the company's data retention policy. Consent withdrawal triggers permanent deletion of biometric data within the policy window.
- **Payroll lock enforcement:** Once payroll for a period is processed, punch and leave edits for that period are rejected server-side, regardless of client state.
- **Offline handling:** If connectivity is unavailable at punch time, the app queues the punch locally (with captured photo and GPS coordinates) and syncs to the backend once connectivity is restored, preserving the original timestamp.
- **Re-enrolment authorization:** The backend rejects any re-enrolment/photo-replace request that lacks an active, unexpired, unconsumed admin-granted unlock for that employee — this is enforced at the API level, not just hidden in the UI, so a direct API call cannot bypass admin approval.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Self-service punch adoption | 80% of employees using My Punch within 30 days |
| Leave application processing time | Reduced from 2 days (manual) to same-day |
| HR data entry reduction | 60% fewer manual attendance corrections |
| Face enrolment completion | 90% of employees enrolled within first month |
| Salary slip inquiries to HR | 70% reduction (employees self-serve) |
| Geofence exception rate | < 5% of punches flagged as out-of-geofence |
| Re-enrolment turnaround | Admin decision within 24 hours of request |
| Unauthorized biometric changes | Zero re-enrolments completed without a prior admin approval |
