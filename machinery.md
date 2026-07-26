## MACHINERY MODULE

---

### SIDEBAR STRUCTURE

```
Machinery
  ├── Asset Register
  ├── Logbook
  ├── Fuel
  ├── Maintenance
  ├── Hire Bills
  ├── Equipment Categories
  ├── Equipment Doc Types
  └── Hire Rates
```

---

### ASSET REGISTER (`/machinery`)

**Layout:**
- Page title "Asset Register"
- Top-right: **"+ New equipment"** button (primary)
- Search bar: "Search code / name..."
- Filters: All classes | All categories | All ownership | All statuses | All sites

**Asset Register table columns:**
| Column | Description |
|---|---|
| Code | Machine code (e.g. ACP-001, BHL-001, DG-003) |
| Machine | Machine name/model (e.g. Atlas Copco XAS 186) |
| Class | Equipment / Tool / Plant / Vehicle |
| Category | e.g. Air Compressor, Backhoe Loader, Bulldozer, Car |
| Ownership | Owned / Hired |
| Status | Active / Inactive / Under Maintenance |
| Site | Assigned project site (e.g. NH-11 Widening, NH-48 O&M) |
| Reading | Current meter reading (e.g. 1,981.3 hrs, 38,194 km) |
| Utilization | Progress bar with percentage (e.g. 93.9%, 86.7%) |
| Flags | Alert count badges (red numbered circles) |

**Pre-populated mock data (sample):**
| Code | Machine | Class | Category | Ownership | Status | Site | Reading | Utilization |
|---|---|---|---|---|---|---|---|---|
| ACP-001 | Atlas Copco XAS 186 | Equipment | Air Compressor | Owned | Active | NH-11 Widening | 1,981.3 hrs | 93.9% |
| ACP-002 | Atlas Copco XAS 186 | Equipment | Air Compressor | Owned | Active | NH-11 Widening | 2,841.3 hrs | 81.4% |
| BHL-001 | JCB 3DX Backhoe Loader | Plant | Backhoe Loader | Hired | Active | NH-48 O&M | 3,120 hrs | 86.7% |
| BHL-002 | CASE 770EX | Plant | Backhoe Loader | Owned | Active | NH-48 O&M | 3,499.8 hrs | 65% |
| BDZ-001 | BEML BD80 | Plant | Bulldozer | Owned | Active | NH-11 Widening | 5,959.7 hrs | 79.2% |
| BTK-001 | Ashok Leyland 2518 (20 KL) | Vehicle | Bitumen Tanker | Owned | Active | NH-11 Widening | 38,194 km | 98.9% |
| CAR-001 | Toyota Innova Crysta | Vehicle | Car | Owned | Active | NH-48 O&M | 75,771 km | 97.8% |
| AMB-001 | Force Traveller Ambulance | Vehicle | Ambulance | Owned | Active | NH-48 O&M | 46,763 km | 94.8% |
| CMX-001 | Safari 10/7 CFT | Equipment | Concrete Mixer | Owned | Active | NH-48 O&M | 2,010.9 hrs | 80.4% |
| MCY-001 | Hero Splendor Plus | Vehicle | Motorcycle | — | Active | — | — | — |

**Utilization column:**
- Shows a horizontal progress bar (teal/green) with percentage
- Higher percentages = more utilization of the asset

**Flags column:**
- Red numbered badge indicating alerts (e.g. service due, document expiring)
- No badge = no pending alerts

**New Equipment modal:**
| Field | Type | Notes |
|---|---|---|
| Code | Text | Auto-generated if blank, editable |
| Name | Text | e.g. "Grader / Paver / Tipper..." |
| Category | Dropdown | Select from Equipment Categories |
| Ownership | Dropdown | Owned / Hired |
| Power Source | Dropdown | Diesel / Electric / Manual... |
| Status | Dropdown | Active / Inactive |
| Deployed at Site | Dropdown | Select from project sites |
| Make | Text | Manufacturer name |
| Model | Text | Model number |
| Mfg. Year | Text (YYYY) | Year of manufacture |
| Registration No. | Text | Vehicle registration |
| Chassis No. | Text | Chassis number |
| Engine No. | Text | Engine number |
| Current reading | Number | e.g. 1234.5 (hrs or km) |
| Fuel benchmark override | Text | Blank = category benchmark |
| Purchase Date | Date picker | Date of purchase |
| Purchase Cost (₹) | Number | Purchase cost |
| Depreciation Method | Dropdown | WDV / SLM |
| Depreciation Rate % | Number | Annual depreciation rate |

**Footer:** Cancel | **"Create equipment"** (primary)

**On submit:** New row in Asset Register, toast "Equipment added successfully"

---

### LOGBOOK (`/machinery/logbook`)

**Layout:**
- Page title "Logbook"
- Daily machine usage log entries
- Filters: Date | Site | Machine

**Logbook table columns:**
| Column | Description |
|---|---|
| Date | Entry date |
| Machine | Machine code + name |
| Site | Project site |
| Operator | Driver/operator name |
| Opening Reading | Start-of-day reading |
| Closing Reading | End-of-day reading |
| Total Hours/Km | Closing − Opening |
| Fuel | Fuel consumed (litres) |
| Remarks | Notes |
| Actions | Edit / Delete |

**Behaviors:**
- Total Hours/Km auto-calculates from Opening − Closing readings
- Logbook entries update the machine's current Reading in the Asset Register
- Full CRUD with search and filter

---

### FUEL (`/machinery/fuel`)

**Layout:**
- Page title "Fuel"
- Fuel fill-up records for machinery and vehicles
- Filters: Date range | Site | Machine

**Fuel table columns:**
| Column | Description |
|---|---|
| Date | Fill-up date |
| Machine | Machine code + name |
| Site | Project site |
| Quantity (L) | Litres filled |
| Rate (₹/L) | Per litre rate |
| Amount (₹) | Quantity × Rate |
| Reading | Odometer/hour meter at fill |
| Vendor | Fuel supplier |
| Actions | Edit / Delete |

**Summary totals (top or bottom):**
- Total Fuel (L)
- Total Cost (₹)
- Average Consumption (L/hr or km/L)

**Fuel variance alerts:**
- If actual consumption exceeds the category fuel benchmark by more than the variance threshold (default 15%), a red alert flag is raised on the machine in the Asset Register

**Behaviors:**
- Fuel entries update the Dashboard alerts when variance thresholds are breached
- Full CRUD with filters and date range
- Data feeds into Machinery Reports

---

### MAINTENANCE (`/machinery/maintenance`)

**Layout:**
- Page title "Maintenance"
- Two sections: **Due Services** (top) | **Jobs** (below)
- Top-right: **"+ New schedule"** | **"+ New job"** buttons

**Due Services section:**
| Column | Description |
|---|---|
| Machine | Machine code + name |
| Service | Service type (e.g. Engine oil & filter change) |
| Every | Service interval (e.g. 250 hrs) |
| Remaining | Units remaining until due |
| Last done | Date/reading of last service |

- Shows "Nothing due — all assets are on schedule." when no services are pending

**Jobs section:**
| Column | Description |
|---|---|
| Machine | Machine code + name |
| Opened | Date job was opened |
| Type | Breakdown / Scheduled |
| Problem | Problem description code (e.g. BRK/BBM-001/01) |
| Total cost | Cost of repair (₹) |
| Status | Open / In Progress / Closed |

**Pre-populated jobs (sample):**
| Machine | Type | Problem | Status |
|---|---|---|---|
| BBM-001 Shakti SBB-42 | Breakdown | BRK/BBM-001/01 | Open |
| WLD-001 Ador Champ 400 | Breakdown | BRK/WLD-001/01 | Open |
| ALV-002 Sokkia B40A | Breakdown | BRK/ALV-002/01 | Open |
| WHL-002 Caterpillar 950 GC | Breakdown | BRK/WHL-002/01 | Open |
| EXC-001 Tata Hitachi EX 210LC | Breakdown | BRK/EXC-001/01 | Open |

**New Maintenance Job modal:**
| Field | Type |
|---|---|
| Machine | Dropdown (select machine) |
| Job Type | Dropdown: Breakdown / Scheduled |
| Linked Service (optional) | Dropdown: Maintenance schedule |
| Reading at Service | Number |
| Problem | Textarea |

**Footer:** Cancel | **"Open job"** (primary)

**New Schedule modal:**
- Fields: Machine | Service name | Interval (hrs/km) | Last done reading | Last done date

**Behaviors:**
- Due services auto-calculate from machine reading vs service intervals
- Opening a job changes machine status to "Under Maintenance" in Asset Register
- Closing a job resets machine status to "Active"
- Service completion updates "Last done" and resets the remaining counter

---

### HIRE BILLS (`/machinery/hire-bills`)

**Layout:**
- Page title "Hire Bills"
- Top-right: **"+ New bill"** button
- Filters: All statuses | All vendors

**Hire Bills table columns:**
| Column | Description |
|---|---|
| Bill | Bill number (e.g. JB/26-27/DG-001) |
| Vendor | Vendor/supplier name |
| Machine | Machine code + name |
| Period | Billing period (e.g. 01 Jun 2026 → 30 Jun 2026) |
| Billed vs logbook | Billed hours vs logbook hours + variance (e.g. 149.74 / 136.39 +13.35) |
| Amount | Bill amount (₹) |
| TDS | TDS deduction (₹) |
| Net payable | Amount after TDS |
| Status | Pending Verification / Verified / Paid |
| Action | Verify / Mark paid |

**Pre-populated mock bills (sample):**
| Bill | Vendor | Machine | Period | Billed vs Logbook | Amount | Status |
|---|---|---|---|---|---|---|
| JB/26-27/DG-001 | Jai Bhavani Earthmovers | DG-001 Kirloskar 40 kVA | 01 Jun – 30 Jun 2026 | 149.74 / 136.39 +13.35 | ₹1,70,345.72 | Pending Verification |
| JB/26-27/BHL-001 | Jai Bhavani Earthmovers | BHL-001 JCB 3DX Super | 01 Jun – 30 Jun 2026 | 271.16 / 249.71 +21.45 | ₹3,05,608.16 | Pending Verification |
| JB/26-27/019 | Jai Bhavani Earthmovers | BHL-001 JCB 3DX Backhoe Loader | 01 Jul – 31 Jul 2026 | 59 / 59 | ₹1,90,000.00 | Verified |

**Verification flow:**
1. Click "Verify" → compares billed hours against logbook data
2. If variance is within threshold → mark as Verified
3. Once Verified → "Mark paid" action becomes available
4. After payment → Status changes to Paid, TDS and Net payable fields populate

**Behaviors:**
- Billed vs logbook auto-compares vendor bill hours with actual logbook entries
- Variance highlighted (positive = vendor billed more than logbook)
- TDS calculated based on vendor TDS % from Partners → Vendors
- Full CRUD with status filters

---

### EQUIPMENT CATEGORIES (`/machinery/settings/categories`)

**Layout:**
- Page title "Equipment Categories"
- Top-right: **"+ New category"** button
- Top: Fuel variance alert threshold setting (default: 15%)

**Fuel Variance Alert Threshold:**
- Label: "Adverse % vs Benchmark That Raises an Alert"
- Input field: 15 (default)
- Save button

**Categories table columns:**
| Column | Description |
|---|---|
| Category | Category name |
| Class | Plant / Tool / Equipment / Vehicle |
| Meter | Unit of measurement (hrs / km) |
| Fuel benchmark | Expected fuel consumption (e.g. 12 L/hr) |
| Sort order | Display order |
| Action | Edit |

**Pre-populated categories:**
| Category | Class | Meter | Fuel Benchmark | Sort |
|---|---|---|---|---|
| Excavator | Plant | hrs | 12 L/hr | 10 |
| Backhoe Loader | Plant | hrs | 6.5 L/hr | 20 |
| Bulldozer | Plant | hrs | 18 L/hr | 30 |
| Wheel Loader | Plant | hrs | 9 L/hr | 40 |
| Motor Grader | Plant | hrs | 10 L/hr | 50 |
| Roller | Plant | hrs | 5 L/hr | 60 |
| Tandem Roller | Plant | hrs | 4 L/hr | 70 |
| Pneumatic Tyred Roller | Plant | hrs | 6 L/hr | 80 |
| Paver Finisher | Plant | hrs | 14 L/hr | 90 |
| Kerb Casting Machine | Plant | hrs | 5.5 L/hr | 100 |
| Chip Spreader | Plant | hrs | 6 L/hr | 110 |
| Bitumen Sprayer | Plant | hrs | 7 L/hr | 120 |
| Concrete Pump | Plant | hrs | 12 L/hr | 130 |
| Batching Plant | Plant | hrs | 25 L/hr | 140 |
| Wet Mix Macadam Plant | Plant | hrs | 30 L/hr | 150 |
| Hot Mix Plant | Plant | hrs | 45 L/hr | 160 |
| Stone Crusher | Plant | hrs | 35 L/hr | 170 |

**Behaviors:**
- Fuel benchmark is used to calculate fuel variance alerts for machines in this category
- Categories populate the Category dropdown in the Asset Register
- Sort order determines display order in dropdowns and the Asset Register

---

### EQUIPMENT DOC TYPES (`/machinery/settings/document-types`)

**Layout:**
- Page title "Equipment Doc Types"
- Top-right: **"+ New document type"** button

**Document Types table columns:**
| Column | Description |
|---|---|
| Document type | Name + code (e.g. Registration Certificate / RC) |
| Flags | Data type required (Number, ExpiryNumber, Expiry) |
| Default remind | Reminder days before expiry (e.g. 30 days before) |
| Sort | Display order |
| Action | Edit |

**Pre-populated document types:**
| Document Type | Code | Flags | Default Remind | Sort |
|---|---|---|---|---|
| Registration Certificate | RC | Number | 0 days before | 10 |
| Insurance Policy | INSURANCE | ExpiryNumber | 30 days before | 20 |
| PUC / Pollution Certificate | PUC_POLLUTION | ExpiryNumber | 15 days before | 30 |
| Fitness Certificate | FITNESS | ExpiryNumber | 30 days before | 40 |
| Permit | PERMIT | ExpiryNumber | 30 days before | 50 |
| Road Tax Receipt | ROAD_TAX | Expiry | 30 days before | 60 |
| Loan / Hypothecation Document | LOAN_DOCUMENT | ExpiryNumber | 30 days before | 70 |
| Calibration Certificate | CALIBRATION | ExpiryNumber | 30 days before | 80 |
| Warranty Card | WARRANTY | ExpiryNumber | 15 days before | 90 |
| Other Document | OTHER | — | 0 days before | 100 |

**New Document Type modal:**
| Field | Type |
|---|---|
| Code | Text (e.g. INSURANCE) |
| Name | Text (e.g. Insurance policy) |
| Default Remind Days | Number (e.g. 15) |
| Sort Order | Number |
| Has Expiry Date | Toggle (on/off) |
| Needs Document Number | Toggle (on/off) |
| Active | Toggle (on/off) |

**Footer:** Cancel | **"Create type"** (primary)

**Behaviors:**
- Document types define what documents can be attached to each machine
- Expiry-based document types generate Dashboard alerts when nearing expiry
- Default remind days controls how far in advance the alert appears

---

### HIRE RATES (`/machinery/settings/rates`)

**Layout:**
- Page title "Hire Rates"
- Top-right: **"+ New rate"** button

**Hire Rates table columns:**
| Column | Description |
|---|---|
| Applies to | Category name (e.g. "Category Road Marking Machine") |
| Rate / unit | Hourly/km rate in ₹ |
| Effective from | Date the rate takes effect |
| Effective to | Current (ongoing) or end date |

**Pre-populated hire rates (sample):**
| Applies to | Rate / unit | Effective from | Effective to |
|---|---|---|---|
| Category Road Marking Machine | ₹1,400.00 | 01 Apr 2026 | Current |
| Category Tower Light Mast | ₹220.00 | 01 Apr 2026 | Current |
| Category Plate Compactor | ₹200.00 | 01 Apr 2026 | Current |
| Category Welding Machine | ₹250.00 | 01 Apr 2026 | Current |
| Category Dewatering Pump | ₹180.00 | 01 Apr 2026 | Current |
| Category Water Pump | ₹150.00 | 01 Apr 2026 | Current |
| Category Concrete Mixer | ₹350.00 | 01 Apr 2026 | Current |
| Category Air Compressor | ₹600.00 | 01 Apr 2026 | Current |
| Category Diesel Generator | ₹450.00 | 01 Apr 2026 | Current |
| Category Motorcycle | ₹8.00 | 01 Apr 2026 | Current |
| Category Crane | ₹1,650.00 | 01 Apr 2026 | Current |
| Category Hot Mix Plant | ₹6,500.00 | 01 Apr 2026 | Current |
| Category Wet Mix Macadam Plant | ₹4,200.00 | 01 Apr 2026 | Current |
| Category Paver Finisher | ₹3,800.00 | 01 Apr 2026 | Current |
| Category Chip Spreader | ₹1,100.00 | 01 Apr 2026 | Current |
| Category Bitumen Sprayer | ₹1,200.00 | 01 Apr 2026 | Current |

**Behaviors:**
- Hire rates are used to auto-calculate Hire Bills amounts based on logbook hours
- New rate with same category creates a rate history; previous rate gets an end date
- "Current" means the rate is still active (no end date)

---

### EQUIPMENT DOCUMENT TRACKING (`Asset Register → Documents column`)

**Purpose:**
Per-machine document management for RC, Insurance, PUC, Fitness with expiry dates and auto-alerts. Construction companies face heavy fines for expired vehicle documents.

**Documents column in Asset Register:**
- Each asset row shows a clickable badge:
  - 🟢 Green badge `"N valid"` — all documents have valid expiry or no expiry
  - 🟡 Yellow badge `"N expiring"` — at least one document expires within 30 days
  - 🔴 Red badge `"N expired"` — at least one document is past expiry date
  - Gray `—` — no documents attached yet

**Clicking the badge** opens a modal showing all documents for that machine:

| Column | Description |
|---|---|
| Document | Document type name (from Equipment Doc Types) |
| Number | Document/policy number |
| Expiry | Expiry date |
| Status | Valid / Expiring Soon / EXPIRED / No Expiry |
| Actions | Edit / Delete |

**Actions:**
- **Add Document** button → modal with: Document Type (dropdown from Equipment Doc Types), Document Number, Expiry Date
- **Edit** → pre-filled modal with same fields
- **Delete** → confirmation dialog

**Expiry Alerts Banner:**
Below the Asset Register table, a red alert box appears if any documents are expired or expiring within 30 days:

| Column | Description |
|---|---|
| Machine | Machine ID + name |
| Document | Document type name |
| Expiry | Expiry date |
| Status | EXPIRED (red) / Expiring Soon (yellow) |

**Pre-populated mock data:**
- BTK-001 (Bitumen Tanker): RC, Insurance (exp 15 Aug 2026), PUC (exp 01 Aug 2026), Fitness (exp 31 Mar 2027)
- CAR-001 (Innova Crysta): RC, Insurance (exp 30 Sep 2026), PUC (exp 30 Jul 2026), Fitness (exp 31 Dec 2026)

**Behaviors:**
- Documents stored per-asset as `documents[]` array with `{ type, number, expiry }`
- 30-day lookahead for "Expiring Soon" threshold
- Expired/expiring documents contribute to the Flags count in Asset Register
- Equipment Doc Types master defines which document types are available

---

### CROSS-MODULE BEHAVIORS

- Asset Register readings update from Logbook entries
- Fuel entries compared against Equipment Category benchmarks for variance alerts
- Maintenance due services calculated from Asset Register readings vs service intervals
- Hire Bills auto-calculated from Logbook hours × Hire Rates
- Equipment Doc Types with expiry dates generate Dashboard → Alerts & Reminders
- **Equipment Document Tracking** — per-machine RC/Insurance/PUC/Fitness with expiry alerts in Asset Register
- TDS on Hire Bills uses vendor TDS % from Partners → Vendors
- All data persists in localStorage
- Toast notifications on every create / edit / delete / verify / pay action
- Confirmation dialogs before all destructive actions
