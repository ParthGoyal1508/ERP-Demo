# PRD: Dashboard & General Module

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

### 1. Dashboard (`/dashboard`)
- **8 KPI Cards** (clickable, navigate to source module)
  - Total Employees → `/hr/employees`
  - Present Today → `/hr/attendance`
  - Absent → `/hr/attendance`
  - On Leave → `/hr/leave`
  - Active Projects → `/projects/portfolio`
  - Total Machinery → `/machinery`
  - Monthly Expenses (computed)
  - Pending Approvals → `/hr/leave`
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

### 2. Group Dashboard (`/group`)
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

### 3. Site Dashboard (`/site-dashboard`)
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

### 4. Notifications Center (`/notifications`)
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

### 5. Activity Log (`/activity-log`)
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
- **Storage:** Persisted in a dedicated audit log table (`activity_log`), retained per the company's compliance/retention policy (not capped in application memory), each entry: `{ id, timestamp, user_id, action, module, target, detail }`

### 6. Reports (`/reports`)
- **8 Report Types:** Attendance, Payroll, Employee, Machinery, Fuel, Project Cost, Expense, P&L
- **Each report includes:**
  - Date range picker (From — To)
  - Relevant filters (department, project, category, etc.)
  - Tabular data display
  - Export button → generates a real PDF or Excel file via the backend export service; the file downloads to the user's device and can optionally be emailed

### 7. Equipment Utilization Report (`/machinery/utilization`)
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
