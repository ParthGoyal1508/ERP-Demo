## DASHBOARD & GROUP DASHBOARD MODULE

---

### SIDEBAR STRUCTURE

```
General
  ├── Dashboard
  ├── Group Dashboard
  ├── Site Dashboard
  ├── Notifications
  ├── Activity Log
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

### NOTIFICATIONS CENTER (`/notifications`)

**Layout:**
- Page title "Notifications"
- Notifications list sorted newest-first
- Auto-generated from live data — no manual creation

**Notification sources (auto-generated):**

| Category | Icon | Color | Condition | Example |
|---|---|---|---|---|
| Document Expiry | fa-file-circle-exclamation | Red | Equipment document expires within 30 days or already expired | "CAR-001 — PUC expires on 30 Jul 2026" |
| Pending Leave Approvals | fa-calendar-clock | Yellow | Leave applications with status "Pending" | "Vikram Meena applied for 2 days Casual Leave — awaiting approval" |
| Maintenance Due | fa-wrench | Orange | Open maintenance jobs or due services from alerts | "EXC-001 — Breakdown job open since 20 Jul 2026" |
| Fuel Variance | fa-gas-pump | Red | Fuel consumption exceeds category benchmark by >15% | "BHL-001 — Fuel consumption 13% above benchmark" |
| Contractor Compliance | fa-shield-halved | Red | Missing compliance submissions for current/previous month | "Shree Balaji Labour Co — Jun 2026 compliance missing" |
| Payroll Pending | fa-money-check | Blue | Months with no payroll run | "Jul 2026 payroll not yet processed" |

**Notification row layout:**
- Icon (colored by category)
- Title — bold, one-line summary
- Subtitle — details + timestamp
- Action link — navigates to relevant page (e.g. "View" → /hr/leave, /machinery, etc.)

**Bell badge (header):**
- The bell icon in the app header shows a red badge with the total count of active notifications
- Badge count auto-derives from the same data sources

**Behaviors:**
- Notifications are computed on-the-fly from live data, not stored separately
- Clicking a notification's action link navigates to the relevant page
- No manual dismiss — notifications disappear when the underlying condition is resolved

---

### ACTIVITY LOG (`/activity-log`)

**Layout:**
- Page title "Activity Log"
- Chronological feed of all user actions, newest first
- Filters: All modules | Today / 7 days / 30 days

**Activity log entry format:**
- Avatar/Icon — action type icon
- **User** performed **action** on **target**
- Timestamp (relative, e.g. "2 hours ago" / absolute date)

**Activity types tracked:**

| Module | Actions Logged |
|---|---|
| HR | Employee added/edited, Attendance modified, Leave approved/rejected |
| Payroll | Payroll run generated, Salary slip viewed |
| Machinery | Asset added, Logbook entry, Fuel entry, Maintenance job opened/closed, Document added |
| Projects | Project added/edited, DWR submitted/approved, Client/Site added |
| Inventory | Purchase recorded, Issue recorded, Transfer recorded, Payment recorded, Item Master added |
| Partners | Vendor added/edited, Contractor added, Compliance recorded/verified |
| Settings | Company/User/Role changes |

**Pre-populated mock data (10 entries):**
| Time | Entry |
|---|---|
| 24 Jul, 9:15 AM | Admin approved leave LV-002 (Vikram Meena — Casual Leave) |
| 24 Jul, 9:00 AM | Admin ran payroll for Jul 2026 |
| 23 Jul, 4:30 PM | Suresh Sharma submitted DWR DWR-001 for NH-48 O&M |
| 23 Jul, 3:15 PM | Admin recorded fuel entry MF-001 — BHL-001, 65L |
| 23 Jul, 2:00 PM | Admin added logbook entry LB-001 — BHL-001 |
| 22 Jul, 5:00 PM | Admin modified attendance for Vikram Meena (Absent → Present) |
| 22 Jul, 11:00 AM | Admin recorded purchase PUR-001 — Cement 100 BAG |
| 21 Jul, 3:00 PM | Admin added document (Insurance) to BTK-001 |
| 20 Jul, 10:00 AM | Admin opened maintenance job MJ-001 — EXC-001 Breakdown |
| 20 Jul, 9:00 AM | Admin verified compliance for Rajasthan Labour Services — Jun 2026 |

**Behaviors:**
- Activity log entries stored in `AppData.activityLog[]`
- Every create/update/delete action across the app pushes a new log entry
- Log entries have: `{ id, timestamp, user, action, module, target, detail }`
- Filterable by module and time range
- Max 200 entries retained (oldest trimmed)

---

### SITE DASHBOARD (`/site-dashboard`)

**Layout:**
- Page title "Site Dashboard"
- Top: **Site selector dropdown** — lists all project sites
- Below: Site-specific KPI cards + data sections

**Site selector:**
- Dropdown populated from projects list (NH-48 O&M, NH-11 Widening, SH-22 Maintenance)
- Changing site refreshes all sections below

**KPI Cards (4-column grid):**
| Card | Description | Data Source |
|---|---|---|
| Workers Today | Count of employees with attendance at this site | Attendance filtered by project |
| Machinery Deployed | Count of assets assigned to this site | Assets filtered by site |
| Fuel Consumed (Month) | Total fuel litres this month at this site | Machinery Fuel filtered by site |
| Material Stock Value | Total stock value at this site | Stock filtered by project |

**Section 1: Today's Attendance (table)**
- Filtered to selected site/project
- Columns: Employee, Department, Status

**Section 2: Machinery at Site (table)**
- Assets where `site` matches selected project
- Columns: ID, Machine, Category, Reading, Utilization, Document Status

**Section 3: Fuel Consumption (recent entries)**
- Last 10 fuel entries for this site
- Columns: Date, Machine, Quantity (L), Amount

**Section 4: Material Stock (table)**
- Stock items where `project` matches
- Columns: Item, Category, In Stock, Stock Value

**Section 5: Recent Expenses**
- Purchases for this project (last 5)
- Columns: Date, Item, Vendor, Amount

**Behaviors:**
- All sections filter by the selected site/project
- KPI values recompute on site change
- Site Dashboard gives Project Managers a single-view of their site's operations
- Default selection: first project in list

---

### EQUIPMENT UTILIZATION REPORT (`/machinery/utilization`)

**Layout:**
- Page title "Equipment Utilization Report"
- Top: Month selector (dropdown) — defaults to current month
- Horizontal stacked bar chart (CSS-only) showing utilization bands
- Below: Detailed table of all machines with utilization %

**Utilization bands (summary bar):**
| Band | Range | Color | Meaning |
|---|---|---|---|
| Underutilized | <60% | Red | Machines sitting idle — consider releasing hired ones |
| Normal | 60–80% | Yellow | Healthy usage range |
| Well Utilized | 80–95% | Green | Optimal |
| Overutilized | >95% | Orange | Risk of breakdown — consider hiring more |

**Summary cards (4-column):**
| Card | Value | Description |
|---|---|---|
| Total Machines | Count | All assets |
| Underutilized (<60%) | Count | Consider releasing |
| Well Utilized (80–95%) | Count | Optimal range |
| Overutilized (>95%) | Count | Need attention |

**Utilization bar visualization:**
- Full-width horizontal bar divided into colored segments
- Each segment proportional to count of machines in that band
- Labels inside segments showing count

**Detailed table:**
| Column | Description |
|---|---|
| Machine | ID + Name |
| Category | Equipment category |
| Site | Assigned site |
| Ownership | Owned / Hired |
| Utilization % | Percentage with progress bar |
| Band | Underutilized / Normal / Well Utilized / Overutilized |
| Recommendation | "Release if hired" / "OK" / "Optimal" / "Hire backup" |

**Sorting:** Sorted by utilization % ascending (worst first)

**Behaviors:**
- Utilization data from Asset Register `utilization` field
- Provides actionable insights: which machines to release vs hire more
- Hired + Underutilized machines flagged prominently (money being wasted)
- Month selector is placeholder (data is current snapshot)

---

### CROSS-MODULE BEHAVIORS

- Dashboard alerts derive from Machinery service schedules and document expiry dates
- **Notifications Center** auto-generates alerts from document expiry, pending leaves, maintenance, fuel variance, compliance gaps
- **Activity Log** records all user actions across all modules
- **Site Dashboard** filters all modules by a single site for PM view
- **Equipment Utilization Report** helps decide hire vs release decisions
- Active Projects count derives from Projects Portfolio data
- Employees on Muster derives from today's Attendance data
- Group Dashboard metrics are aggregated from all companies' HR, Payroll, and Loan data
- Statutory Calendar entries auto-generate from Challans module data
- All data persists in localStorage
