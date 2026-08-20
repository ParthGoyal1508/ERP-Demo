# BuildCore ERP — Master Product Requirements Document

**Version:** 2.0  
**Date:** 2026-08-20  
**Status:** Draft  
**Product:** BuildCore ERP — Construction Company Enterprise Resource Planning Platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users & Personas](#3-target-users--personas)
4. [Scope & Boundaries](#4-scope--boundaries)
5. [Tech Stack & Architecture](#5-tech-stack--architecture)
6. [Data Model & Entities](#6-data-model--entities)
7. [Module Specifications](#7-module-specifications)
   - 7.1 Authentication & Access Control
   - 7.2 Dashboard & Reporting
   - 7.3 HR & Payroll
   - 7.4 Plant & Machinery
   - 7.5 Project Management
   - 7.6 Inventory & Purchasing
   - 7.7 Partners (Vendors & Contractors)
   - 7.8 Settings & Administration
   - 7.9 My Workspace (Employee Self-Service)
8. [Cross-Cutting Concerns](#8-cross-cutting-concerns)
9. [UI/UX Design System](#9-uiux-design-system)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Constraints & Assumptions](#11-constraints--assumptions)
12. [Glossary](#12-glossary)

---

## 1. Executive Summary

BuildCore ERP is a multi-tenant, web-based Enterprise Resource Planning system purpose-built for multi-site construction companies operating in India. It provides end-to-end operational management across Human Resources, Payroll, Plant & Machinery, Project Management, Inventory, and Vendor/Contractor relationships — all from a single, unified interface.

The system is a **Next.js 14 web application backed by a NestJS REST/WebSocket API**, with PostgreSQL as the system of record and Redis for sessions, caching, and background job queues. A **PWA shell** (service worker + offline queue) lets field users (site supervisors, machinery operators) mark attendance, log fuel, and draft DWRs while offline, syncing automatically on reconnect. All business logic (computations, validations, workflows) runs server-side in the NestJS services; the client renders and orchestrates via the API. See `docs/HLD.md` for the full architecture, service breakdown, and hosting options.

BuildCore is built for **Indian statutory compliance** — PF, ESIC, Professional Tax, TDS, GST, and BOCW Cess are first-class concepts, not afterthoughts.

---

## 2. Product Vision & Goals

### Vision
Provide a construction company with a single source of truth for its workforce, assets, projects, materials, and vendor relationships — eliminating spreadsheets, paper muster rolls, and siloed data across job sites.

### Primary Goals
| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Centralise workforce data across all sites and companies | All employee records, attendance, and payroll in one system |
| G2 | Track equipment health and utilisation in real-time | Zero missed service/document renewals via proactive alerts |
| G3 | Give project managers live visibility into cost vs. budget | P&L auto-calculates as transactions are entered |
| G4 | Enforce statutory compliance (PF, ESIC, PT, TDS, BOCW) | Compliance status visible at all times; alerts 30 days before deadlines |
| G5 | Eliminate paper-based vendor/contractor compliance tracking | Digital RAG compliance matrix with timestamp-verified submissions |
| G6 | Reduce payroll processing time | One-click payroll run with salary slip generation |

---

## 3. Target Users & Personas

### P1 — Super Admin / HO Management
- **Role:** Corporate head-office administrator
- **Needs:** Cross-company dashboards, user provisioning, statutory compliance overview, group-level P&L
- **Pain points:** Data scattered across sites; no consolidated view

### P2 — Site Admin / HR Manager
- **Role:** On-site or regional HR responsible for employee lifecycle
- **Needs:** Attendance capture, leave approvals, payroll processing, document compliance
- **Pain points:** Manual muster rolls, paper leave forms, manual salary calculation

### P3 — Project Manager
- **Role:** Manages one or more construction projects
- **Needs:** DWR (Daily Work Reports), BOQ tracking, project P&L, site resource allocation
- **Pain points:** Progress reporting done via WhatsApp; no live cost tracking

### P4 — Plant Manager / Machinery Operator
- **Role:** Maintains and operates heavy equipment fleet
- **Needs:** Logbook entries, fuel tracking, maintenance scheduling, hire bill verification
- **Pain points:** Service deadlines missed; fuel pilferage undetected

### P5 — Store Keeper / Inventory Manager
- **Role:** Controls material stock across project sites
- **Needs:** Goods receipt, issue tracking, inter-site transfers, vendor payment tracking
- **Pain points:** Over-procurement; ghost consumption; no weighted average costing

### P6 — Accountant
- **Role:** Manages payables, statutory filings, financial reporting
- **Needs:** Payroll figures, vendor payments, TDS deductions, PF/ESIC challans
- **Pain points:** Data reconciliation between HR, projects, and finance

### P7 — Employee (Self-Service)
- **Role:** Individual worker or staff member
- **Needs:** Punch in/out, leave application, salary slip download
- **Pain points:** No visibility into own leave balance or salary details

---

## 4. Scope & Boundaries

### In Scope (v1.0)
- Multi-company, multi-site construction ERP
- HR (employee records, attendance, leave, payroll, statutory challans, loans)
- Plant & Machinery (asset register, logbook, fuel, maintenance, hire bills)
- Project Management (portfolio, DWR, BOQ, P&L)
- Inventory (stock, purchases, issues, transfers, vendor payments)
- Partners (vendors, contractors, compliance, RAG matrix, BOCW cess)
- Settings (companies, users, roles/permissions, masters)
- Employee self-service (My Workspace)
- Multi-level dashboards (Group, Company, Site)
- Notifications and activity audit log

### Out of Scope (v1.0)
- Automated biometric face-recognition matching (face enrolment captures photos via device camera for **manual admin review**, not AI-based matching)
- Bank API integration for salary disbursement (bank sheet is exported for manual upload to the bank's portal)
- GST return filing integration
- Continuous real-time GPS tracking (attendance uses a point-in-time geolocation check on punch, not live tracking)
- Native mobile app (covered by the installable PWA instead — see HLD §11)
- Third-party accounting software integration (Tally, QuickBooks)

---

## 5. Tech Stack & Architecture

### Technology
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui | SSR/SSG, file-based routing, design-system-ready |
| Client State | Zustand + React Query (TanStack) | Server-state caching, optimistic updates |
| Backend | NestJS (Node.js), modular monolith | Decorator-driven modules map 1:1 to ERP domains |
| ORM | Prisma | Type-safe queries, migrations, multi-schema support |
| Primary DB | PostgreSQL 16 | ACID, row-level security for tenant isolation |
| Cache / Queue | Redis 7 (BullMQ) | Sessions, background jobs (payroll, reports), hot-data cache |
| File Storage | S3-compatible object store | Documents, logos, salary slips, compliance uploads |
| Real-time | Socket.io (NestJS Gateway) | Live notifications, attendance updates |
| Email / SMS | Resend (email) + Twilio (SMS) | Payslip delivery, OTP, approval alerts |
| PWA | `next-pwa` (Workbox) | Offline shell, installable on mobile for field users |

Full technology rationale, hosting options, and cost tiers are maintained in `docs/HLD.md` (§3, §7) and are not duplicated here.

### Architecture
The system follows the layered architecture in `docs/HLD.md` §2:

```
Next.js Web Client + PWA Shell
        │  HTTPS REST / WebSocket
        ▼
NestJS API Gateway (Auth Guard · Rate Limit · Versioning)
        │
        ├─ Auth Service         (JWT · Refresh · RBAC)
        ├─ HR & Payroll Service
        ├─ Projects Service
        ├─ Inventory Service
        ├─ Plant & Machinery Service
        ├─ Partners Service
        ├─ Reports Service
        ├─ Notification Service
        ├─ File / Document Service
        └─ Settings Service
        │
        ▼
PostgreSQL (system of record) · Redis (sessions/cache/queues) · Object Storage (files)
```

Module-to-service mapping and submodule breakdown are detailed in `docs/HLD.md` §4.

### Data Flow
```
User Action → Next.js client → React Query → REST/WS call → NestJS controller
  → service layer (validation, business rules) → Prisma → PostgreSQL
  → response → cache update → re-render
```

Offline, field-facing actions (attendance punch, DWR draft, fuel entry) are queued in IndexedDB by the PWA and replayed via Background Sync once connectivity returns (HLD §11.2).

All computed values (stock balances, leave balances, P&L figures, KPI cards) are derived at query time from raw transaction records via database queries/views — not stored as denormalised aggregates.

### Routing
Next.js file-based App Router (`/dashboard`, `/hr/employees`, `/projects/[id]`, etc.). A mobile bottom-navigation shell replaces the sidebar below the `md` breakpoint (HLD §11.5).

### Multi-Tenancy
Shared PostgreSQL schema with a `company_id` discriminator on every tenant-scoped table, enforced by Postgres Row-Level Security policies and a Prisma middleware guard on every query (HLD §5).

---

## 6. Data Model & Entities

All entities below are PostgreSQL tables managed via Prisma schema, each carrying a `company_id` FK for tenant isolation (except `documents`, `notifications`, and `push_subscriptions`, which key off `user_id` / polymorphic `entity_type + entity_id`). See `docs/HLD.md` §5 for the entity-relationship overview.

### Core Entities

#### Companies
```
id, name, shortCode, gstin, pan, pfCode, esicCode,
payrollLockDay, pfEmployeeRate, pfEmployerRate, esicEmployeeRate,
esicEmployerRate, gratuityRate, bonusRate, address, logo
```

#### Employees
```
id, companyId, employeeCode, name, department, designation,
projectId, status (Active/Inactive/On Leave),
joiningDate, dateOfBirth, gender, aadhaar, pan, uan, esicNo,
bankAccount, bankName, ifsc, basicSalary, hra, allowances,
documents[], photoUrl, biometricEnrolled, faceEnrolled
```

#### Attendance
```
id, employeeId, date, punchIn, punchOut, otHours,
status (Complete/Absent/Half Day/On Leave/Holiday),
geofenceValid, manuallyModified, modifiedBy, modifiedAt, remarks
```

#### Leave
```
id, employeeId, leaveType (Earned/Casual/Sick/Without Pay),
fromDate, toDate, days, reason, status (Pending/Approved/Rejected/Cancelled),
appliedAt, reviewedBy, reviewedAt, remarks
```

#### Leave Balances
```
employeeId, year, earned, casual, sick, earnedUsed, casualUsed, sickUsed
```

#### Payroll Runs
```
id, companyId, month, year, status (Draft/Processed/Locked),
generatedAt, lockedAt, records[{employeeId, basic, hra, allowances,
pfEmployee, pfEmployer, esic, pt, tds, loan, netPay}]
```

#### Equipment (Assets)
```
id, companyId, code, name, category, ownership (Owned/Hired),
vendor, powerSource, purchaseDate, purchaseCost, depreciationRate,
currentReading, meterType (hrs/km), status (Active/Under Maintenance/Inactive),
deployedSiteId, utilizationPercent, documents[]
```

#### Logbook Entries
```
id, equipmentId, date, openingReading, closingReading,
totalHours, fuelConsumed, operatorId, projectId, remarks
```

#### Fuel Entries
```
id, equipmentId, date, quantity, rate, amount, vendorId,
variancePercent, varianceAlert
```

#### Maintenance Jobs
```
id, equipmentId, type (Breakdown/Scheduled), description,
openedAt, closedAt, cost, linkedServiceId, status (Open/Closed)
```

#### Projects
```
id, companyId, code, name, clientId, location, managerId,
contractValue, startDate, endDate, status (Planning/Ongoing/On Hold/Completed),
department, budget{labour, materials, machinery, fuel, overheads}
```

#### Daily Work Reports (DWR)
```
id, projectId, date, supervisorId, workersCount, machineryCount,
progressPercent, weather, description, status (Draft/Submitted/Approved),
boqItems[{taskGroup, description, unit, totalQty, completedQty, pendingQty}],
measurements[{nos, length, breadth, depth, density, actualQty}]
```

#### Stock Items
```
id, name, category, unit, description
```

#### Stock Transactions
```
id, itemId, projectId, type (Purchase/Issue/TransferIn/TransferOut),
date, qty, rate, vendorId, issuedTo, activity, remarks, billId
```

_Stock balance = Σ(Purchase + TransferIn) − Σ(Issue + TransferOut)_  
_Weighted avg rate = Σ(qty × rate) / Σ(qty) across all purchase transactions_

#### Vendors
```
id, name, type (Material/Fuel/Hire/Service/Transport/Subcontractor),
categories[], gstin, pan, tdsSection, tdsRate,
contacts[{name, phone, email, role}],
workDetail{hireType, contractCode, rates, charges}
```

#### Contractors
```
id, name, licenseNo, pfRegNo, esicRegNo, bocwRegNo,
insurancePolicyNo, complianceStatus (Compliant/Partial/Non-compliant)
```

#### Contractor Compliance
```
id, contractorId, month, year, pfChallanNo, esicChallanNo,
pfSubmitted, esicSubmitted, verifiedBy, verifiedAt,
status (Missing/Submitted/Partial/Verified)
```

#### Documents
```
id, entityType (Employee/Equipment/Contractor/Vendor), entityId,
docType, fileUrl, fileName, mimeType, sizeBytes,
expiryDate, uploadedBy, uploadedAt, virusScanStatus (Pending/Clean/Infected)
```
Polymorphic table backing every "upload a document" flow in this PRD. Uploads use pre-signed object-storage URLs (browser → storage direct); the File/Document Service issues the URL and runs a virus-scan hook on completion.

#### Notifications
```
id, userId, companyId, category, severity (Info/Warning/Alert),
message, entityLink, channel (InApp/Push/Email/SMS),
readAt, dismissedAt, createdAt
```

#### Push Subscriptions
```
id, userId, endpoint, keys{p256dh, auth}, createdAt
```
Created when a user accepts the browser `Notification` permission prompt; used by the Notification Service to send Web Push (VAPID) alerts.

---

## 7. Module Specifications

---

### 7.1 Authentication & Access Control

#### Overview
Role-based access control (RBAC) gates all modules and actions. Authentication is session-based with OTP-based password recovery.

#### User Roles (Default)
| Role | Description |
|------|-------------|
| Super Admin | Full access across all companies |
| HO User | Head-office staff; read/write most modules |
| Site Admin | Full access within assigned company/site |
| Project Manager | Projects, DWR, site resources |
| Accountant | Payroll, challans, payments, vendor bills |
| Site Engineer | DWR, machinery logbook |
| Store Keeper | Inventory only |
| Site User | Limited read + My Workspace |
| Viewer | Read-only access |

#### Permissions Matrix
Each role has a set of permissions per module:
- `view` — read access
- `create` — add new records
- `edit` — modify existing records
- `delete` — remove records
- `approve` — workflow approval actions
- `admin` — configuration and master data management

#### Login Flow
1. User enters email + password
2. Auth Service validates credentials (password hashed with bcrypt/argon2) against the `users` table
3. On success: issue a short-lived JWT access token (15 min TTL) + an HTTP-only, secure refresh token cookie (7 days, rotated on use, stored in Redis for revocation); redirect to dashboard
4. On failure: show error; lock account after 5 failed attempts (unlock via admin or timed cooldown)

#### Forgot Password (OTP)
1. User enters registered email
2. Auth Service generates a 6-digit OTP, stores it (hashed, TTL 10 min) in Redis, and dispatches it via **email (Resend)** or **SMS (Twilio)** — never displayed in the UI
3. User enters OTP within 10 minutes; rate-limited to prevent brute force
4. User sets new password (min 8 chars, 1 uppercase, 1 number); all refresh tokens for the user are revoked

#### Session
- Access token kept in memory/short-lived storage on the client; refresh token lives in an HTTP-only cookie and is rotated on every refresh
- Logout revokes the refresh token in Redis and clears the cookie
- Inactive session timeout: 8 hours (enforced by refresh-token expiry + idle check)

---

### 7.2 Dashboard & Reporting

#### 7.2.1 Main Dashboard
Displays company-level KPIs computed in real-time from live data.

**KPI Cards (8):**
| Card | Computation |
|------|-------------|
| Total Employees | COUNT(employees WHERE companyId = current AND status = Active) |
| Present Today | COUNT(attendance WHERE date = today AND status = Complete) |
| Absent Today | COUNT(attendance WHERE date = today AND status = Absent) |
| On Leave | COUNT(attendance WHERE date = today AND status = On Leave) |
| Active Projects | COUNT(projects WHERE companyId = current AND status = Ongoing) |
| Active Machinery | COUNT(equipment WHERE status = Active) |
| Monthly Expenses | SUM(payroll.netPay + purchases.amount + fuel.amount) for current month |
| Pending Approvals | COUNT(leave WHERE status = Pending) + COUNT(maintenance WHERE status = Open) |

All cards are **clickable** and navigate to the respective filtered list view.

**Quick Stats Sidebar:**
- Total contract value (active projects)
- Today's muster headcount
- This month: materials cost, fuel cost, machinery hire cost

**Alerts & Reminders (auto-generated):**
- Equipment documents expiring in ≤30 days
- Pending leave approvals older than 48 hours
- Payroll not yet processed for current month
- Contractor compliance missing for previous month

#### 7.2.2 Group Dashboard
Multi-company aggregate view for HO management.

- Company selector (All or specific company)
- Headcount and payroll metrics per company
- Statutory calendar: PF/ESIC/PT filing due dates with status indicators
- Cross-company active project count and contract value

#### 7.2.3 Site Dashboard
Per-site operational snapshot filtered by selected site.

- Workers on site today
- Active machinery count and utilisation
- Fuel consumption (this month)
- Material stock value (at site)
- Open DWRs pending approval

#### 7.2.4 Notifications Centre
System-generated alerts, deduplicated and sorted by severity.

| Category | Trigger |
|----------|---------|
| Document Expiry | Equipment/employee document expires within alert window |
| Pending Approvals | Leave/maintenance open > configurable SLA |
| Fuel Variance | Consumption exceeds benchmark by >15% |
| Compliance | Monthly PF/ESIC challan not submitted |
| Payroll | Payroll not processed by lock date |

Each notification shows: type icon, message, affected entity link, timestamp, dismiss/action buttons.

#### 7.2.5 Activity Log
Full audit trail of all create/edit/delete/approve actions across the system.

Columns: Timestamp, User, Action, Module, Entity, Before/After (expandable)  
Filters: Date range, User, Module, Action type  
Export: CSV

---

### 7.3 HR & Payroll

#### 7.3.1 Employee Management

**List View:**
- Columns: Photo, Code, Name, Department, Designation, Project, Status, Document Completion %
- Search by name/code
- Filter by company, department, designation, project, status
- Export to CSV

**Employee Form (8 tabs):**

| Tab | Fields |
|-----|--------|
| Identity | Name, DOB, Gender, Aadhaar, PAN, Blood Group, Photo |
| Employment | Code, Company, Department, Designation, Project, Joining Date, Employment Type, Status |
| Statutory | UAN (PF), ESIC No, PT applicable |
| Pay & Bank | Basic Salary, HRA, Allowances, Bank Account, IFSC, Bank Name |
| Contact | Phone, Email, Emergency Contact, Address |
| Documents | Upload 13 document types with expiry dates; completion % indicator |
| Letters | Appointment letter, warning letters, experience letters (view/download) |
| Onboarding | Checklist items with completion status |

**Document Types & Mandatory Status:**
| Document | Mandatory | Expiry Tracked |
|----------|-----------|----------------|
| Aadhaar Card | Yes | No |
| PAN Card | Yes | No |
| Bank Proof | Yes | No |
| Passport Photo | Yes | No |
| Driving License | No | Yes |
| Medical Fitness Certificate | No | Yes |
| PF Nomination | No | No |
| ESIC Card | No | No |
| Address Proof | No | No |
| Birth Certificate | No | No |
| Educational Certificate | No | No |
| Experience Certificate | No | No |
| Police Verification | No | Yes |

**Business Rules:**
- Employee cannot be saved without all 4 mandatory documents
- Document completion % = (uploaded docs / total applicable doc types) × 100
- Employee transfer: change companyId + projectId; log transfer event in audit trail
- Biometric re-enrolment request creates a queue entry visible to Site Admin

#### 7.3.2 Attendance

**Daily View:**
- Date selector (default: today)
- Grid: Employee | In Time | Out Time | OT Hours | Status | Actions
- Statuses: Complete, Absent, Half Day, On Leave, Holiday

**Mark/Edit Attendance Modal:**
- Fields: Date, Punch In, Punch Out, OT Hours, Status, Remarks
- Auto-calculates total hours; flags if < 4h (Half Day candidate)
- On save: creates audit log entry with "manually modified" flag

**Geofence Validation:**
- Each site has lat/lng coordinates and a radius (metres)
- Punch recorded as "Geofence Violation" if punch location outside site radius
- Exceptions queue lists all violations for HR review: approve or reject

**Holiday Declaration:**
- Declare a date as holiday for a company
- Attendance status auto-set to "Holiday" for all employees on that date

**Attendance Import (CSV):**
- Template downloadable
- Columns: Employee Code, Date, Punch In, Punch Out
- Validation report before import

#### 7.3.3 Leave Management

**Leave Types:**
| Type | Paid | Carryforward |
|------|------|--------------|
| Earned Leave (EL) | Yes | Yes (max 30 days) |
| Casual Leave (CL) | Yes | No |
| Sick Leave (SL) | Yes | No |
| Without Pay (LWP) | No | N/A |

**Application Workflow:**
1. Employee applies (via My Workspace or HR enters on behalf)
2. Status = Pending
3. HR/Site Admin reviews → Approve or Reject
4. On Approve: leave balance decremented; attendance records for the period updated to "On Leave"
5. On Reject/Cancel: balance restored if applicable

**Leave Balance Rules:**
- EL: 1 day accrued per 20 working days
- CL: fixed annual grant (configurable per company)
- SL: fixed annual grant (configurable per company)
- Balances visible on application form before submission
- Cannot apply for more days than available balance (except LWP)

#### 7.3.4 Payroll Processing

**Monthly Payroll Run:**
1. Select company + month/year
2. System pre-populates all active employees with salary components
3. Attendance data auto-fetched: compute working days, LWP deductions
4. Deductions calculated: PF (employee + employer), ESIC, PT, TDS, loan EMI
5. Net pay = Gross − Total Deductions
6. Review screen with per-employee breakdown
7. Process → status = Processed
8. Lock (on/after payroll lock date) → status = Locked; no further edits

**Salary Components:**
- Gross = Basic + HRA + Allowances
- PF (Employee) = 12% of Basic (capped at ₹15,000 Basic)
- PF (Employer) = 12% of Basic (split: 8.33% Pension + 3.67% PF)
- ESIC (Employee) = 0.75% of Gross (if Gross ≤ ₹21,000/month)
- ESIC (Employer) = 3.25% of Gross
- PT = per state slab (configurable)
- TDS = computed on annual projected income per Form 16 basis
- Loan EMI = per active loan record

**Salary Slip:**
- Company logo + address
- Employee details (name, code, designation, department, UAN, ESIC No)
- Pay period, working days, LWP days
- Earnings table + Deductions table
- Net Pay in words
- Generated server-side as a real PDF (Puppeteer, queued via BullMQ), stored in object storage, downloadable and emailed to the employee on payroll lock

**Bank Salary Sheet:**
- Summary per employee: Account No, IFSC, Net Pay
- Exportable to CSV for manual upload to the company's bank portal (no direct bank API integration in v1.0 — see §4 Out of Scope)

#### 7.3.5 Statutory Challans

- Monthly PF challan: ECR file generation (summary)
- ESIC challan: monthly return summary
- PT challan: per state
- Challan status: Pending / Filed / Paid

#### 7.3.6 Loans

- Loan application: amount, purpose, approved by, disbursement date
- EMI auto-deduction from payroll
- Loan statement: principal, paid, outstanding, EMI schedule
- Foreclose / Pause EMI actions

---

### 7.4 Plant & Machinery

#### 7.4.1 Asset Register

**List View:**
- Columns: Code, Name, Category, Ownership, Site, Current Reading, Status, Utilisation %, Document Alert
- Alert flags: 🟡 Expiring Soon, 🔴 Expired, 🔧 Under Maintenance

**Equipment Form:**
| Field | Notes |
|-------|-------|
| Code | Auto-generated or manual |
| Category | From Equipment Category master |
| Ownership | Owned / Hired |
| Vendor | If Hired; links to Vendor master |
| Power Source | Diesel / Electric / Manual / Petrol |
| Purchase Date / Cost | For owned assets |
| Depreciation Rate | % per annum |
| Meter Type | Hours / Kilometres |
| Deployed Site | Links to Sites master |

**Documents per Equipment:**
| Document | Alert Window |
|----------|-------------|
| Registration Certificate (RC) | 30 days |
| Insurance | 30 days |
| PUC / Pollution Certificate | 30 days |
| Fitness Certificate | 30 days |
| Permit | 30 days |
| Road Tax | 30 days |
| Calibration Certificate | 30 days |

Status logic: `EXPIRED` if expiry < today; `Expiring Soon` if expiry < today + alertDays; `Valid` otherwise.

**Utilisation %:**
```
utilisation = (totalHoursThisMonth / targetHoursThisMonth) × 100
```
Target hours configurable per category (default: 22 days × 8 hours = 176 hours/month).

#### 7.4.2 Logbook

- One entry per equipment per day
- Fields: Date, Equipment, Opening Reading, Closing Reading, Total (auto), Fuel Consumed, Operator, Project, Remarks
- Saves closing reading as equipment's `currentReading`
- Validates: Closing > Opening; no duplicate date per equipment

#### 7.4.3 Fuel Management

- Fuel entry: Equipment, Date, Quantity (litres), Rate (₹/litre), Amount, Vendor
- Consumption vs. Benchmark:
  ```
  variance% = ((actualConsumption - benchmark) / benchmark) × 100
  ```
  Alert generated if variance% > 15%
- Monthly fuel summary: quantity, cost, avg rate, variance status per equipment

#### 7.4.4 Maintenance

**Service Schedules (per equipment):**
- Service type, interval (hrs/km), last done reading, next due reading
- Status: OK / Due Soon (within 50 hrs) / Overdue

**Maintenance Jobs:**
- Type: Breakdown / Scheduled
- On open: equipment status → "Under Maintenance"
- Fields: Description, Opened At, Assigned To, Parts, Labour Cost, Total Cost
- On close: update linked service's "Last Done"; reset interval; equipment status → Active

#### 7.4.5 Hire Bills

For hired equipment billed by vendor:

1. Vendor submits bill (hours billed, rate, amount)
2. System compares with logbook: hours billed vs. hours logged
3. Variance = Billed Hours − Logbook Hours
4. TDS deduction applied at vendor's TDS rate
5. Net payable = Gross − TDS
6. Status flow: `Pending Verification` → `Verified` → `Paid`

#### 7.4.6 Equipment Category Master
- Name, Meter Type (hrs/km), Fuel Benchmark (litres/hr or litres/km)
- Used for variance calculation and utilisation target

---

### 7.5 Project Management

#### 7.5.1 Portfolio

**Project List:**
- Columns: Code, Name, Client, Contract Value, Status, Start Date, End Date, Progress %
- Filter by status, company, manager
- Summary row: total contract value

**Project Form:**
| Field | Notes |
|-------|-------|
| Code | Unique per company |
| Client | From Clients master |
| Location | Text + site selection |
| Manager | From Employees master |
| Contract Value | In ₹ |
| Budget (breakdown) | Labour, Materials, Machinery, Fuel, Overheads |
| Department Type | Civil, Electrical, Plumbing, etc. |

#### 7.5.2 Project Detail (Tabbed)

| Tab | Content |
|-----|---------|
| Overview | KPIs: contract value, spent, balance, progress % |
| Employees | Workers deployed at this project; add/remove |
| Machinery | Equipment deployed; add/remove |
| Materials | Stock balance for this project's site |
| DWR | Daily work reports for this project |
| Bills & Expenses | Purchases, hire bills, expense records |
| Revenue | Invoice/RA bill tracking |
| Costing | Budget vs. Actual per cost head |
| P&L | Auto-computed; see 7.5.4 |

#### 7.5.3 Daily Work Reports (DWR)

**DWR Form:**
- Date, Supervisor (from Employees), Workers Count, Machinery Count
- Progress % (overall project completion update)
- Weather conditions (Clear / Cloudy / Rain / Stopped)
- Work Description (free text)
- **BOQ Items table:** Task Group, Description, Unit, Total Qty, Completed Qty, Pending Qty (auto)
- **Measurements sub-table:** Nos × Length × Breadth × Depth × Density → Actual Qty (auto)

**BOQ Import:**
- Excel upload with columns: Task Group, Description, Unit, Total Qty
- Validation: no duplicate items; numeric qty only
- Errors displayed per row before import confirmed

**DWR Workflow:**
```
Draft → Submitted (by Site Engineer) → Approved (by Project Manager)
```
Only Approved DWRs count toward project progress % calculation.

#### 7.5.4 Project P&L

Auto-computed from linked records:

```
Revenue         = Σ(RA Bills / Invoices raised)
Labour Cost     = Σ(payroll.allocated to project)
Materials Cost  = Σ(inventory.issues for project) × avg rate
Machinery Cost  = Σ(logbook.hours × hire rate) + Σ(owned equipment depreciation)
Fuel Cost       = Σ(fuel.amount for project)
Overheads       = Σ(manual overhead entries)
─────────────────────────────────────────
Gross Profit    = Revenue − (Labour + Materials + Machinery + Fuel + Overheads)
GP Margin %     = Gross Profit / Revenue × 100
```

Budget vs. Actual variance displayed per cost head with colour coding (green = under budget, red = over budget).

---

### 7.6 Inventory & Purchasing

#### 7.6.1 Stock Management

**Stock Balance Formula:**
```
In Stock = Σ(Purchases) + Σ(TransferIn) − Σ(Issues) − Σ(TransferOut)
```

**Weighted Average Rate:**
```
WAR = Σ(purchaseQty × purchaseRate) / Σ(purchaseQty)
```

**Stock Value:**
```
Stock Value = In Stock × WAR
```

**Stock List View:**
- Columns: Item, Category, Unit, In Stock, WAR, Stock Value, Project/Site
- Filter by project, category
- Alert: highlight if stock < reorder level (configurable per item)

#### 7.6.2 Purchases

**Purchase Entry:**
- Vendor, Date, Items (multi-line), Qty, Rate, Amount (auto), Bill No, Payment Status

**Payment Status:**
- `Unpaid` → `Part Paid` → `Paid`
- Tracks amount paid vs. bill total

**GRN (Goods Receipt Note):**
- Auto-generated on purchase save
- Links to project's Bills & Expenses tab

#### 7.6.3 Issues

- Issue: Item, Qty (≤ In Stock), Issued To (person), Activity/BOQ Item, Date, Remarks
- Validates stock availability before save
- Creates stock deduction transaction

#### 7.6.4 Inter-Site Transfers

- From Site, To Site, Item, Qty (≤ From Site In Stock)
- Creates `TransferOut` on source, `TransferIn` on destination
- Transfer status: Pending / In Transit / Received

#### 7.6.5 Vendor Payments

- Select vendor → list outstanding bills
- Enter payment amount, date, mode (NEFT/RTGS/Cash/Cheque)
- System allocates payment against oldest unpaid bill first (FIFO)
- Auto-updates bill payment status

#### 7.6.6 Item Masters

**Item Master:** Name, Category, Unit, Reorder Level, HSN Code  
**Categories:** Cement, Aggregate, Steel, Bricks, Sand, Paint, Electrical, Plumbing, Fuel, Consumables  
**Units:** BAG, CUM, KG, NOS, MT, LTR, RMT, SQM

---

### 7.7 Partners (Vendors & Contractors)

#### 7.7.1 Vendor Management

**Vendor Form:**
| Field | Notes |
|-------|-------|
| Name | Unique |
| Type | Material / Fuel / Hire / Service / Transport / Subcontractor |
| Categories | Multi-select tags |
| GSTIN | Format validated: 15-char |
| PAN | Format validated: 10-char |
| TDS Section | 194C / 194J / 194I / etc. |
| TDS Rate | % |
| Contacts | Multiple (name, phone, email, role) |
| Work Detail | For subcontractors: hire type, contract code, rates |

#### 7.7.2 Contractor Management

**Contractor Vault:**
- License No, PF Reg No, ESIC Reg No, BOCW Reg No
- Insurance Policy No, Policy Expiry
- Compliance Status: derived from monthly compliance records

**Compliance Status Derivation:**
```
if pfSubmitted AND esicSubmitted → "Compliant"
if pfSubmitted XOR esicSubmitted → "Partially Compliant"
if neither → "Non-compliant"
```

#### 7.7.3 Monthly Compliance Tracking

- Per contractor, per month: enter PF Challan No + ESIC Challan No
- Admin verifies with timestamp
- Status: Missing / Submitted / Partial / Verified

#### 7.7.4 RAG Compliance Matrix

Visual grid:
- Rows: Contractors
- Columns: Months (Apr–Mar financial year)
- Cell colours:
  - 🟢 Green: Verified
  - 🟡 Yellow: Submitted / Partial
  - 🔴 Red: Missing
  - ⚫ Gray: Future months
- FY selector for historical view
- Click cell → opens compliance detail modal

#### 7.7.5 BOCW Cess

- BOCW cess liability = 1% of project contract value
- Per-project record: Amount Due, Amount Paid, Balance, Status (Pending / Partial / Paid)
- Payment entry with challan reference and date

---

### 7.8 Settings & Administration

#### 7.8.1 Company Management

- Add / edit companies
- Per-company statutory codes (GSTIN, PAN, PF Code, ESIC Code)
- Payroll settings: lock day (1–28), PF/ESIC rates, gratuity %, bonus %
- Logo upload

**Multi-Company Filter:**
A company selector in the header filters all list views to the selected company's data. "All Companies" shows combined view (Group Dashboard only).

#### 7.8.2 User Management

- Users list: Name, Email, Role, Status, Last Login
- Create/edit user: name, email, role, linked employee (optional), password
- Only Super Admin and HO User can create/edit users
- Deactivate user (soft delete; preserves audit trail)

#### 7.8.3 Roles & Permissions

- 9 default roles (see 7.1)
- Custom roles: cloned from existing role and modified
- Permissions table: Module × Action (view/create/edit/delete/approve)
- Cannot delete default roles

#### 7.8.4 Employee Setup Masters

| Master | Fields | Notes |
|--------|--------|-------|
| Code Series | Prefix, Start No, Digits, Company | Auto-increments employee codes |
| Departments | Name, Company | Used in employee form |
| Designations | Name, Department | Linked to department |
| Document Types | Name, Mandatory, Expiry Tracked, Alert Days | Drives employee documents tab |
| Shifts | Name, Start Time, End Time, Break Minutes | Linked to attendance |
| Public Holidays | Date, Name, Company | Marks attendance as Holiday |

#### 7.8.5 Machinery Masters

| Master | Fields |
|--------|--------|
| Equipment Categories | Name, Meter Type, Fuel Benchmark |
| Equipment Doc Types | Name, Alert Days |
| Hire Rates | Equipment, Rate Type, Rate Amount |

#### 7.8.6 Inventory Masters

- Item Master (see 7.6.6)
- Category Master
- Reorder Levels per item per site

---

### 7.9 My Workspace (Employee Self-Service)

#### 7.9.1 Punch In / Out
- Live clock display
- Punch In button (disabled if already punched in)
- Punch Out button (disabled if not punched in)
- GPS geofence validation on each punch via `navigator.geolocation`, checked server-side against the site's lat/lng + radius
- Photo capture via device camera (`<input capture>`) attached to the punch record for **manual admin verification** (not automated face-recognition matching — see §4 Out of Scope)
- Works offline: punch is queued in IndexedDB and synced via Background Sync when connectivity returns (HLD §11.2)
- Today's punch history visible

#### 7.9.2 Leave Application
- Select leave type, dates, reason
- Available balance shown per type
- Submit → creates leave record (status = Pending)
- History: list of own leave records with status

#### 7.9.3 Salary Slip Download
- Month/year selector
- If payroll processed and locked: fetch the generated salary-slip PDF from object storage
- Download or view inline; also delivered by email when payroll is locked
- History: last 12 months

#### 7.9.4 Face Enrolment
- First-time enrolment: capture 3–5 photos via device camera
- Consent acknowledgement checkbox (mandatory)
- Photos uploaded to object storage and submitted for **manual admin review** (no automated recognition/matching in v1.0)
- Re-enrolment: employee requests → admin approval required → creates re-enrolment queue entry
- Status visible: Not Enrolled / Pending Review / Enrolled / Re-enrolment Pending

---

## 8. Cross-Cutting Concerns

### 8.1 Audit Trail
Every create, edit, delete, and approval action writes to the activity log:
```
{timestamp, userId, userName, action, module, entityType, entityId, before, after}
```
Immutable — no delete from activity log.

### 8.2 Approval Workflows
Standard workflow pattern used across modules:

```
[Draft] → [Submitted] → [Approved]
                     ↘ [Rejected]
[Approved] → [Cancelled]
```

Modules using this pattern: Leave, DWR, Hire Bills, Maintenance Jobs, Face Enrolment.

### 8.3 Notifications
Auto-generated based on configurable business rules and delivered through up to three channels per user preference:
- **In-app** — real-time via Socket.io, no refresh required
- **Web Push** — VAPID-based push to the installed PWA, even when the app is closed (iOS 16.4+ and Android)
- **Email / SMS** — Resend (email) / Twilio (SMS) for payslips, leave decisions, and compliance alerts

Severity levels:
- **Info** (blue): General updates
- **Warning** (amber): Action recommended
- **Alert** (red): Immediate action required

All notifications are dismissible per-user; dismissal state persists server-side.

### 8.4 Computed Values
No aggregates are stored. All totals, balances, and KPIs are computed at query time from transaction records. This ensures data consistency and simplifies undo/correction (just correct the source record).

### 8.5 Multi-Company Data Isolation
All entity queries are filtered by the active `companyId`. The header company selector persists in session. Super Admin can see all companies.

### 8.6 Export
All list views support CSV export. Payroll salary slips are generated as real PDFs server-side (Puppeteer, via BullMQ). Reports are generated asynchronously (BullMQ) as downloadable CSV/PDF, with scheduled report support via cron jobs.

---

## 9. UI/UX Design System

### 9.1 Layout
```
┌─────────────────────────────────────────────────┐
│  HEADER (fixed, 56px): Search | Notifications | User │
├──────────────┬──────────────────────────────────┤
│ SIDEBAR      │  MAIN CONTENT                    │
│ (fixed,      │  (scrollable)                    │
│  240px /     │                                  │
│  60px coll.) │                                  │
└──────────────┴──────────────────────────────────┘
```

### 9.2 Colour Tokens
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#1e3a5f` | Headers, active nav |
| Primary Dark | `#0f172a` | Sidebar background |
| Accent | `#f59e0b` | Highlight, amber alerts |
| Success | `#10b981` | Active, approved, valid |
| Danger | `#ef4444` | Absent, rejected, expired |
| Warning | `#f59e0b` | Expiring soon, pending |
| Info | `#3b82f6` | On Leave, informational |
| Purple | `#8b5cf6` | Completed status |
| Text Primary | `#111827` | Body text |
| Text Secondary | `#6b7280` | Labels, hints |
| Border | `#e5e7eb` | Table borders, card borders |
| Background | `#f9fafb` | Page background |

### 9.3 Typography
- Headings: 700 weight, scale 24/20/18/16px
- Body: 400 weight, 14px base
- Labels: 500 weight, 12px uppercase for table headers

### 9.4 Status Badges
```css
.badge-success  { background: #d1fae5; color: #065f46 }
.badge-danger   { background: #fee2e2; color: #991b1b }
.badge-warning  { background: #fef3c7; color: #92400e }
.badge-info     { background: #dbeafe; color: #1e40af }
.badge-purple   { background: #ede9fe; color: #5b21b6 }
.badge-gray     { background: #f3f4f6; color: #374151 }
```

### 9.5 Component Patterns

**Tables:** Fixed header, alternating row hover (#f9fafb), horizontal scroll on mobile.  
**Modals:** Max-width 640px (forms) / 480px (confirmations); backdrop blur; ESC to close.  
**Toast Notifications:** Bottom-right, 3-second auto-dismiss, stack up to 3.  
**Forms:** Label above input, 4px border-radius, focus ring `#1e3a5f`, inline validation errors.  
**Empty States:** Centred icon (Font Awesome) + heading + sub-text + optional CTA.  
**Dropdowns:** Searchable for lists > 10 items (employees, vendors, items).  
**Progress Bars:** Height 8px, rounded, colour by threshold (green/amber/red).

### 9.6 Responsive Breakpoints
| Breakpoint | Width | Behaviour |
|------------|-------|-----------|
| Mobile | < 768px | Sidebar hidden; hamburger menu; tables scroll |
| Tablet | 768–1024px | Sidebar collapsed (60px) |
| Desktop | > 1024px | Sidebar expanded (240px) |

---

## 10. Non-Functional Requirements

### 10.1 Performance
- Initial page load < 2 seconds (Next.js SSR + edge caching)
- Client-side navigation between routes < 300ms
- API p95 response time < 300ms for reads, < 800ms for writes involving computed values (P&L, payroll preview)
- Payroll runs and report generation execute as background jobs (BullMQ) and must not block the request thread
- Supports at least 5,000 employees, 500 projects, and 2,000 equipment items per tenant without degraded query performance (indexed, paginated queries)

### 10.2 Browser Compatibility
- Chrome 100+ (primary)
- Firefox 100+
- Safari 15+ (incl. iOS 16.4+ for Web Push support)
- Edge 100+
- No IE11 support
- PWA installable on Android and iOS home screens

### 10.3 Accessibility
- WCAG 2.1 AA target
- Keyboard navigable modals (Tab/Shift-Tab/ESC)
- ARIA labels on icon-only buttons
- Colour is never the only differentiator (icon + colour for status)
- Minimum contrast ratio 4.5:1 for body text

### 10.4 Security
- HTTPS everywhere (TLS termination at CDN/edge)
- Passwords hashed with bcrypt/argon2; never logged or returned by any API
- JWT access tokens (15 min TTL) + HTTP-only, secure refresh-token cookies (7 days, rotated, revocable via Redis)
- Row-Level Security in PostgreSQL enforces `company_id` tenant isolation at the database layer
- All request payloads validated via NestJS `class-validator` DTOs
- Rate limiting on auth and OTP endpoints (NestJS throttler)
- File uploads use pre-signed object-storage URLs with a virus-scan hook; files are never proxied through the API
- Secrets managed via environment variables, never committed to source control
- Input sanitised before rendering to prevent XSS; output-encoded on the client

### 10.5 Data Integrity
- All numeric inputs validated at entry; no negative quantities
- Foreign key references validated before save (e.g., vendorId must exist)
- Deletion blocked if entity is referenced elsewhere (soft-delete preferred)

### 10.6 Scalability Path
```
Phase 1 (MVP)    → Modular monolith NestJS + managed Postgres/Redis + Vercel  (~$0–$30/mo)
Phase 2 (Growth) → Extract Reports & Payroll into separate NestJS apps        (~$50–$100/mo)
Phase 3 (Scale)  → Kubernetes (EKS/GKE) + read replicas + CDN cache          (~$200+/mo)
```
Full cost breakdown per phase is in `docs/HLD.md` §7 and §10.

---

## 11. Constraints & Assumptions

### Constraints
- **No automated biometric matching**: face enrolment/verification photos are captured and stored for manual admin review only; no AI-based face recognition in v1.0
- **No bank API integration**: salary disbursement is via an exported bank sheet uploaded manually to the company's banking portal
- **Payroll/report generation requires connectivity**: these run as server-side background jobs and are blocked while the PWA is offline (shown clearly in the UI)
- **Indian context**: Statutory compliance (PF, ESIC, PT, TDS) designed for Indian regulations

### Assumptions
- Multi-user, multi-device, concurrent access is fully supported (unlike the earlier prototype's single-browser-session model)
- Financial year: April–March (Indian standard)
- Currency: Indian Rupee (₹) throughout
- Working week: Monday–Saturday (6 days); Sundays are weekly off by default
- PF wage ceiling: ₹15,000/month Basic (as per Indian EPF Act)
- ESIC wage ceiling: ₹21,000/month Gross (as per Indian ESIC Act)

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| **BOQ** | Bill of Quantities — itemised list of work tasks with quantities |
| **BOCW** | Building and Other Construction Workers (Welfare) Cess — 1% levy |
| **DWR** | Daily Work Report — daily progress entry on a project |
| **ECR** | Electronic Challan cum Return — PF filing format |
| **ESIC** | Employees' State Insurance Corporation |
| **GRN** | Goods Receipt Note |
| **KPI** | Key Performance Indicator |
| **LWP** | Leave Without Pay |
| **P&L** | Profit & Loss |
| **PF / EPF** | Provident Fund / Employees' Provident Fund |
| **PT** | Professional Tax (state-level) |
| **RA Bill** | Running Account Bill — interim invoice for work completed |
| **RAG** | Red-Amber-Green status matrix |
| **RBAC** | Role-Based Access Control |
| **PWA** | Progressive Web App — installable, offline-capable web app |
| **TDS** | Tax Deducted at Source |
| **UAN** | Universal Account Number (PF) |
| **WAR** | Weighted Average Rate (inventory costing) |

---

*End of BuildCore ERP Master PRD v2.0*
