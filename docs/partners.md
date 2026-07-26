## PARTNERS MODULE

---

### SIDEBAR STRUCTURE

```
Partners
  ├── Vendors
  ├── Vendor Categories
  ├── Contractor Vault
  ├── Monthly Compliance
  ├── RAG Matrix
  └── BOCW Cess
```

---

### VENDORS (`/vendors`)

**Layout:**
- Page title "Vendors"
- Top-right: **"Categories"** button | **"+ New vendor"** button (primary)
- Search bar: "Search name, GSTIN, city or contact..."
- Filters: All types | All categories

**Vendors table columns:**
| Column | Description |
|---|---|
| Vendor | Vendor name + city (below) |
| Deals in | Material categories (e.g. Diesel & Lubricants, Equipment Hire) |
| Contact | Contact person name + phone + WhatsApp indicator |
| Type | Fuel / Hire / Material / Service |
| GSTIN | GST identification number |
| TDS | TDS section and percentage (e.g. 2% (194C)) |
| Active | Active status |
| Action | Edit |

**Pre-populated mock vendors:**
| Vendor | City | Deals in | Type | GSTIN | TDS | Active |
|---|---|---|---|---|---|---|
| Shree Shyam Fuel Station | — | Diesel & Lubricants | Fuel | 08AABC59968F1Z2 | — | Active |
| Jai Bhavani Earthmovers | Kota | Equipment Hire | Hire | 08AAECJ4455H1Z7 | 2% (194C) | Active |
| Bansal Building Materials | — | — | Material | 08AACCB7712M1Z4 | — | Active |
| Maruti Equipment Rentals | Ajmer | Equipment Hire | Hire | 08AADCM7710K1Z9 | 2% (194C) | Active |
| Rajputana Machinery Services | Jaipur | Spare Parts, Tyres & Batteries | Service | 08A4FCR3321L1Z4 | 2% (194C) | Active |

**New Vendor modal:**

*Details section:*
| Field | Type | Notes |
|---|---|---|
| Name | Text | Vendor/company name |
| Type | Dropdown | Material / Fuel / Hire / Service / Subcontractor (searchable) |
| Deals in | Multi-select tags | Bricks & Blocks, Cement, Civil Subcontractor, Diesel & Lubricants, Electrical Supplies etc. |
| GSTIN | Text | GST identification number |
| PAN | Text | PAN number |
| TDS Section | Dropdown | 194C / 194I... |
| TDS % | Number | e.g. 2.00 |
| Active | Toggle | On/Off |

*Address section:*
| Field | Type |
|---|---|
| Address | Textarea |
| City | Text |
| State | Dropdown (Select state) |
| PIN code | Text |

*Contacts section:*
- "No contacts added." + **"+ Add contact"** button
- Each contact: Name | Phone | Email | WhatsApp toggle

**Footer:** Cancel | **"Create vendor"** (primary)

**Categories button** → opens Vendor Categories management (separate modal/page)

**Behaviors:**
- Vendor list populates dropdowns in: Inventory → Purchases, Machinery → Hire Bills, Machinery → Fuel
- TDS % used for auto-calculating TDS on Hire Bills
- Vendor type filters which modules the vendor appears in (Fuel vendors in Fuel entries, Hire vendors in Hire Bills, etc.)
- Full CRUD with search and type/category filters

---

### VENDOR CATEGORIES (`/vendors/categories`)

**Layout:**
- Page title "Vendor Categories"
- Top-right: **"+ Add Category"** button (primary)

**Purpose:**
- Manage vendor type classifications (Material, Fuel, Hire, Service, Transport, Subcontractor)
- Categories populate the "Type" dropdown when adding/editing vendors
- "Deals in" tags help procurement teams quickly identify vendor capabilities

**Table columns:**
| Column | Description |
|---|---|
| # | Row number |
| Category | Category name (e.g. Material, Fuel, Hire) |
| Description | Brief description of the category |
| Vendors | Count of vendors assigned to this category |
| Actions | Edit / Delete |

**Pre-populated categories:**
| Category | Description |
|---|---|
| Material | Building materials, cement, steel, aggregates |
| Fuel | Diesel, petrol, lubricants |
| Hire | Equipment and machinery on hire |
| Service | Repair, maintenance, spare parts |
| Transport | Material transport and logistics |
| Subcontractor | Civil/electrical/mechanical subcontractors |

**Add/Edit Category modal:**
| Field | Type |
|---|---|
| Name | Text (required) |
| Description | Text |

**Behaviors:**
- Full CRUD for vendor categories
- Vendor count column shows how many vendors are in each category
- Deleting a category does not affect existing vendors already assigned to it
- Categories feed the Type dropdown in Vendor add/edit forms

---

### CONTRACTOR VAULT (`/contractors`)

**Layout:**
- Page title "Contractor Vault"
- Repository for labour contractor compliance documents

**Purpose:**
- Stores and tracks statutory compliance documents for all labour contractors
- Ensures contractors have valid licenses, insurance, PF/ESIC registrations

**Contractor Vault table columns:**
| Column | Description |
|---|---|
| Contractor | Contractor company name |
| Contact | Contact person |
| License No. | Labour contractor license |
| PF Registration | PF establishment code |
| ESIC Registration | ESIC code |
| Insurance | Insurance policy status |
| BOCW Registration | BOCW registration number |
| Compliance Status | Compliant / Non-compliant / Partially compliant |
| Actions | View / Edit |

**Contractor detail view:**
- Document checklist with upload status for each required document
- Expiry date tracking for licenses and registrations
- Monthly compliance submission status

---

### RAG MATRIX (`/contractors/rag`)

**Layout:**
- Page title "RAG Matrix"
- Top-left: **"Group Dashboard"** button (navigates back to Group Dashboard)
- Financial Year selector: FY 2026-27

**RAG Matrix table:**
- Rows: One per contractor (e.g. "Shree Balaji Labour Co")
- Columns: Monthly columns for the financial year (Apr 2026 → Mar 2027)
- Cells: Colored status dots

**Status dot legend:**
| Color | Meaning |
|---|---|
| 🟢 Green | Verified — documents submitted and verified |
| 🟡 Yellow/Amber | Submitted / pending — within grace period |
| 🔴 Red | Rejected or missing — past the 20th grace deadline |
| ⚫ Gray (no dot) | No filing yet (within grace period) |

**Pre-populated mock data:**
| Contractor | Apr 2026 | May 2026 | Jun 2026 | Jul 2026 | Aug–Mar |
|---|---|---|---|---|---|
| Shree Balaji Labour Co | 🔴 Red | 🟢 Green | 🔴 Red | 🟡 Yellow | — |

**Behaviors:**
- RAG Matrix provides at-a-glance compliance visibility for all contractors across the year
- Clicking a dot opens the detail of what was submitted/missing for that month
- Colors auto-derive from Contractor Vault document submissions and verification dates
- FY selector switches the year view

---

### CONTRACTOR MONTHLY COMPLIANCE (`/contractors/compliance`)

**Layout:**
- Page title "Monthly Compliance Submissions"
- Top-right: **"+ Record Submission"** button (primary)
- Filters: Contractor dropdown | Status dropdown (Verified / Partial / Missing) | Month picker (input type="month")

**Purpose:**
- Record monthly PF and ESIC challan submissions by labour contractors
- Track payment amounts, challan numbers, and dates
- Verify submissions and auto-update the RAG Matrix status for each contractor/month

**Table columns:**
| Column | Description |
|---|---|
| Contractor | Contractor name |
| Month | Month/Year (e.g. May 2026) |
| PF Challan | PF challan number (red "Not submitted" if blank) |
| PF Amount | PF amount (₹) |
| PF Date | PF payment date |
| ESIC Challan | ESIC challan number (red "Not submitted" if blank) |
| ESIC Amount | ESIC amount (₹) |
| ESIC Date | ESIC payment date |
| Status | Verified (green) / Partial (yellow) / Missing (red) / Submitted (yellow) |
| Actions | Edit / Verify |

**Pre-populated mock data:**
| Contractor | Month | PF Challan | PF Amt | ESIC Challan | ESIC Amt | Status |
|---|---|---|---|---|---|---|
| Shree Balaji Labour Co | May 2026 | PF-2026-05-BLJ | ₹42,000 | ESIC-2026-05-BLJ | ₹18,500 | Verified |
| Shree Balaji Labour Co | Jun 2026 | — | — | — | — | Missing |
| Rajasthan Labour Services | May 2026 | PF-2026-05-RLS | ₹65,000 | ESIC-2026-05-RLS | ₹28,000 | Verified |
| Rajasthan Labour Services | Jun 2026 | PF-2026-06-RLS | ₹63,000 | ESIC-2026-06-RLS | ₹27,000 | Verified |
| Shree Balaji Labour Co | Jul 2026 | PF-2026-07-BLJ | ₹44,000 | — | — | Partial |

**Record Submission modal:**
| Field | Type |
|---|---|
| Contractor | Dropdown (from Contractor Vault) |
| Month | Dropdown (Apr 2026 → Mar 2027) |
| PF Challan No. | Text |
| PF Amount (₹) | Number |
| PF Payment Date | Date |
| ESIC Challan No. | Text |
| ESIC Amount (₹) | Number |
| ESIC Payment Date | Date |

**Status auto-derivation:**
- Both PF and ESIC submitted → "Submitted"
- Only one submitted → "Partial"
- Neither submitted → "Missing"
- Admin clicks Verify → "Verified"

**RAG Matrix auto-update:**
- When a compliance submission is saved or verified, the RAG Matrix for that contractor + month is automatically updated:
  - Verified → 🟢 Green
  - Submitted / Partial → 🟡 Yellow
  - Missing → 🔴 Red

**Behaviors:**
- Full CRUD with filter by contractor and status
- Verify button only appears for non-verified submissions
- Verification records who verified and when
- RAG Matrix auto-syncs on every save/verify action

---

### BOCW CESS (`/bocw`)

**Layout:**
- Page title "BOCW Cess"
- Building and Other Construction Workers Cess tracking

**Purpose:**
- Track BOCW Cess liability calculations and payments per project
- 1% cess on construction cost as per BOCW Act

**BOCW Cess table columns:**
| Column | Description |
|---|---|
| Project | Project name |
| Contract Value (₹) | Total contract value |
| Cess Rate | 1% (statutory) |
| Cess Liability (₹) | Contract Value × 1% |
| Paid (₹) | Amount already paid |
| Balance (₹) | Remaining liability |
| Last Payment Date | Date of last cess payment |
| Status | Paid / Partial / Pending |
| Actions | Record payment / View history |

**Behaviors:**
- Cess liability auto-calculates as 1% of project contract value
- Payment recording updates the balance
- Status derived from paid vs liability comparison
- Payment history per project viewable

---

### CROSS-MODULE BEHAVIORS

- Vendors populate supplier dropdowns in Inventory (Purchases, Payments) and Machinery (Fuel, Hire Bills)
- **Vendor Categories** populate the "Type" dropdown in Vendor add/edit forms
- Vendor TDS % used for auto-calculating TDS on Hire Bills and Purchase payments
- Contractor Vault compliance status feeds into the RAG Matrix view
- **Monthly Compliance submissions** auto-update RAG Matrix colours (Verified→green, Partial→yellow, Missing→red)
- RAG Matrix provides the Group Dashboard-level compliance overview
- BOCW Cess references project contract values from Projects → Portfolio
- All data persists in localStorage
- Toast notifications on every create / edit / delete action
- Confirmation dialogs before destructive actions
