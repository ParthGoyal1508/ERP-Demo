## DASHBOARD & GROUP DASHBOARD MODULE

---

### SIDEBAR STRUCTURE

```
General
  ├── Dashboard
  ├── Group Dashboard
  └── Reports
```

---

### DASHBOARD (`/dashboard`)

**Layout:**
- Page title "Dashboard" with current date
- **Top section:** 8 KPI summary cards in a grid
- **Middle section:** Two-column layout — Alerts & Reminders (left, wide) | Quick Stats (right)
- **Bottom section:** Two-column layout — Today's Attendance table | Recent Leaves table

**KPI Cards (top grid):**
| Card | Icon | Color | Click Action |
|---|---|---|---|
| Total Employees | fa-users | Blue | → /hr/employees |
| Present Today | fa-user-check | Green | → /hr/attendance |
| Absent | fa-user-times | Red | → /hr/attendance |
| On Leave | fa-calendar-minus | Yellow | → /hr/leave |
| Active Projects | fa-project-diagram | Purple | → /projects/portfolio |
| Total Machinery | fa-truck | Cyan | → /machinery |
| Monthly Expenses | fa-rupee-sign | Orange | — |
| Pending Approvals | fa-clock | Pink | → /hr/leave |

**Quick Stats sidebar (right column):**
- Contract Value total
- Employees on Muster (present/total)
- Materials Cost
- Fuel Cost
- Hire Bills

**Today's Attendance table (bottom left):**
- Shows first 8 attendance records for today
- Columns: Employee, Department, Status

**Recent Leaves table (bottom right):**
- Shows all leave applications
- Columns: Employee, Type, Days, Status

**Alerts & Reminders section:**
- Blue dot bullet list of active alerts
- Each alert shows machine code, description, due date
- Alert types:
  - Engine oil & filter change approaching (with remaining units)
  - Document expiry warnings (PUC/Pollution Certificate, Insurance Policy) with expiry dates
- Footer link: "Open the asset register for per-machine flags."

**Pre-populated alert data:**
| Alert | Details | Due Date |
|---|---|---|
| DG-003 — Engine oil & filter change approaching | 2.0 units remaining | 26 May 2026 |
| DG-002 — Engine oil & filter change approaching | 22.0 units remaining | 04 Apr 2026 |
| BSP-001 — Engine oil & filter change approaching | 3.0 units remaining | 18 Apr 2026 |
| PVR-001 — Engine oil & filter change approaching | 618.0 units remaining | 17 May 2026 |
| TOW-001 PUC / Pollution Certificate | PUC/RJ/2026/81703 | expires 2026-07-31 |
| TOW-001 Insurance Policy | POL/2026/321127 | expires 2026-08-10 |
| CAR-001 PUC / Pollution Certificate | PUC/RJ/2026/56165 | expires 2026-07-31 |
| CAR-001 Insurance Policy | POL/2026/667145 | expires 2026-08-10 |

**Active Projects card (right column):**
- Large number showing total active projects: **3**
- Contract value: ₹18,50,00,000.00
- Link: "Open the portfolio"

**Employees on Muster card (far right):**
- Shows current muster/attendance count (placeholder)

**Expenses this month card (bottom):**
- Shows monthly expense summary (placeholder)

**Behaviors:**
- KPI cards are clickable and navigate to their respective modules
- All KPI values derive from live mock data (employees, attendance, projects, machinery, expenses, leaves)
- Alerts are auto-generated from machinery service schedules and document expiry dates
- Clicking "Open the asset register" navigates to `/machinery`
- Clicking "Open the portfolio" navigates to `/projects/portfolio`
- All values derive from live mock data

---

### GROUP DASHBOARD (`/group`)

**Layout:**
- Page title "Group Dashboard"
- Company cards in a row (one per company) + Group Total summary card on the right
- Below: Statutory Calendar section
- Below: Group Employee Search

**Company cards:**
Each company card shows:
| Metric | Description |
|---|---|
| Company name | e.g. Demo Constructions Pvt Ltd |
| Payroll period | e.g. "Payroll: Aug 2026" |
| Headcount | Total employees |
| Payroll cost | Total payroll amount (₹) |
| PF / ESIC pending | Count of pending PF / ESIC filings |
| Loans outstanding | Total outstanding loan amount (₹) |
| Docs pending | Number of pending employee documents |

**Pre-populated company data:**

| Company | Headcount | Payroll Cost | PF/ESIC Pending | Loans Outstanding | Docs Pending |
|---|---|---|---|---|---|
| Demo Constructions Pvt Ltd | 22 | ₹28,254.60 | 2 / 0 | ₹39,000.00 | 0 |
| Demo Infra Projects Pvt Ltd | 11 | ₹0.00 | 0 / 0 | ₹0.00 | 0 |

**Group Total card (right side):**
- 2 companies
- Headcount: 33
- Payroll cost: ₹28,254.60
- PF / ESIC pending: 2 / 0
- Loans outstanding: ₹39,000.00
- Docs pending: 0

**Statutory Calendar section:**
- Title: "Statutory calendar"
- Financial Year selector (dropdown): FY 2026-27
- Table showing upcoming statutory due dates

| Company | Kind | Period | Due date | Amount | Status |
|---|---|---|---|---|---|
| Demo Constructions Pvt Ltd | PF | Jul 2026 | 15 Aug 2026 | ₹855.00 | Pending |
| Demo Constructions Pvt Ltd | PF | Aug 2026 | 15 Sept 2026 | ₹4,175.00 | Pending |

**Group Employee Search section:**
- Title: "Group employee search"
- Search input: "Name, code or Aadhaar last-4 (min 2 chars)..."
- Search button
- Searches across all companies in the group

**Behaviors:**
- Company cards auto-update from employee, payroll, loan, and document data
- Statutory calendar shows PF, ESIC, PT filing deadlines
- Group search finds employees across all companies by name, code, or Aadhaar last-4 digits
- Financial Year dropdown filters the statutory calendar

---

### REPORTS (`/reports`)

**Layout:**
- Page title "Reports"
- Report categories with date range filters and export buttons

**Available report types:**
- Attendance Report
- Payroll Report
- Employee Report
- Machinery Report
- Fuel Report
- Project Cost Report
- Expense Report
- P&L Report

**Each report has:**
- Date range picker (From — To)
- Relevant filters (department, project, category etc.)
- Mocked "Export" button → toast "Report exported (mocked)"
- Tabular data display matching the filtered criteria

---

### CROSS-MODULE BEHAVIORS

- Dashboard alerts derive from Machinery service schedules and document expiry dates
- Active Projects count derives from Projects Portfolio data
- Employees on Muster derives from today's Attendance data
- Group Dashboard metrics are aggregated from all companies' HR, Payroll, and Loan data
- Statutory Calendar entries auto-generate from Challans module data
- All data persists in localStorage
