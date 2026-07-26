## PROJECTS MODULE

---

### SIDEBAR STRUCTURE

```
Projects
  ├── Portfolio
  ├── Clients
  └── Sites
```

---

### PORTFOLIO (`/projects/portfolio`)

**Layout:**
- Page title "Portfolio"
- Top-right: **"+ New project"** button (primary)
- Search bar: "Search project name, code..."
- Filters: All statuses | All clients

**Portfolio table columns:**
| Column | Description |
|---|---|
| Code | Project code (e.g. NH48, NH11, SH22) |
| Project Name | Full project name (e.g. NH-48 O&M, NH-11 Widening, SH-22 Maintenance) |
| Client | Client/awarding authority |
| Location | Project site location |
| Contract Value | Total contract value (₹) |
| Status | Planning / Ongoing / On Hold / Completed |
| Start Date | Project start date |
| End Date | Expected completion date |
| Actions | View / Edit / Delete |

**Pre-populated mock projects:**
| Code | Project Name | Status |
|---|---|---|
| NH48 | NH-48 O&M | Ongoing |
| NH11 | NH-11 Widening | Ongoing |
| SH22 | SH-22 Maintenance | Ongoing |

**Dashboard reference:** Active projects count = **3**, Contract value = ₹18,50,00,000.00

**New Project modal/form:**
| Field | Type |
|---|---|
| Project Code | Text (auto-generated, editable) |
| Project Name | Text |
| Client | Dropdown (from Clients list) |
| Location | Text |
| Contract Value (₹) | Number |
| Start Date | Date picker |
| Expected End Date | Date picker |
| Status | Dropdown: Planning / Ongoing / On Hold / Completed |
| Project Manager | Dropdown (from Employees) |
| Description | Textarea |

**On submit:** New row in Portfolio, toast "Project created successfully"

**Project Detail page** (clicking project name or view icon):

Tabs:
- **Overview** — Project summary card: name, code, client, location, contract value, dates, status, manager
- **Employees** — List of employees assigned to this project (from HR → Employees)
- **Machinery** — List of machinery deployed at this site (from Machinery → Asset Register)
- **Materials/Inventory** — Stock at this project store (links to Inventory filtered by project)
- **Daily Work Reports** — Date, description, workers count, machinery used, materials consumed, % progress, supervisor, remarks. Full CRUD.
- **Bills & Expenses** — Vendor bills and project expenses with category, amount, tax, payment status. Full CRUD.
- **Revenue** — Revenue entries against this project
- **Costing** — Cost breakdown by category (Labour, Material, Machinery, Fuel, Other) vs budget with variance
- **P&L** — Dynamic calculation: Revenue − (Labour + Material + Machinery + Fuel + Other) = Gross Profit, Net Profit, Margin %

---

### DAILY WORK REPORTS (`/projects/dwr`)

**Layout:**
- Page title "Daily Work Reports"
- Top-right: **"+ New DWR"** button (primary)
- Filters: Project dropdown | Date range | Supervisor

**DWR table columns:**
| Column | Description |
|---|---|
| Date | Report date |
| Project | Project name |
| Supervisor | Person who submitted |
| Workers | Total workers on site |
| Machinery | Number of machines deployed |
| Progress | % completion of current activity |
| Weather | Clear / Rainy / Overcast |
| Status | Draft / Submitted / Approved |
| Actions | View / Edit / Delete |

**Pre-populated DWR entries:**
| Date | Project | Supervisor | Workers | Machinery | Progress | Weather | Status |
|---|---|---|---|---|---|---|---|
| 24 Jul 2026 | NH-48 O&M | Suresh Sharma | 14 | 6 | 72% | Clear | Submitted |
| 23 Jul 2026 | NH-48 O&M | Suresh Sharma | 12 | 5 | 68% | Clear | Approved |
| 22 Jul 2026 | NH-48 O&M | Suresh Sharma | 15 | 7 | 65% | Rainy | Approved |
| 24 Jul 2026 | NH-11 Widening | Rajendra Singh | 8 | 4 | 45% | Clear | Draft |
| 23 Jul 2026 | NH-11 Widening | Rajendra Singh | 10 | 5 | 42% | Clear | Approved |

**New/Edit DWR modal:**
| Field | Type |
|---|---|
| Project | Dropdown (from projects list) |
| Date | Date picker (defaults to today) |
| Supervisor | Dropdown (from employees) |
| Weather | Dropdown: Clear / Rainy / Overcast / Stormy |
| Workers on Site | Number |
| Machinery Deployed | Number |
| Progress (%) | Number (0-100) |
| Description of Work | Textarea |
| Materials Used | Textarea (e.g. "Cement 50 bags, Steel 200 kg") |
| Issues / Remarks | Textarea |
| Status | Dropdown: Draft / Submitted |

**On submit:** New row in table, toast "DWR saved successfully"

**Behaviors:**
- DWRs are the daily pulse of a construction site
- Progress % tracks the overall physical completion
- Supervisor is the person accountable for that day's work
- Admin can approve submitted DWRs
- DWR data feeds into Project P&L labour cost estimation

---

### PROJECT P&L (`/projects/pnl`)

**Layout:**
- Page title "Project P&L"
- Project selector dropdown (top-left)
- Period selector: Monthly / Quarterly / Yearly / Cumulative

**P&L Summary Cards (top row):**
| Card | Color | Value Source |
|---|---|---|
| Contract Value | Blue | From project data |
| Revenue Booked | Green | Sum of revenue entries |
| Total Expenses | Red | Sum of all cost categories |
| Gross Profit | Purple | Revenue − Expenses |
| Margin % | Orange | (Gross Profit / Revenue) × 100 |

**Cost Breakdown Table:**
| Category | Budget (₹) | Actual (₹) | Variance (₹) | Variance % |
|---|---|---|---|---|
| Labour | 45,00,000 | 38,50,000 | 6,50,000 | -14.4% (under) |
| Materials | 60,00,000 | 52,00,000 | 8,00,000 | -13.3% (under) |
| Machinery & Fuel | 30,00,000 | 28,75,000 | 1,25,000 | -4.2% (under) |
| Subcontractors | 20,00,000 | 22,00,000 | -2,00,000 | +10% (over) |
| Overheads | 10,00,000 | 9,50,000 | 50,000 | -5% (under) |
| **Total** | **1,65,00,000** | **1,50,75,000** | **14,25,000** | **-8.6%** |

**Revenue Section:**
| Description | Amount (₹) | Date | Status |
|---|---|---|---|
| RA Bill #1 — Mobilisation Advance | 92,50,000 | 15 Apr 2026 | Received |
| RA Bill #2 — Work done till May | 45,00,000 | 10 Jun 2026 | Received |
| RA Bill #3 — Work done till Jul | 30,00,000 | 20 Jul 2026 | Pending |

**P&L Statement:**
| Line Item | Amount (₹) |
|---|---|
| Revenue Booked | 1,67,50,000 |
| Less: Labour Cost | (38,50,000) |
| Less: Material Cost | (52,00,000) |
| Less: Machinery & Fuel | (28,75,000) |
| Less: Subcontractors | (22,00,000) |
| Less: Overheads | (9,50,000) |
| **Gross Profit** | **16,75,000** |
| **Margin %** | **10.0%** |

**Behaviors:**
- All values auto-derive from live data (payroll for labour, inventory for materials, fuel/hire bills for machinery, vendor payments for subcontractors)
- Project selector filters all data to one project
- Variance highlights: green (under budget), red (over budget)
- Period selector changes the time window for actuals
- "Export" button → toast "P&L report exported (mocked)"

---

### CLIENTS (`/projects/clients`)

**Layout:**
- Page title "Clients"
- Top-right: **"+ New client"** button
- Search bar: "Search client name..."

**Clients table columns:**
| Column | Description |
|---|---|
| Client Name | Organization name |
| Contact Person | Primary contact name |
| Phone | Contact number |
| Email | Email address |
| Address | Office address |
| Projects | Number of associated projects |
| Status | Active / Inactive |
| Actions | Edit / Delete |

**New Client modal:**
| Field | Type |
|---|---|
| Client Name | Text |
| Contact Person | Text |
| Phone | Text |
| Email | Text |
| Address | Textarea |
| GSTIN | Text |
| Status | Toggle: Active/Inactive |

**On submit:** New row in Clients, toast "Client added successfully"

**Behaviors:**
- Client list populates the Client dropdown in New Project form
- Clicking Projects count navigates to Portfolio filtered by that client
- Full CRUD with search

---

### SITES (`/projects/sites`)

**Layout:**
- Page title "Sites"
- Top-right: **"+ New site"** button
- Search bar: "Search site name, location..."

**Sites table columns:**
| Column | Description |
|---|---|
| Site Name | Site/store identifier (e.g. NH48 — NH-48 O&M) |
| Project | Linked project |
| Location | GPS coordinates or address |
| Geofence Radius | Radius in meters for attendance geofencing |
| Status | Active / Inactive |
| Actions | Edit / Delete |

**New Site modal:**
| Field | Type |
|---|---|
| Site Name | Text |
| Project | Dropdown (from Portfolio) |
| Location | Text / Map picker |
| Latitude | Number |
| Longitude | Number |
| Geofence Radius (m) | Number |
| Status | Toggle: Active/Inactive |

**Behaviors:**
- Sites define the geofence boundaries for attendance punch validation
- Punch exceptions ("Outside geofence") reference the site's coordinates and radius
- Sites populate the "Deployed at Site" dropdown in Machinery → Asset Register
- Sites populate the "All sites" filter in Attendance
- Full CRUD with search

---

### CROSS-MODULE BEHAVIORS

- Projects appear in Employee assignment dropdowns and Machinery site deployment
- Project Portfolio count and contract value shown on Dashboard → Active Projects card
- Inventory Stock is filtered by project store (each project has its own inventory)
- Purchases, Issues, and Transfers reference project stores from this module
- Machinery → Asset Register "Site" column references Sites from this module
- Attendance geofencing uses Site latitude, longitude, and geofence radius
- All data persists in localStorage
- Toast notifications on every create / edit / delete action
- Confirmation dialogs before destructive actions
