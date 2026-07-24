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
