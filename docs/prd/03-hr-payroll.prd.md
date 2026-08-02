# PRD: HR & Payroll Module (Attendance & Payroll)

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Attendance & Payroll (Employees, Attendance, Leave, Payroll Runs, Challans, Loans, Daily Worker Registry)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies manage a workforce that is highly distributed (across multiple sites), semi-transient (daily wage and contract workers), and subject to complex statutory compliance (PF, ESIC, Professional Tax). Current processes rely on manual muster rolls, paper-based leave tracking, and spreadsheet payroll — leading to payroll errors, compliance penalties, delayed salary disbursement, and lack of audit trails. Employee onboarding involves collecting 13+ document types with mandatory/expiry tracking that is currently ad-hoc. A large share of on-site labour is daily-wage casual workers who turn over too quickly to justify full employee onboarding and have no system login, yet their attendance still needs to be captured accurately and attributably for wage payout and site headcount reporting.

---

## Proposed Solution

A comprehensive HR & Payroll module covering the full employee lifecycle — from onboarding (with document management and onboarding checklists) through daily attendance, leave management, monthly payroll processing, statutory challan generation, and loan/advance tracking. Multi-company support with cross-company employee transfers.

---

## Key Features

### 1. Employees (`/hr/employees`)

#### Employee List
- **Table columns:** Code, Name (with avatar), Department, Designation, Mobile, Company, Project, Documents (progress bar showing mandatory doc completion), Status (Active/Inactive), Actions (View/Edit/Delete/Transfer)
- **Filters:** Search, Department, Project/Site, Status, Company
- **Sort & Pagination** (server-side, for datasets exceeding a single page)

#### Add/Edit Employee (8-tab form)
- **Identity Tab:** Company, Code Series (auto-gen from company short code), Employee Code, First/Last Name, Title (Mr./Mrs./Ms.), DOB, Gender, Marital Status, Photo upload
- **Employment Tab:** Department (from master), Designation (from master), Type (Full Time/Contract/Daily Wage), Date of Joining, Probation End Date, Confirmation Date, Project/Site assignment, Reporting To (employee dropdown), Shift (from master), Muster Category, Total Working Hours/Day, Salary Rate (₹/Day), Pay Mode (Cash/Bank/Cheque), Calculation Mode (Monthly/Daily), Supervisor Employee, Workman ID, Is Active toggle
- **Statutory Tab:** PF Applicable (Yes/No + With/Without Upper Limit), ESIC Applicable (Yes/No + With/Without Upper Limit), UAN, PF Number, ESIC Number, Aadhaar Number, PAN Number
- **Pay & Bank Tab:** Basic, HRA, Conveyance Allowance, Site Allowance, Special Allowance, Payment Mode (Bank/Cash/Cheque), Bank Name, Branch, Account Number, IFSC Code
- **Contact Tab:** Mobile, Alternate Mobile, Email, Present Address (Address, City, State, PIN), Permanent Address, Emergency Contact (Name, Relation, Phone)
- **Documents Tab:** Upload per document type (from master); types include Aadhaar (MandatoryNumber), PAN (Number), Bank Proof (Mandatory), Photo (Mandatory), Driving Licence (ExpiryNumber), Marksheets, Degree, Experience Letter, Medical Fitness (Expiry), Police Verification, Offer/Appointment/Joining Letters, PF Forms 11 & 2, ESIC Family Declaration. Mandatory docs gate attendance marking.
- **Letters Tab:** Offer Letter (toggle + date), Appointment Letter (toggle + date), NDA (toggle + date)
- **Onboarding Tab:** 7-item checklist: ID Card Issued, Uniform Provided, Safety Induction Completed, Tools Issued, Bank Verification Done, Biometric Enrolled, Site Access Granted

#### Employee Detail Page (tabbed view)
- Overview, Personal Info, Employment, Salary Structure, Attendance Calendar (monthly heatmap), Leave Summary, Documents, Loan History

#### Employee Transfer
- Transfer employees across companies
- Fields: Target Company, Transfer Date, Reason, Retain Employee Code (toggle)
- Transfer history logged in Activity Log

#### Biometric Re-enrolment Requests
- **Access:** HR/Admin roles (Super Admin, Site Admin, HO User)
- **Queue Table:** Columns: Employee, Site, Reason, Requested On, Status (Pending/Approved/Rejected), Actions (Approve/Reject)
- **Approve** (optional remarks) grants the employee a one-time, 7-day re-enrolment unlock in My Workspace → Face Enrolment
- **Reject** (mandatory remarks) closes the request without unlocking; the employee is notified
- Feeds the Notifications Center ("Pending Re-enrolment Requests") and is fully recorded in the Activity Log

#### Employee Setup (Reference Data Masters)
- **Code Series:** Company-wise employee code patterns
- **Departments:** Add/Edit/Delete department names
- **Designations:** Add/Edit/Delete designation names
- **Document Types:** Code, Name, Mandatory toggle (gates attendance), Has Expiry Date, Needs Document Number, Sort Order, Active toggle. Flags: MandatoryNumber, Mandatory, ExpiryNumber, Expiry, Number, Optional
- **Shifts:** Shift name, In Time, Out Time, Grace Period

### 2. Attendance (`/hr/attendance`)

#### Daily Attendance View
- **Table columns:** Emp Code, Employee, Project, Department, Designation, In Time, Out Time, OT Hours, Worked Hours, Status, Approval, Actions (Edit)
- **Status types:** Complete (green), Absent (red), Half Day (orange), On Leave (blue), Holiday (gray)
- **Top controls:** Date picker with navigation arrows, Site filter dropdown

#### Mark/Edit Attendance Modal
- Fields: Employee, Date, In Time, Out Time, Status override, OT Hours, Remarks

#### Exceptions Modal
- Shows punches recorded outside the assigned site's geofence radius
- Columns: Employee, Punch Time, Location (lat/lng), Distance from Site, Status
- Displays the actual GPS coordinates captured at punch time, sourced from the employee's device and validated server-side against the site geofence

#### Modifications Modal (Audit Log)
- Tracks all manual attendance edits
- Columns: Employee, Date, Changed By, Changed From → To, Timestamp

#### Holidays Declaration
- Holiday name, Date, Type (National/Regional/Company), Applicable to (All/Specific sites)
- Holidays auto-apply to attendance (gray "Holiday" status)

### 3. Leave Summary (`/hr/leave`)

#### Leave Applications Table
- **Columns:** Employee, Leave Type, From–To Dates, Days, Reason, Status (Pending/Approved/Rejected), Remarks, Actions (Approve/Reject/Cancel)
- **Approval Workflow:** Pending → Admin clicks Approve (with optional remarks) → Approved badge; or Reject (with mandatory remarks) → Rejected badge
- Approved leaves auto-reflect in Attendance as "On Leave"

#### Leave Balance Table
- **Columns:** Leave Type, Opening Balance, Accrued, Used, Available Balance
- **Types:** Earned Leave, Casual Leave, Sick Leave, Leave Without Pay
- Balances auto-update on approval/rejection

### 4. Payroll Runs (`/hr/payroll`)

#### Payroll List
- **Columns:** Emp Code, Employee, Department, Payable Days, Basic, Allowances, Deductions, Net Pay, Status (Draft/Processed/Paid), Actions
- **Generate Payroll:** Select month → backend calculation engine computes pay for all active employees based on attendance, salary structure, and deductions
- **Status Workflow:** Draft → Mark as Processed → Mark as Paid

#### Salary Slip
- **Header:** Employee name, code, department, designation, company
- **Attendance Summary:** Month Days, Payable Days, LOP Days, OT Hours (4 info boxes)
- **Earnings Table:** Basic, HRA, Conveyance, Site Allowance, Special Allowance, OT Wages — with Monthly Rate and Earned Amount
- **Deductions Table:** Employee PF (12%), Employee ESIC (0.75%), Professional Tax, TDS, Loan EMI, Advance Recovery
- **Employer Contributions (informational):** PF (3.67%), EPS (8.33%), EDLI (0.50%), Admin Charges (0.50%), Gratuity, Bonus
- **Net Pay:** Amount in figures and words
- **Minimum Wages Note:** Compliance statement
- Downloadable as PDF, viewable in both the admin Payroll module and employee My Salary Summary

#### Bank Salary Sheet
- **Columns:** Employee, Bank Name, Account Number, IFSC Code, Net Pay
- Exports in the standard bank upload file format (e.g., NEFT/RTGS batch file) required by the company's banking partner

### 5. Challans (`/hr/challans`)

#### Three Tabs with Month Selector
- **PF Challan Tab**
  - Columns: Emp Code, Employee, UAN, PF Wages, EPS Wages, Employee PF (12%), Employer PF (3.67%), EPS (8.33%), EDLI, Admin Charges, Total
  - Summary row with totals
- **ESIC Challan Tab**
  - Columns: Emp Code, Employee, ESIC Number, ESIC Wages, Employee ESIC (0.75%), Employer ESIC (3.25%), Total
  - Summary row with totals
- **PT Challan Tab**
  - Professional Tax slab-based calculation
  - Company-wise PT registration

#### Behaviors
- Challan data auto-derives from processed payroll
- PF/ESIC pending counts feed into Group Dashboard
- Statutory Calendar entries auto-generate from challan due dates
- Challans export in the government-prescribed file format for direct upload to the respective statutory portal (EPFO, ESIC)

### 6. Loans (`/hr/loans`)

#### Loan List
- **Columns:** Loan ID, Employee, Loan Amount, EMI, Disbursed On, Total Paid, Outstanding Balance, Status (Active/Closed/Pending), Actions (View/Edit/Close)

#### New Loan Modal
- Fields: Employee (dropdown), Loan Amount, EMI Amount, Disbursement Date, Reason, Remarks
- Auto-generates repayment schedule

#### EMI Repayment Schedule
- **Columns:** Month, EMI Amount, Principal, Interest, Remaining Balance, Status (Paid/Upcoming/Overdue)
- Active loan EMIs auto-appear as deductions in payroll

### 7. Daily Worker Registry & Attendance (`/hr/daily-workers`)

Casual and daily-wage labour on construction sites typically turn over too fast, and lack the documentation, for a full Employee record and a login account. This workflow lets a **Site Supervisor** (Site Engineer, Project Manager, or Site Admin role) register a daily worker once and then mark that worker's attendance in real time — no employee account or self-service login required for the worker.

#### Daily Worker Registry
- **Table columns:** Worker ID (auto-gen), Photo (thumbnail), Name, Phone (optional), Site/Project, Trade/Skill (Mason, Helper, Bar Bender, Carpenter, etc.), Daily Wage Rate (₹), Enrolled By, Enrolled On, Status (Active/Inactive), Actions (Edit/Deactivate)
- **One-Time Enrolment Form** (Site Supervisor only):
  - Fields: Full Name, Phone (optional), Gender, Site/Project (defaults to supervisor's assigned site), Trade/Skill, Daily Wage Rate
  - Photo Capture: live device camera capture, minimum 3 / maximum 5 photos — same underlying face-template pipeline used for employee Face Enrolment, but attached to a lightweight Daily Worker record rather than a full Employee/user record
  - Consent: a simplified on-site consent acknowledgement (Site Supervisor confirms the worker was informed and consented to photo capture for attendance purposes), captured with supervisor's name and timestamp in lieu of a digital signature
  - No login credentials, statutory (PF/ESIC/PAN/Aadhaar) fields, or bank details are collected at this stage — a daily worker can later be converted to a full Employee record by HR if they move to a permanent/contract role, carrying forward their photo and enrolment history
- **Deactivation:** A worker leaving the site is marked Inactive so they stop appearing in the daily attendance capture list; historical attendance records are retained

#### Daily Worker Attendance Capture
- **Site Supervisor view:** A simple, mobile-optimized live camera screen listing daily workers active at the supervisor's site
- **Mark Present flow:** Supervisor selects a worker (or uses live face-match against the site's active daily-worker roster) and captures a photo at the moment of marking; the captured photo, GPS location, timestamp, and marking supervisor are stored against that day's attendance record
- **Fallback:** If face-match is inconclusive or the camera is unavailable, the Supervisor can mark attendance manually by selecting the worker from the roster (photo capture still recommended but not blocking, with the exception logged)
- **Bulk marking:** Supervisor can mark multiple workers present for the same site/day in one session (e.g., at the start of the shift), and mark individual absences later in the day
- **Daily Worker Attendance Table:** Columns: Date, Site, Worker, Trade, Marked By (Supervisor), Time, Photo, Status (Present/Absent), Wage Payable (Daily Wage Rate × 1 if Present)

#### Behaviors
- Daily worker attendance is tracked separately from the regular Employee Attendance table (distinct "Daily Worker" tag) but rolls up into the same site-level headcount figures used in Site Dashboard ("Workers Today") and Daily Work Reports ("Workers on Site")
- Daily wage payouts are summarized per site/period for cash or bank disbursement, but do not enter the statutory PF/ESIC/payroll-slip pipeline used for regular Employees (daily workers are not on formal payroll)
- Only the Site Supervisor who enrolled a worker, or another supervisor assigned to the same site, can mark that worker's attendance
- All enrolments and attendance markings are recorded in the Activity Log with the acting supervisor's identity

---

## Non-Functional Requirements

- **Data persistence:** All employee, attendance, leave, payroll, and loan records are stored in the production relational database with referential integrity — no client-only storage for business records.
- **PII protection:** Aadhaar, PAN, bank account numbers, and UAN are encrypted at rest, masked in the UI (showing only last 4 digits by default), and access is logged.
- **Payroll integrity:** Once a payroll run is marked Processed or Paid, its figures are immutable; corrections require a new adjustment entry in the following cycle, preserving a full audit trail.
- **Geofence validation:** Attendance punch geolocation is validated server-side using the real coordinates captured from the employee's device against the assigned site's geofence radius.
- **Statutory compliance:** Challan calculations follow current EPFO/ESIC/PT statutory rates, which are configurable per company to accommodate rate changes without a code release.
- **Document storage:** Uploaded employee documents are stored in secure, access-controlled file storage with virus scanning on upload and expiry-based reminder scheduling.
- **Biometric re-enrolment authorization:** Re-enrolment unlocks are single-use, time-boxed (7 days), and enforced server-side; the API rejects any photo-replace request lacking an active admin-granted unlock.
- **Daily worker data minimization:** Daily Worker records collect only what is required for site attendance and wage payout (name, photo, trade, site, wage rate) — no statutory identifiers are collected or stored unless the worker is later converted to a full Employee record, limiting PII exposure for a highly transient population.
- **Supervisor-scoped access:** Daily Worker enrolment and attendance marking are restricted server-side to supervisors assigned to that worker's site, preventing cross-site tampering.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Payroll processing time | < 30 minutes for 100 employees (vs 2 days manual) |
| Statutory compliance | 100% PF/ESIC challans filed before due date |
| Attendance accuracy | 95%+ auto-captured (reduced manual corrections) |
| Employee onboarding time | < 1 hour (document upload + checklist) |
| Leave approval turnaround | Same-day approval/rejection |
| Payroll errors | < 1% variance from manual verification |
| Mandatory document compliance | 100% employees have all mandatory docs before attendance marking |
| Daily worker enrolment time | < 2 minutes per worker (photo capture + basic details) |
| Daily worker attendance capture time | < 15 seconds per worker per marking |
| Biometric re-enrolment requests | 100% resolved (approved or rejected) within 24 hours |
