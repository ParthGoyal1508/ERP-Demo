/* -- Documentation / PRD viewer -- */

const PRD_MODULES = [
    { id: "my-workspace", title: "My Workspace", icon: "fa-briefcase", color: "#3b82f6", desc: "Punch, Leave, Salary, Face Enrolment" },
    { id: "dashboard", title: "Dashboard & General", icon: "fa-chart-line", color: "#10b981", desc: "Dashboard, Group, Site, Notifications, Activity Log, Reports" },
    { id: "hr-payroll", title: "HR & Payroll", icon: "fa-users", color: "#f59e0b", desc: "Employees, Attendance, Leave, Payroll, Challans, Loans, Daily Workers" },
    { id: "machinery", title: "Machinery", icon: "fa-truck", color: "#8b5cf6", desc: "Assets, Logbook, Fuel, Maintenance, Hire Bills" },
    { id: "projects", title: "Projects", icon: "fa-project-diagram", color: "#ec4899", desc: "Portfolio, DWR, P&L, Clients, Sites" },
    { id: "partners", title: "Partners", icon: "fa-handshake", color: "#14b8a6", desc: "Vendors, Contractors, Compliance, RAG Matrix, BOCW" },
    { id: "inventory", title: "Inventory", icon: "fa-boxes", color: "#f97316", desc: "Stock, Purchases, Issues, Transfers, Payments" },
    { id: "settings", title: "Settings", icon: "fa-cog", color: "#6b7280", desc: "Companies, Users, Roles & Permissions" },
    { id: "auth", title: "Authentication", icon: "fa-lock", color: "#ef4444", desc: "Login, Forgot Password, Account Creation" },
];

const PRD_RAW = {};
PRD_RAW["my-workspace"] = `# PRD: My Workspace Module

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

### 1. My Punch (\`/my/punch\`)
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

### 2. My Leave (\`/my/leave\`)
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

### 3. My Salary Summary (\`/my/salary\`)
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

### 4. Face Enrolment (\`/my/face-enrol\`)
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
`;
PRD_RAW["dashboard"] = `# PRD: Dashboard & General Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Dashboard & General (Dashboard, Group Dashboard, Site Dashboard, Notifications, Activity Log, Reports)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction company management lacks a unified operational view. Key metrics — employee attendance, project health, machinery status, expense overruns, statutory compliance deadlines — are scattered across spreadsheets, messaging apps, and disconnected tools. Decision-makers cannot identify issues (expiring documents, missed compliance, idle machinery, pending approvals) until they escalate.

---

## Proposed Solution

A multi-level dashboard system that surfaces real-time KPIs, proactive alerts, and cross-module insights at three levels: company-wide, group-wide (multi-company), and per-site. Complemented by auto-generated notifications, a full activity audit trail, and consolidated reporting — all computed live from the operational database.

---

## Key Features

### 1. Dashboard (\`/dashboard\`)
- **8 KPI Cards** (clickable, navigate to source module)
  - Total Employees → \`/hr/employees\`
  - Present Today → \`/hr/attendance\`
  - Absent → \`/hr/attendance\`
  - On Leave → \`/hr/leave\`
  - Active Projects → \`/projects/portfolio\`
  - Total Machinery → \`/machinery\`
  - Monthly Expenses (computed)
  - Pending Approvals → \`/hr/leave\`
- **Quick Stats Sidebar**
  - Contract Value total (from Projects)
  - Employees on Muster (present/total from Attendance)
  - Materials Cost (from Inventory Purchases)
  - Fuel Cost (from Machinery Fuel)
  - Hire Bills (from Machinery Hire Bills)
- **Alerts & Reminders Section**
  - Generated from Machinery service schedules and document expiry dates
  - Alert types: Engine oil/filter change approaching (with remaining units), Document expiry warnings (PUC, Insurance) with dates
  - Footer link: "Open the asset register for per-machine flags"
- **Active Projects Card**
  - Count of active projects, total contract value
  - Link: "Open the portfolio"
- **Today's Attendance Table** (bottom left, first 8 records)
  - Columns: Employee, Department, Status
- **Recent Leaves Table** (bottom right)
  - Columns: Employee, Type, Days, Status
- **All values are computed live from the operational database** via backend aggregation queries — never hardcoded or client-cached beyond a short refresh interval

### 2. Group Dashboard (\`/group\`)
- **Company Cards** (one per company + Group Total summary)
  - Metrics per company: Headcount, Payroll Cost (₹), PF/ESIC Pending count, Loans Outstanding (₹), Docs Pending count
  - Group Total card aggregates all companies
- **Statutory Calendar**
  - Financial Year selector (dropdown)
  - Table: Company, Kind (PF/ESIC/PT), Period, Due Date, Amount, Status (Pending/Filed/Overdue)
  - Generated from Challans module data
- **Group Employee Search**
  - Search by name, employee code, or Aadhaar last-4 digits (min 2 chars)
  - Searches across all companies in the group, scoped to the requesting user's group-level access

### 3. Site Dashboard (\`/site-dashboard\`)
- **Site Selector Dropdown** — populated from project sites
- **4 KPI Cards** (refresh on site change)
  - Workers Today (attendance filtered by site)
  - Machinery Deployed (assets filtered by site)
  - Fuel Consumed This Month (L) (fuel filtered by site)
  - Material Stock Value (stock filtered by project)
- **Sections** (all filtered by selected site):
  - Today's Attendance table: Employee, Department, Status
  - Machinery at Site table: ID, Machine, Category, Reading, Utilization, Document Status
  - Fuel Consumption (last 10 entries): Date, Machine, Quantity (L), Amount
  - Material Stock table: Item, Category, In Stock, Stock Value
  - Recent Expenses (last 5 purchases): Date, Item, Vendor, Amount

### 4. Notifications Center (\`/notifications\`)
- **System-generated notifications** (computed by scheduled backend jobs and real-time triggers, not manually created)
  - Document Expiry (red): Equipment documents expiring within 30 days or expired
  - Pending Leave Approvals (yellow): Leave applications with status "Pending"
  - Maintenance Due (orange): Open maintenance jobs or due services
  - Fuel Variance (red): Consumption exceeds category benchmark by >15%
  - Contractor Compliance (red): Missing compliance submissions for current/previous month
  - Payroll Pending (blue): Months with no payroll run
  - Biometric Re-enrolment Requests (yellow): Employee re-enrolment requests awaiting admin approval
- **Notification Row:** Icon (colored), Title (bold), Subtitle (details + timestamp), Action link → relevant page
- **Header Bell Badge:** Total count of active notifications, refreshed on a polling interval or push update
- **No manual dismiss** — notifications disappear when the underlying condition resolves

### 5. Activity Log (\`/activity-log\`)
- **Chronological feed** of all user actions, newest first
- **Filters:** Module filter (All / HR / Payroll / Machinery / Projects / Inventory / Partners / Settings), Time range (Today / 7 days / 30 days)
- **Entry format:** Avatar/Icon → **User** performed **action** on **target** — Timestamp
- **Actions tracked across all modules:**
  - HR: Employee added/edited, Attendance modified, Leave approved/rejected, Biometric re-enrolment requested/approved/rejected, Daily worker enrolled/deactivated, Daily worker attendance marked
  - Payroll: Payroll run generated, Salary slip viewed
  - Machinery: Asset added, Logbook/Fuel/Maintenance entries, Document added
  - Projects: Project added/edited, DWR submitted/approved, Client/Site added
  - Inventory: Purchase/Issue/Transfer/Payment recorded, Item Master added
  - Partners: Vendor/Contractor added, Compliance recorded/verified
  - Settings: Company/User/Role changes
- **Storage:** Persisted in a dedicated audit log table (\`activity_log\`), retained per the company's compliance/retention policy (not capped in application memory), each entry: \`{ id, timestamp, user_id, action, module, target, detail }\`

### 6. Reports (\`/reports\`)
- **8 Report Types:** Attendance, Payroll, Employee, Machinery, Fuel, Project Cost, Expense, P&L
- **Each report includes:**
  - Date range picker (From — To)
  - Relevant filters (department, project, category, etc.)
  - Tabular data display
  - Export button → generates a real PDF or Excel file via the backend export service; the file downloads to the user's device and can optionally be emailed

### 7. Equipment Utilization Report (\`/machinery/utilization\`)
- **Month Selector** (defaults to current month)
- **4 Summary Cards:** Total Machines, Underutilized (<60%), Well Utilized (80-95%), Overutilized (>95%)
- **Horizontal Stacked Bar** showing utilization band distribution
  - Underutilized (<60%) — Red
  - Normal (60-80%) — Yellow
  - Well Utilized (80-95%) — Green
  - Overutilized (>95%) — Orange
- **Detailed Table:** Machine, Category, Site, Ownership, Utilization % (with progress bar), Band, Recommendation ("Release if hired" / "OK" / "Optimal" / "Hire backup")
- Sorted by utilization % ascending (worst first)
- Hired + Underutilized machines flagged prominently

---

## Non-Functional Requirements

- **Live data only:** All KPIs, alerts, and report data are computed from the production database via backend aggregation/query services. No hardcoded or placeholder values are permitted in any environment above local development.
- **Performance:** Dashboard queries are indexed and/or pre-aggregated so that page load completes within 3 seconds under normal load (up to 500 employees, 50 active projects).
- **Export service:** Reports are rendered server-side into PDF/Excel using a dedicated export/rendering service; large exports are generated asynchronously with a download-ready notification.
- **Audit retention:** Activity Log entries are retained for a minimum of 3 years (or per statutory requirement) and are immutable once written.
- **Access scoping:** Group Dashboard and cross-company search respect the requesting user's company/group access as defined in Roles & Permissions.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to identify critical issues | < 30 seconds (from dashboard load) |
| Document expiry misses | Zero expired documents without prior 30-day alert |
| Statutory filing deadline misses | Zero missed deadlines (statutory calendar coverage) |
| Report generation time | < 5 seconds per report (async for large exports) |
| Activity log coverage | 100% of CRUD operations logged |
| Site manager daily check-in time | Reduced from 45 min (manual) to 5 min (Site Dashboard) |
`;
PRD_RAW["hr-payroll"] = `# PRD: HR & Payroll Module (Attendance & Payroll)

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

### 1. Employees (\`/hr/employees\`)

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

### 2. Attendance (\`/hr/attendance\`)

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

### 3. Leave Summary (\`/hr/leave\`)

#### Leave Applications Table
- **Columns:** Employee, Leave Type, From–To Dates, Days, Reason, Status (Pending/Approved/Rejected), Remarks, Actions (Approve/Reject/Cancel)
- **Approval Workflow:** Pending → Admin clicks Approve (with optional remarks) → Approved badge; or Reject (with mandatory remarks) → Rejected badge
- Approved leaves auto-reflect in Attendance as "On Leave"

#### Leave Balance Table
- **Columns:** Leave Type, Opening Balance, Accrued, Used, Available Balance
- **Types:** Earned Leave, Casual Leave, Sick Leave, Leave Without Pay
- Balances auto-update on approval/rejection

### 4. Payroll Runs (\`/hr/payroll\`)

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

### 5. Challans (\`/hr/challans\`)

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

### 6. Loans (\`/hr/loans\`)

#### Loan List
- **Columns:** Loan ID, Employee, Loan Amount, EMI, Disbursed On, Total Paid, Outstanding Balance, Status (Active/Closed/Pending), Actions (View/Edit/Close)

#### New Loan Modal
- Fields: Employee (dropdown), Loan Amount, EMI Amount, Disbursement Date, Reason, Remarks
- Auto-generates repayment schedule

#### EMI Repayment Schedule
- **Columns:** Month, EMI Amount, Principal, Interest, Remaining Balance, Status (Paid/Upcoming/Overdue)
- Active loan EMIs auto-appear as deductions in payroll

### 7. Daily Worker Registry & Attendance (\`/hr/daily-workers\`)

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
`;
PRD_RAW["machinery"] = `# PRD: Machinery Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Machinery (Asset Register, Logbook, Fuel, Maintenance, Hire Bills, Equipment Categories, Equipment Doc Types, Hire Rates)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies operate fleets of heavy equipment (excavators, loaders, pavers, generators) worth crores — both owned and hired. Without centralized tracking, they face: untracked fuel theft and consumption variance, missed document renewals (RC, Insurance, PUC, Fitness) leading to legal penalties, unverified hire bills leading to overpayment, reactive maintenance causing costly breakdowns, and no visibility into asset utilization (paying for idle hired machines).

---

## Proposed Solution

A comprehensive machinery management module covering the full lifecycle of construction equipment: asset registration with document tracking, daily logbook entries, fuel consumption monitoring with variance alerts, preventive and breakdown maintenance scheduling, hire bill verification against logbook data, and utilization analytics for hire-vs-release decisions.

---

## Key Features

### 1. Asset Register (\`/machinery\`)

#### Equipment List
- **Table columns:** Code, Machine (name + model), Class (Equipment/Tool/Plant/Vehicle), Category, Ownership (Owned/Hired), Status (Active/Inactive/Under Maintenance), Site (deployed at), Reading (hrs/km), Utilization %, Flags (alert badge count)
- **Filters:** Search, Category, Ownership, Status, Site
- **Alert Flags:** Count of expiring/expired documents + overdue maintenance

#### Add/Edit Equipment Modal
- **Fields:**
  - Code (auto-gen, editable), Name, Category (from Equipment Categories master), Ownership (Owned/Hired), Class (Equipment/Tool/Plant/Vehicle), Power Source (Diesel/Petrol/Electric/Manual)
  - Status (Active/Inactive/Under Maintenance), Deployed at Site (from Projects → Sites)
  - Make, Model, Manufacturing Year, Registration Number, Chassis Number, Engine Number
  - Current Reading (hrs or km based on category meter type)
  - Fuel Benchmark Override (L/hr or L/km — overrides category default)
  - Purchase Date, Purchase Cost, Depreciation Method (WDV/SLM), Depreciation Rate (%)

#### Equipment Documents
- **Per-machine document tracking** with types from Equipment Doc Types master
- **Document types:** RC, Insurance, PUC/Pollution Certificate, Fitness, Permit, Road Tax, Loan Document, Calibration, Warranty, Other
- **Each document record:** Document Number, Expiry Date, File Upload, Status
- **Status auto-derived:**
  - Valid (green) — expiry > 30 days away
  - Expiring Soon (yellow) — expiry within 30 days (configurable remind days per doc type)
  - EXPIRED (red) — past expiry date
- **Expiry alerts** flow to Dashboard Alerts and Notifications Center via a scheduled backend job that scans expiry dates daily

### 2. Logbook (\`/machinery/logbook\`)

#### Logbook Entries Table
- **Columns:** Date, Machine, Site, Operator, Opening Reading, Closing Reading, Total Hours/Km (auto-calc: Closing − Opening), Fuel (L), Remarks, Actions (Edit/Delete)
- **Add Entry Modal:** Machine (dropdown), Date, Site, Operator (employee dropdown), Opening Reading (auto-populated from last closing), Closing Reading, Fuel Consumed (L), Remarks

#### Auto-Behaviors
- Logbook entries auto-update machine's Current Reading in Asset Register
- Total Hours/Km data used for utilization calculation
- Logbook hours used to verify Hire Bills

### 3. Fuel (\`/machinery/fuel\`)

#### Fuel Entries Table
- **Columns:** Date, Machine, Site, Quantity (L), Rate (₹/L), Amount (auto-calc: Qty × Rate), Reading at Fill, Vendor (from Partners → Vendors of type Fuel), Actions (Edit/Delete)
- **Summary Totals Bar:** Total Fuel (L), Total Cost (₹), Average Consumption (L/hr or L/km)
- **Filters:** Date range, Machine, Site

#### Fuel Variance Alerts
- If actual fuel consumption exceeds the category benchmark by >15% (threshold configurable in Equipment Categories), an alert is raised
- Alert appears in: Machinery Flags, Dashboard Alerts, Notifications Center
- Helps detect fuel theft or inefficient operation

### 4. Maintenance (\`/machinery/maintenance\`)

#### Due Services Section
- **Table columns:** Machine, Service Name, Interval (every X hrs/km), Remaining (units until due), Last Done (date + reading)
- Services turn red when Remaining < 10% of interval

#### Maintenance Jobs Section
- **Table columns:** Machine, Opened (date), Job Type (Breakdown/Scheduled), Problem Description, Total Cost (₹), Status (Open/In Progress/Closed), Actions (Edit/Close)

#### New Maintenance Job Modal
- Fields: Machine, Job Type (Breakdown/Scheduled), Linked Service (optional — from Due Services), Reading at Service, Problem Description (textarea)

#### New Service Schedule Modal
- Fields: Machine, Service Name (e.g., "Engine Oil Change"), Interval (hrs/km), Last Done Reading, Last Done Date

#### Auto-Behaviors
- Opening a job → machine Status changes to "Under Maintenance"
- Closing a job → machine Status resets to "Active"
- If job is linked to a service → closing updates "Last Done" reading and date, resets "Remaining" counter
- Open/due maintenance jobs generate Notifications

### 5. Hire Bills (\`/machinery/hire-bills\`)

#### Hire Bill List
- **Columns:** Bill #, Vendor, Machine, Period (From–To), Billed Hours, Logbook Hours, Variance (Billed − Logbook), Amount (₹), TDS (₹), Net Payable (₹), Status (Pending Verification/Verified/Paid), Actions

#### Add Hire Bill Modal
- Fields: Vendor (from Partners), Machine, Period From/To, Billed Hours, Rate (auto from Hire Rates), Amount, Party Bill Number

#### Verification Workflow
1. New bill created → Status: Pending Verification
2. Admin clicks "Verify" → system compares Billed Hours to the sum of Logbook Hours for that machine/period
3. Variance displayed — positive variance means over-billed (highlighted red)
4. If variance is within the acceptable threshold → Status: Verified
5. "Mark Paid" becomes available → calculates TDS (using vendor TDS % from Partners) and Net Payable
6. Status: Paid

#### Auto-Behaviors
- Billed vs Logbook comparison is automatic
- TDS calculation uses vendor's TDS section and rate from Partners module
- Rate auto-populated from Hire Rates master for the machine's category

### 6. Equipment Categories (\`/machinery/categories\`)
- **Table columns:** Category Name, Class (Plant/Tool/Equipment/Vehicle), Meter Type (hrs/km), Fuel Benchmark (L/hr or L/km), Sort Order, Actions (Edit)
- **Fuel Variance Alert Threshold:** Configurable percentage (default 15%)
- **Default categories shipped with the system** (admin-editable): Excavator, Backhoe Loader, Bulldozer, Wheel Loader, Grader, Roller, Paver, Pump, Plant, Crusher — each with an industry-standard fuel benchmark that companies can override

### 7. Equipment Doc Types (\`/machinery/doc-types\`)
- **Table columns:** Document Type Name, Code, Flags (Number/Expiry indicators), Default Remind Days (before expiry), Sort Order, Actions (Edit)
- **New/Edit Modal:** Code, Name, Default Remind Days, Sort Order, Has Expiry Date (toggle), Needs Document Number (toggle), Active (toggle)
- **Default document types shipped with the system** (admin-editable): RC, Insurance, PUC, Fitness, Permit, Road Tax, Loan Doc, Calibration, Warranty, Other

### 8. Hire Rates (\`/machinery/rates\`)
- **Table columns:** Applies To (Category), Rate per Unit (₹/hr or ₹/km), Effective From (date), Effective To (date or "Current")
- **Add Rate Modal:** Category (dropdown), Rate, Effective From, Effective To (optional — blank = current)
- Rates are entered and maintained per company/region since hire rates vary by market and contract; the system maintains a full effective-dated history so historical hire bills always reference the rate in force at the time

---

## Non-Functional Requirements

- **Data persistence:** Asset, logbook, fuel, and maintenance records are stored in the production database; utilization and variance calculations are computed server-side from actual recorded data.
- **Document storage:** Uploaded equipment documents (RC, Insurance, PUC, etc.) are stored in secure file storage with a daily scheduled job scanning for approaching/expired documents.
- **Financial accuracy:** Hire bill verification, TDS calculation, and rate lookups must use the exact effective-dated rate and vendor TDS configuration in force for the billing period, with full audit trail of any overrides.
- **Alerting:** Fuel variance and maintenance-due alerts are generated by scheduled backend jobs, not client-side computation, so they fire consistently regardless of who is logged in.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Document expiry compliance | Zero machines operating with expired documents |
| Fuel variance detection | 100% of >15% variances flagged within 24 hours |
| Hire bill overpayment prevention | Zero unverified bills paid |
| Maintenance-driven breakdowns | 50% reduction (via preventive service schedules) |
| Asset utilization visibility | 100% machines tracked with monthly utilization % |
| Hired + underutilized detection | All hired machines <60% utilization flagged for release review |
`;
PRD_RAW["projects"] = `# PRD: Projects Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Projects (Portfolio, Daily Work Reports, Project P&L, Clients, Sites)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction project management involves tracking budgets running into crores, coordinating labour/machinery/materials across multiple sites, monitoring daily progress against BOQ targets, managing RA bills and subcontractor billing, and calculating real-time P&L. Currently, project managers rely on disconnected DPR (Daily Progress Report) notebooks, manual cost tracking, and periodic P&L calculations that are always weeks behind reality — making it impossible to catch cost overruns before they become critical.

---

## Proposed Solution

A project management module that provides portfolio-level visibility, per-project deep-dive (with tabs for employees, machinery, materials, DWRs, bills, revenue, and P&L), daily work report capture with BOQ-linked quantity tracking, and dynamic P&L calculation that updates as financial records change across all modules.

---

## Key Features

### 1. Portfolio (\`/projects/portfolio\`)

#### Project List
- **Columns:** Code, Project Name, Client, Location, Contract Value (₹), Status (Planning/Ongoing/On Hold/Completed), Start Date, End Date, Actions (View/Edit/Delete)
- **Filters:** Search, Status, Client
- **Sort & Pagination**

#### Add/Edit Project Modal
- **Fields:**
  - Code (auto-gen, editable), Project Name, Client (from Clients master), Location
  - Contract Value (₹), Start Date, Expected End Date
  - Status (Planning/Ongoing/On Hold/Completed)
  - Project Manager (employee dropdown)
  - Department Type (dropdown), Project Type (e.g., Road, Building, Bridge)
  - Division (Contract/Own)
  - Site/Toll/Plant Start Date, Purchase Limit, Order Number
  - Is HO (checkbox), Site Type (Site/Toll/Plant)
  - Is Locked (checkbox — "After locking, entries cannot be made")
  - CGST Rules applicability checkbox
  - Description (textarea)

#### Project Detail Page (tabbed)
- **Overview Tab:** Summary card with project info, status, contract value, dates, manager
- **Employees Tab:** List of employees assigned to this project (from HR, filtered by project)
- **Machinery Tab:** Equipment deployed at this site (from Asset Register, filtered by site)
- **Materials/Inventory Tab:** Stock items filtered by project store (from Inventory)
- **Daily Work Reports Tab:** DWRs for this project
- **Bills & Expenses Tab:**
  - Bills: Vendor, Category, Amount, Tax, Payment Status
  - Expenses: Category, Amount, Paid By, Status
  - Work Orders (with tabs: Work Detail, Terms & Conditions, Requirements, Hire Contract, Material, Labour)
- **Revenue Tab:** Revenue entries with Description, Amount, Date, Status (Received/Pending)
- **Costing Tab:** Cost breakdown by category vs budget with variance
- **P&L Tab:** Dynamic P&L calculation (see Project P&L below)

#### Project Documents (per-site)
- **Tabs:** Address Details, Tax Details, Other Details, GST, Document
- **Document attachment grid:** Document Name (dropdown), File upload, File Path, Remark, Add/Delete rows

### 2. Daily Work Reports (\`/projects/dwr\`)

#### DWR List
- **Columns:** Date, Project, Supervisor, Workers (count), Machinery (count), Progress (%), Weather (Clear/Rainy/Overcast), Status (Draft/Submitted/Approved), Actions (View/Edit/Delete)
- **Filters:** Project, Date range, Status

#### Add/Edit DWR Modal
- **Fields:**
  - Project (dropdown), Work Date (default today), DPR Number (auto-gen: site code + sequence)
  - Supervisor (employee dropdown), Weather
  - Contract For: Self or Contract Number (radio + dropdown)
  - RFI No. (from Master), Layer, Chainage (dropdown)
  - Task Group (from BOQ groups), Task (from BOQ items)
  - Task quantity info display: Unit, Total Qty, Completed Qty, Pending Qty, Target Qty (Upto), Today Done Qty
  - Layer No./Section, Road Side (dropdown)
  - Chainage From/To (meters), Chainage Range
  - Payment Mode: Work Basis / Day Basis
  - **Measurement (Qty):** Nos × Nos × Nos × Length × Breadth × Depth × Density = Actual Qty (with Add/Subtract)
  - Location (searchable), Daily Work description (textarea)
  - File Attachment (upload)
  - Engineer's Name (searchable), Remark (textarea)
  - Workers on Site (count), Machinery Deployed (count)
  - Progress (%), Status (Draft/Submitted)

#### BOQ/Task Group Integration
- Task Groups (BOQ) with items: BOQ No., Task Group, Task Name, Start Date, Finish Date, Duration, Scope Qty, Per Day Qty, Done Qty Till Date, Avg Qty Per Day, Pending Qty, Days to Complete, Target Qty Per Day
- BOQ Import from Excel — real file parsing and validation against the expected column schema, with row-level error reporting for malformed data
- BOQ Estimate Import from Excel — same validation pipeline
- **Group/Task (BOQ) Alert:** Today Task, Delayed Task, To be Delayed tabs with quantity tracking

### 3. Project P&L (\`/projects/pnl\`)

#### Summary Cards
- Contract Value (₹), Revenue Booked (green), Total Expenses (red), Gross Profit (purple), Margin % (orange)

#### Cost Breakdown Table
- **Columns:** Category, Budget (₹), Actual (₹), Variance (₹), Variance %
- **Categories:** Labour, Materials, Machinery & Fuel, Subcontractors, Overheads
- Variance color: green if under budget, red if over

#### Revenue Section
- Description, Amount, Date, Status (Received/Pending)
- RA Bills (Running Account Bills) with billing details

#### P&L Statement
- Revenue Booked − Labour − Material − Machinery − Fuel − Subcontractors − Overheads = **Gross Profit**
- Gross Profit / Revenue = **Margin %**
- Period selector: Monthly / Quarterly / Yearly / Cumulative

#### Dynamic Calculation
- Labour cost from Payroll (employees assigned to this project)
- Material cost from Inventory Purchases (filtered by project)
- Machinery & Fuel from Machinery module (assets at this site)
- Subcontractor costs from Partners → Contractor billing
- All values are recalculated by the backend as underlying records change, so the P&L always reflects current data

### 4. Clients (\`/projects/clients\`)
- **Table columns:** Client Name, Contact Person, Phone, Email, Address, Projects (count), Status (Active/Inactive), Actions (Edit/Delete)
- **Add/Edit Modal:** Name, Contact Person, Phone, Email, Address, GSTIN, Status toggle
- Clients populate the Client dropdown in Project forms

### 5. Sites (\`/projects/sites\`)
- **Table columns:** Site Name, Project (linked), Location (address + coordinates), Geofence Radius (meters), Status (Active/Inactive), Actions (Edit/Delete)
- **Add/Edit Modal:** Site Name, Project (dropdown), Location, Latitude, Longitude, Geofence Radius (m), Status toggle
- **Geofencing:** Sites define the geographic boundary for attendance punch validation — punches outside the radius flagged as exceptions
- Sites populate "Deployed at Site" in Machinery and site filters across modules

---

## Non-Functional Requirements

- **Data integrity:** Financial figures (Contract Value, Revenue, Costs) are computed server-side from linked transactional records (Payroll, Inventory, Machinery, Partners billing) — never entered as static totals disconnected from source data.
- **File import validation:** BOQ/Excel imports are validated against a defined schema before commit; invalid rows are rejected with a downloadable error report rather than partially applied.
- **Locking:** Once a project is marked "Is Locked," the backend rejects further transactional entries against it, independent of client-side UI state.
- **Geofencing accuracy:** Site coordinates and geofence radius are used server-side to validate attendance punches in real time.
- **Auditability:** All edits to BOQ quantities, DWR submissions, and P&L-impacting records are logged to the Activity Log with before/after values.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| DWR submission rate | 100% daily for active projects |
| P&L data freshness | Real-time (updates within minutes of any financial record change) |
| Cost overrun detection | Flagged when any category exceeds budget by >10% |
| BOQ progress tracking accuracy | Within 5% of physical site measurement |
| Project visibility | All active projects have complete detail pages with all tabs populated |
| RA Bill processing time | < 2 days from submission to verification |
`;
PRD_RAW["partners"] = `# PRD: Partners Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Partners (Vendors, Vendor Categories, Contractor Vault, Monthly Compliance, RAG Matrix, BOCW Cess)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies work with dozens of vendors (material suppliers, fuel stations, equipment hire parties) and subcontractors (labour contractors). Managing vendor TDS compliance, tracking contractor PF/ESIC statutory filings, and ensuring BOCW (Building and Other Construction Workers) cess payments are current — all require manual follow-ups. Missed compliance leads to government penalties, project stoppages, and legal liability for the principal employer.

---

## Proposed Solution

A partners management module that centralizes vendor and contractor information, automates TDS tracking for vendor payments, enforces monthly PF/ESIC compliance tracking for labour contractors with a visual RAG (Red-Amber-Green) matrix, and calculates BOCW cess liability per project.

---

## Key Features

### 1. Vendors (\`/vendors\`)

#### Vendor List
- **Columns:** Vendor (name + city), Deals In (material category tags), Contact (person + phone), Type (Fuel/Hire/Material/Service/Subcontractor), GSTIN, TDS (section + rate, e.g., "2% 194C"), Active (toggle), Actions (Edit)
- **Filters:** Search, Type, Active status

#### Add/Edit Vendor Modal
- **Details Tab:**
  - Name, Type (Material/Fuel/Hire/Service/Subcontractor — dropdown)
  - Deals In (multi-select tags from Vendor Categories)
  - GSTIN, PAN
  - TDS Section (e.g., 194C, 194J), TDS Rate (%)
  - Active toggle
- **Address Tab:** Address, City, State, PIN Code
- **Contacts Tab:**
  - Contact entries: Name, Phone, Email
  - "+ Add Contact" button for multiple contacts
- **Work Detail Tab** (for subcontractors):
  - Work Type (All/Specific), Contractor Type (Sub Contractor/Labour Contractor)
  - Vendor Currency (INR), Exchange Rate
  - Hire details: Hire type (Taken/Given), Contract Code, Period (From–To)
  - Machine Category, Machine, Required Avg, Charges Base (Monthly/Daily), Rate, Min Working Days
  - Allow BD Days, Allow Idle Days, Operator/Helper/Maintenance/Fuel charges toggles
  - Terms & Conditions, Requirements tabs

#### Cross-module Usage
- Vendors populate dropdowns in: Inventory Purchases, Inventory Payments, Machinery Fuel entries, Machinery Hire Bills
- Vendor TDS % used for Hire Bill TDS calculation

### 2. Vendor Categories (\`/vendors/categories\`)
- **Table columns:** # (row number), Category Name, Description, Vendors (count of linked vendors), Actions (Edit/Delete)
- **Add/Edit Modal:** Name (text), Description (text)
- **Default categories shipped with the system** (admin-editable): Material, Fuel, Hire, Service, Transport, Subcontractor
- Categories populate "Deals In" multi-select in Vendor form and Type filters

### 3. Contractor Vault (\`/contractors\`)

#### Contractor List
- **Columns:** Contractor Name, Contact Person, License Number, PF Registration, ESIC Registration, Insurance, BOCW Registration, Compliance Status (Compliant/Non-compliant/Partially compliant), Actions (View/Edit)
- **Compliance Status auto-derived:** Based on Monthly Compliance submissions for last 3 months

#### Contractor Detail View
- Document checklist with expiry tracking for: Labour License, PF Registration, ESIC Registration, Insurance Policy, BOCW Registration
- Monthly compliance history (links to Monthly Compliance filtered view)
- Work orders and billing summary

### 4. Monthly Compliance (\`/contractors/compliance\`)

#### Compliance Table
- **Columns:** Contractor, Month, PF Challan #, PF Amount (₹), PF Date, ESIC Challan #, ESIC Amount (₹), ESIC Date, Status (Verified/Submitted/Partial/Missing), Actions (Edit/Verify)
- **Filters:** Contractor, Month, Status

#### Record Submission Modal
- **Fields:** Contractor (dropdown), Month (month picker), PF Challan Number, PF Amount, PF Payment Date, ESIC Challan Number, ESIC Amount, ESIC Payment Date

#### Status Auto-Derivation
- Both PF and ESIC submitted → **Submitted**
- Only one submitted → **Partial**
- Neither submitted → **Missing**
- Admin clicks "Verify" → **Verified**

#### Auto-Behaviors
- Compliance status auto-updates RAG Matrix
- Missing compliance for current/previous month generates Notification
- Verified status marked with admin name and timestamp

### 5. RAG Matrix (\`/contractors/rag\`)

#### Visual Matrix
- **Rows:** Contractors (from Contractor Vault)
- **Columns:** Months (Apr → Mar for selected FY)
- **Status Dots:**
  - Green — Verified
  - Yellow — Submitted/Partial
  - Red — Missing/Rejected
  - Gray — No filing yet (future months)
- **FY Selector:** Financial year dropdown to view historical compliance

#### Behaviors
- Matrix auto-populates from Monthly Compliance data
- Single glance shows compliance health of all contractors across the year
- Clicking a dot navigates to that contractor's compliance detail for that month

### 6. BOCW Cess (\`/bocw\`)

#### BOCW Table
- **Columns:** Project Name, Contract Value (₹), Cess Rate (1% — statutory), Cess Liability (auto-calc: Contract Value × 1%), Paid (₹), Balance (₹), Last Payment Date, Status (Paid/Partial/Pending), Actions (Record Payment)

#### Record Payment Modal
- Fields: Project, Amount Paid, Payment Date, Reference Number, Remarks

#### Auto-Behaviors
- Cess Liability auto-calculated from Project Contract Value
- Balance = Liability − Total Paid
- Status: Paid (Balance = 0), Partial (Balance > 0 with some payment), Pending (no payment)
- Project data sourced from Projects → Portfolio

---

## Non-Functional Requirements

- **Data persistence:** Vendor, contractor, compliance, and BOCW records are stored in the production database with full historical retention (no data loss on status transitions).
- **Document storage:** Contractor licenses, registrations, and insurance documents are stored in secure, access-controlled file storage with expiry-based reminder scheduling.
- **Compliance rate configuration:** Statutory rates (PF, ESIC, BOCW cess %) are configurable per company/region to accommodate government rate changes without requiring a code release.
- **Auditability:** Compliance verification actions record the verifying admin's identity and timestamp for statutory audit purposes.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Contractor compliance tracking | 100% of contractors tracked monthly |
| Compliance gap detection | Missing filings flagged within 5 days of month-end |
| RAG Matrix coverage | All active contractors × all months populated |
| BOCW cess payment compliance | Zero projects with overdue cess balance |
| Vendor TDS accuracy | 100% accurate TDS deduction on hire bills |
| Vendor data completeness | All vendors have GSTIN, PAN, and TDS details |
`;
PRD_RAW["inventory"] = `# PRD: Inventory Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Inventory (Stock, Purchases, Issues, Transfers, Payments)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction sites consume large quantities of materials (cement, steel, aggregate, sand, bricks) that are purchased from multiple vendors, stored at different project sites, and issued to work activities. Without centralized inventory tracking, companies face: material pilferage, inaccurate stock counts, duplicate purchases, untracked inter-site transfers, and vendor payment disputes. Manual stock registers at each site are error-prone and lack real-time visibility for head office.

---

## Proposed Solution

A multi-site inventory management module that tracks material stock in real-time across all project stores — from purchase receipt through issue to work and inter-site transfers. Includes vendor payment allocation against purchase bills, item/category masters, and auto-calculated stock balances.

---

## Key Features

### 1. Stock (\`/inventory/stock\`)

#### Stock Table (real-time balances)
- **Columns:** Item, Project (store), Category, Unit (BAG/CUM/KG/NOS/MT/LTR), Received (total purchased), Issued (total issued), Transfer In, Transfer Out, In Stock (auto-calc: Received + Transfer In − Issued − Transfer Out), Avg Rate (₹), Stock Value (auto-calc: In Stock × Avg Rate)
- **Filters:** Search, Project/Store, Category
- **Sort by:** Item, In Stock, Stock Value

#### Auto-Calculation
- In Stock = Received + Transfer In − Issued − Transfer Out
- Stock Value = In Stock × Weighted Average Rate
- All quantities are recalculated server-side as purchases, issues, and transfers are recorded, backed by an append-only stock ledger for auditability

#### Quick Actions from Stock Page
- "New Purchase" button → Purchase modal
- "New Issue" button → Issue modal
- "New Transfer" button → Transfer modal
- "Masters" button → Item & Category Masters modal

### 2. Purchases (\`/inventory/purchases\`)

#### Purchase Table
- **Columns:** Date, Project (store), Item, Vendor, Quantity, Unit, Rate (₹), Amount (auto-calc: Qty × Rate), Bill (file link), Payment Status (Paid/Unpaid/Part Paid), Actions (Edit/Delete)
- **Filters:** Date range, Project, Vendor, Payment Status

#### New Purchase Modal
- **Fields:** Project Store (dropdown), Item (from Item Masters), Vendor (from Partners → Vendors), Date, Rate (₹ per unit), Quantity, Bill File Upload
- Amount auto-calculated: Quantity × Rate
- On save: Stock "Received" quantity increments, Avg Rate recalculates

#### Behaviors
- Purchases also appear in Projects → Bills & Expenses tab
- Purchase records create payable entries for Vendor Payments

### 3. Issues (\`/inventory/issues\`)

#### Issue Table
- **Columns:** Date, Project (store), Item, Issued To (person/activity), Quantity, Unit, Remarks, Actions (Edit/Delete)
- **Filters:** Date range, Project, Item

#### New Issue Modal
- **Fields:** Project Store (dropdown), Item (dropdown — only items with stock > 0), Issued To (text — person or work activity), Date, Quantity, Remarks
- **Validation:** Quantity cannot exceed In Stock balance (enforced server-side)
- On save: Stock "Issued" quantity increments, In Stock decreases

### 4. Transfers (\`/inventory/transfers\`)

#### Transfer Table
- **Columns:** Date, From Project (store), To Project (store), Item, Quantity, Unit, Remarks, Actions (Edit/Delete)
- **Filters:** Date range, From Project, To Project, Item

#### New Transfer Modal
- **Fields:** From Project Store, To Project Store, Item (dropdown — from source store), Date, Quantity, Remarks
- **Validation:** Quantity cannot exceed source store's In Stock (enforced server-side)
- On save: Source store "Transfer Out" increments; Destination store "Transfer In" increments

### 5. Payments (\`/inventory/payments\`)

#### Payment Table
- **Columns:** Date, Vendor, Amount (₹), Payment Mode (UPI/Bank Transfer/Cash/Cheque), Reference Number, Allocated Bills (count), Actions (View/Edit/Delete)
- **Filters:** Date range, Vendor, Payment Mode

#### New Payment Modal
- **Fields:** Vendor (dropdown), Amount (₹), Date, Payment Mode (dropdown), Reference Number
- **Bill Allocation:** After entering amount, shows list of unpaid/part-paid bills for selected vendor — user allocates payment amount across bills
- On save: Allocated bill statuses update (Unpaid → Part Paid → Paid based on total allocated)

### 6. Item Masters (via Masters modal)

#### Item Master Table
- **Columns:** Code (auto-gen), Item Name, Category (dropdown), Unit, Description, Actions (Edit/Delete)
- **Add/Edit Fields:** Code (auto, editable), Name, Category, Unit (BAG/CUM/KG/NOS/MT/LTR), Description
- Items populate dropdowns in Purchase, Issue, Transfer forms

#### Category Master Table
- **Columns:** # (row), Category Name (uppercase), Items Count, Actions (Delete)
- **Add Field:** Category Name
- **Default categories shipped with the system** (admin-editable): CEMENT, AGGREGATE, STEEL, BRICKS, SAND, PAINT, ELECTRICAL, PLUMBING
- Categories populate the Category dropdown in Item Masters and filters

---

## Non-Functional Requirements

- **Ledger-based accounting:** Stock balances are derived from an append-only transaction ledger (purchases, issues, transfers), never from a mutable running total, so historical balances can always be reconstructed and audited.
- **Concurrency control:** Issue and Transfer validations (quantity vs. available stock) are enforced with database-level locking or optimistic concurrency checks to prevent overselling stock under simultaneous submissions from multiple sites.
- **Document storage:** Purchase bill files are stored in secure, access-controlled file storage with retrieval links from the Purchase Table.
- **Payment reconciliation:** Payment-to-bill allocation is transactional — a payment record and its bill status updates commit together or not at all.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Stock accuracy | Within 2% of physical stock count |
| Material pilferage detection | 100% of issues tracked with person/activity attribution |
| Vendor payment reconciliation | Zero disputed payments (all payments allocated to bills) |
| Inter-site transfer tracking | 100% of transfers logged with source/destination |
| Purchase to payment cycle | Full audit trail from PO → receipt → bill → payment |
| Stock-out incidents | 50% reduction through real-time visibility |
`;
PRD_RAW["settings"] = `# PRD: Settings Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Settings (Companies, Users, Roles & Permissions)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies often operate as a group of entities (e.g., a main construction company + an infra subsidiary), each with different statutory registrations (PF, ESIC, GST), payroll configurations, and employee code series. Without multi-company support, they run separate systems per entity — duplicating effort and losing group-level visibility. Access control is also critical: site engineers should not access payroll data, store keepers should not modify HR records, and only super admins should manage company settings.

---

## Proposed Solution

A settings module providing multi-company configuration (with per-company statutory and payroll settings), user management with role-based access control, and reference data masters (Employee Setup) that drive form dropdowns and validation rules across all modules.

---

## Key Features

### 1. Companies (\`/settings/companies\`)

#### Company List
- **Columns:** Company Name, Short Code, Address, GSTIN, PAN, PF Establishment Code, ESIC Code, Status (Active/Inactive), Actions (Edit/Delete)

#### Add/Edit Company Modal (multi-tab)
- **Basic Info Tab:**
  - Company Name, Short Code (used in employee code generation), Logo Upload, Status (Active/Inactive) toggle
- **Registration Tab:**
  - GSTIN, PAN, CIN (Corporate ID), TAN
- **Address Tab:**
  - Address, City, State, PIN Code
- **Statutory Tab:**
  - PF Establishment Code, ESIC Code, Professional Tax Registration Number, BOCW Registration Number
- **Payroll Settings Tab:**
  - Pay Cycle: Monthly (fixed)
  - Payroll Lock Day: Day of month after which attendance edits are locked
  - PF Employer Contribution Rate (%), default 12%
  - ESIC Employer Contribution Rate (%), default 3.25%
  - Gratuity Rate (%), default 4.81%
  - Bonus Rate (%), default 8.33%

#### Onboarding
- Companies are created during initial system setup by the implementation team or Super Admin — no companies are pre-created; each company's registration and statutory details are entered before it becomes selectable elsewhere in the system
- The first company created during setup becomes the default company for the initial Super Admin account

#### Behaviors
- Companies drive multi-company filtering across all modules (employees, payroll, challans, projects)
- Short Code used for auto-generating employee codes (e.g., DC-0001)
- PF/ESIC codes used in Challan generation
- Payroll Settings control salary calculations, contribution rates, and attendance lock dates
- Payroll Lock Day: once payroll is processed for a month, My Punch is locked for that period

### 2. Users (\`/settings/users\`)

#### User List
- **Columns:** Name, Email, Role (from Roles master), Status (Active/Inactive), Last Login (date/time), Actions (Edit/Delete)

#### Account Creation
- New user accounts are created exclusively through the Account Creation flow (see the Authentication & Account Management PRD) — only Super Admin and HO User roles can create accounts
- One bootstrap Super Admin account is provisioned during initial system deployment; all subsequent users are created by an admin from within the application

#### Behaviors
- User's assigned role determines accessible modules and actions, enforced at both the UI and API layer
- Authentication validates credentials against the backend user store (passwords hashed, never stored or transmitted in plain text)
- Last Login timestamp updates on each successful sign-in

### 3. Roles & Permissions (\`/settings/roles\`)

#### Roles List
- **Columns:** Role Name, Permissions (comma-separated list), Users Count (number of users assigned), Actions (Edit/Delete)

#### Add/Edit Role Modal
- **Fields:** Role Name (text), Permissions (comma-separated text input)

#### Default Roles (shipped with the system, admin-editable)

| Role | Permissions |
|------|------------|
| Super Admin | All Modules, User Management, Company Settings, Data Export, Data Delete |
| Site Admin | Dashboard, Employees, Attendance, Projects, Machinery, Inventory, Partners, Reports |
| Project Manager | Dashboard, Employees, Attendance, Projects, Machinery, Reports, Daily Worker Registry |
| HO User | Dashboard, Payroll, Challans, Loans, Inventory, Reports, Settings |
| Accountant | Dashboard, Payroll, Challans, Loans, Inventory, Reports |
| Site Engineer | Dashboard, Attendance, Machinery, Logbook, Fuel, Inventory, Daily Worker Registry |
| Store Keeper | Dashboard, Inventory, Purchases, Issues, Transfers |
| Site User | Dashboard, Attendance, My Workspace |
| Viewer | Dashboard, Reports |

#### Behaviors
- Roles define which sidebar modules are visible to the user and are enforced server-side on every API request, not just hidden in the UI
- Permissions control CRUD capabilities within each module
- Super Admin has unrestricted access including destructive operations (delete, company settings)
- Role changes take effect on the user's next authenticated request (session is re-validated against current role)
- "Site Supervisor" is a functional responsibility, not a distinct system role — any user whose role includes the Daily Worker Registry permission (Site Engineer, Project Manager, or Site Admin by default) can enrol daily workers and mark their attendance for the sites they are assigned to

### 4. Employee Setup (Reference Data Masters)

Accessed from Employees page → "Setup" button. Provides reference data that drives form dropdowns and validation across HR & Payroll module.

#### Code Series Tab
- Company-wise employee code patterns
- Format: \`{CompanyShortCode}-{SequentialNumber}\` (e.g., DC-0001, DI-0001)

#### Departments Tab
- CRUD for department names
- Departments populate the Department dropdown in Employee forms
- Used for attendance/payroll filtering

#### Designations Tab
- CRUD for designation names
- Designations populate the Designation dropdown in Employee forms

#### Document Types Tab
- **Columns:** Document Type, Code, Flags, Sort Order, Actions (Edit)
- **Flags (derived from toggles):**
  - Mandatory + Number → MandatoryNumber
  - Mandatory only → Mandatory
  - Expiry + Number → ExpiryNumber
  - Expiry only → Expiry
  - Number only → Number
  - None → Optional
- **Add/Edit Modal:** Code, Name, Mandatory (toggle — gates attendance marking), Has Expiry Date (toggle), Needs Document Number (toggle), Sort Order, Active (toggle)
- **Default document types shipped with the system** (admin-editable): Aadhaar (MandatoryNumber), PAN (Number), Bank Proof (Mandatory), Photo (Mandatory), Driving Licence (ExpiryNumber), Marksheets, Degree, Experience Letter, Medical Fitness (Expiry), Police Verification, Offer Letter, Appointment Letter, Joining Letter, PF Form 11, PF Form 2, ESIC Family Declaration
- **Impact:** Mandatory document types determine the Documents progress bar on Employee list; employees missing mandatory docs cannot have attendance marked

#### Shifts Tab
- CRUD for shift definitions
- Fields: Shift Name, In Time, Out Time, Grace Period (minutes)
- Shifts populate the Shift dropdown in Employee forms
- Used for overtime calculation (hours beyond shift duration)

---

## Non-Functional Requirements

- **Multi-tenancy / data isolation:** Every business record is scoped to a company_id; queries and API responses are filtered server-side so users never see data belonging to a company they are not authorized for.
- **Access control enforcement:** Role permissions are enforced at the API/middleware layer (not only by hiding UI elements), preventing privilege escalation via direct API calls.
- **Configuration change auditing:** Changes to Companies, Roles, and reference data masters are logged to the Activity Log with the acting admin's identity.
- **Statutory rate flexibility:** PF/ESIC/Gratuity/Bonus contribution rates are configurable per company to accommodate future statutory rate changes without a code release.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Multi-company support | All group entities managed in single system |
| Access control compliance | Zero unauthorized module access incidents |
| User onboarding time | < 5 minutes to create user with appropriate role |
| Reference data completeness | All departments, designations, doc types, and shifts configured before go-live |
| Payroll lock enforcement | Zero attendance modifications after payroll processing for locked months |
| Role granularity | Each user role has minimum necessary permissions (principle of least privilege) |
`;
PRD_RAW["auth"] = `# PRD: Authentication & Account Management

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

### 1. Login (\`/login\`)
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

### 2. Forgot Password (\`/forgot-password\`)
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
- **Create Account Form** (from \`/settings/users\` → "Add User" button)
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
  - Accounts created with a temporary password are flagged \`mustChangePassword: true\`; on first successful login, the user is required to set a new password (meeting the same requirements as password reset) before accessing the app
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
`;

/* -- Minimal Markdown -> HTML -- */
function mdToHtml(md) {
    let html = md
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/^---+$/gm, "<hr class=\"prd-hr\">")
        .replace(/^######\s+(.+)$/gm, "<h6 class=\"prd-h6\">$1</h6>")
        .replace(/^#####\s+(.+)$/gm, "<h5 class=\"prd-h5\">$1</h5>")
        .replace(/^####\s+(.+)$/gm, "<h4 class=\"prd-h4\">$1</h4>")
        .replace(/^###\s+(.+)$/gm, "<h3 class=\"prd-h3\">$1</h3>")
        .replace(/^##\s+(.+)$/gm, "<h2 class=\"prd-h2\">$1</h2>")
        .replace(/^#\s+(.+)$/gm, "<h1 class=\"prd-h1\">$1</h1>")
        .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code class=\"prd-code\">$1</code>");
    html = html.replace(/((?:^\|.+\|$\n?)+)/gm, function(table) {
        const rows = table.trim().split("\n").filter(r => r.trim());
        if (rows.length < 2) return table;
        const isSep = /^\|[\s\-:|]+\|$/.test(rows[1]);
        let out = "<div class=\"prd-table-wrap\"><table class=\"prd-table\"><thead><tr>";
        rows[0].split("|").filter(c => c.trim() !== "").forEach(c => { out += "<th>" + c.trim() + "</th>"; });
        out += "</tr></thead><tbody>";
        for (let i = (isSep ? 2 : 1); i < rows.length; i++) {
            out += "<tr>";
            rows[i].split("|").filter(c => c.trim() !== "").forEach(c => { out += "<td>" + c.trim() + "</td>"; });
            out += "</tr>";
        }
        return out + "</tbody></table></div>";
    });
    html = html.replace(/((?:^[ ]*- .+$\n?)+)/gm, function(block) {
        const lines2 = block.split("\n").filter(l => l.trim());
        let out = "<ul class=\"prd-list\">", depth = 0, prev = 0;
        lines2.forEach(line => {
            const m = line.match(/^(\s*)- (.+)$/);
            if (!m) { out += "<li>" + line.trim() + "</li>"; return; }
            const indent = m[1].length, content = m[2];
            if (indent > prev) { out += "<ul class=\"prd-list\">"; depth++; }
            else if (indent < prev) { const n = Math.round((prev - indent) / 2); for (let i = 0; i < n && depth > 0; i++) { out += "</li></ul>"; depth--; } }
            else if (prev > 0 || out.includes("<li>")) { out += "</li>"; }
            out += "<li>" + content;
            prev = indent;
        });
        for (let i = 0; i < depth; i++) out += "</li></ul>";
        return out + "</li></ul>";
    });
    html = html.split("\n").map(line => {
        const t = line.trim();
        if (!t || t.startsWith("<")) return line;
        return "<p class=\"prd-p\">" + t + "</p>";
    }).join("\n");
    return html;
}

/* -- Render: docs index -- */
function renderDocsIndex(container) {
    container.innerHTML = "<div class=\"page-header\"><h2><i class=\"fas fa-book\"></i> Product Requirements</h2>" +
        "<p style=\"color:#6b7280;margin-top:4px;\">BuildCore ERP -- Module PRDs</p></div>" +
        "<div class=\"prd-grid\">" + PRD_MODULES.map(m =>
            "<div class=\"prd-card\" onclick=\"navigateTo(\x27#/docs/" + m.id + "\x27)\" style=\"border-top:4px solid " + m.color + "\">" +
            "<div class=\"prd-card-icon\" style=\"color:" + m.color + "\"><i class=\"fas " + m.icon + "\"></i></div>" +
            "<h3>" + m.title + "</h3><p>" + m.desc + "</p>" +
            "<span class=\"prd-card-link\">Read PRD &rarr;</span></div>"
        ).join("") + "</div>";
}

/* -- Render: single PRD -- */
function renderPrdPage(container, moduleId) {
    const mod = PRD_MODULES.find(m => m.id === moduleId);
    if (!mod) { container.innerHTML = "<div class=\"empty-state\"><i class=\"fas fa-file\"></i><p>PRD not found</p></div>"; return; }
    const raw = PRD_RAW[moduleId];
    if (!raw) { container.innerHTML = "<div class=\"empty-state\"><i class=\"fas fa-file\"></i><p>PRD content not available</p></div>"; return; }
    container.innerHTML = "<div class=\"page-header\">" +
        "<a href=\"#/docs\" class=\"prd-back\"><i class=\"fas fa-arrow-left\"></i> All PRDs</a>" +
        "<h2><i class=\"fas " + mod.icon + "\" style=\"color:" + mod.color + "\"></i> " + mod.title + "</h2></div>" +
        "<article class=\"prd-article\">" + mdToHtml(raw) + "</article>";
}
