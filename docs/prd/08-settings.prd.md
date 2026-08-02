# PRD: Settings Module

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

### 1. Companies (`/settings/companies`)

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

### 2. Users (`/settings/users`)

#### User List
- **Columns:** Name, Email, Role (from Roles master), Status (Active/Inactive), Last Login (date/time), Actions (Edit/Delete)

#### Account Creation
- New user accounts are created exclusively through the Account Creation flow (see the Authentication & Account Management PRD) — only Super Admin and HO User roles can create accounts
- One bootstrap Super Admin account is provisioned during initial system deployment; all subsequent users are created by an admin from within the application

#### Behaviors
- User's assigned role determines accessible modules and actions, enforced at both the UI and API layer
- Authentication validates credentials against the backend user store (passwords hashed, never stored or transmitted in plain text)
- Last Login timestamp updates on each successful sign-in

### 3. Roles & Permissions (`/settings/roles`)

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
- Format: `{CompanyShortCode}-{SequentialNumber}` (e.g., DC-0001, DI-0001)

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
