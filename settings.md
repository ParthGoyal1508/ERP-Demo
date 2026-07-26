## SETTINGS MODULE

---

### SIDEBAR STRUCTURE

```
Settings
  ├── Companies
  ├── Users
  └── Roles & Permissions
```

---

### COMPANIES (`/settings/companies`)

**Layout:**
- Page title "Companies"
- Top-right: **"+ New company"** button
- List/table of all companies in the group

**Companies table columns:**
| Column | Description |
|---|---|
| Company Name | Legal entity name |
| Short Code | Abbreviation used in employee codes |
| Address | Registered office address |
| GSTIN | GST identification number |
| PAN | Company PAN |
| PF Establishment Code | EPFO establishment code |
| ESIC Code | ESIC establishment code |
| Status | Active / Inactive |
| Actions | Edit / Delete |

**Pre-populated companies:**
| Company Name | Status |
|---|---|
| Demo Constructions Pvt Ltd | Active |
| Demo Infra Projects Pvt Ltd | Active |

**New/Edit Company modal:**

*Basic Info:*
| Field | Type |
|---|---|
| Company Name | Text |
| Short Code | Text (e.g. DEMO) |
| Logo | File upload (mocked) |
| Status | Toggle: Active/Inactive |

*Registration Details:*
| Field | Type |
|---|---|
| GSTIN | Text |
| PAN | Text |
| CIN | Text (Corporate Identification Number) |
| TAN | Text (Tax Deduction Account Number) |

*Address:*
| Field | Type |
|---|---|
| Address | Textarea |
| City | Text |
| State | Dropdown |
| PIN Code | Text |

*Statutory:*
| Field | Type |
|---|---|
| PF Establishment Code | Text |
| ESIC Code | Text |
| Professional Tax Registration | Text |
| BOCW Registration | Text |

*Payroll Settings:*
| Field | Type |
|---|---|
| Pay Cycle | Dropdown: Monthly |
| Payroll Lock Day | Number (day of month after which punching is locked) |
| PF Contribution Rate (Employer) | Percentage |
| ESI Contribution Rate (Employer) | Percentage |
| Gratuity Rate | Percentage |
| Bonus Rate | Percentage |

**Behaviors:**
- Companies populate the "All companies" filter dropdown across modules (Employees, Stock, Purchases etc.)
- Company-level PF/ESIC codes used in Challans generation
- Payroll settings (lock day, contribution rates) control payroll calculation behavior
- Employee Code Series tied to company short code (e.g. DEMO-0001)
- Group Dashboard aggregates data per company from this list

---

### USERS (`/settings/users`)

**Layout:**
- Page title "User Management"
- Top-right: **"+ Add User"** button
- Table of all system users

**Users table columns:**
| Column | Description |
|---|---|
| Name | User display name |
| Email | Login email address |
| Role | Assigned role (from Roles module) |
| Status | Active / Inactive |
| Last Login | Date and time of last login |
| Actions | Edit / Delete |

**Pre-populated users:**
| Name | Email | Role | Status | Last Login |
|---|---|---|---|---|
| Admin | admin@buildcore.com | Super Admin | Active | 2026-07-24 09:15 AM |
| Suresh Sharma | suresh@demo.com | Project Manager | Active | 2026-07-23 08:30 AM |
| Meena Verma | meena@demo.com | Accountant | Active | 2026-07-24 08:45 AM |
| Rajendra Singh | rajendra@demo.com | Site Engineer | Active | 2026-07-22 07:00 AM |
| Mukesh Saini | mukesh@demo.com | Store Keeper | Active | 2026-07-24 09:00 AM |
| Vikram Meena | vikram@demo.com | Viewer | Inactive | 2026-06-15 10:00 AM |

**Add/Edit User modal:**
| Field | Type |
|---|---|
| Name | Text |
| Email | Email |
| Role | Dropdown (from Roles module) |
| Status | Dropdown: Active / Inactive |

**Behaviors:**
- Users are assigned exactly one role
- Role determines module access permissions
- Deleting a user requires confirmation dialog
- Toast notification on all CRUD actions

---

### ROLES & PERMISSIONS (`/settings/roles`)

**Layout:**
- Page title "Roles & Permissions"
- Top-right: **"+ Add Role"** button
- Table of all roles with their permissions

**Roles table columns:**
| Column | Description |
|---|---|
| Role Name | Name of the role |
| Permissions | Comma-separated list of module permissions |
| Users | Count of users assigned this role |
| Actions | Edit / Delete |

**Pre-populated roles:**
| Role Name | Permissions | Users |
|---|---|---|
| Super Admin | All Modules, User Management, Company Settings, Data Export, Data Delete | 1 |
| Project Manager | Dashboard, Employees, Attendance, Projects, Machinery, Reports | 1 |
| Accountant | Dashboard, Payroll, Challans, Loans, Inventory, Reports | 1 |
| Site Engineer | Dashboard, Attendance, Machinery, Logbook, Fuel, Inventory | 1 |
| Store Keeper | Dashboard, Inventory, Purchases, Issues, Transfers | 1 |
| Viewer | Dashboard, Reports | 1 |

**Add/Edit Role modal:**
| Field | Type |
|---|---|
| Role Name | Text |
| Permissions | Comma-separated text input |

**Behaviors:**
- Roles define which modules/pages a user can access
- Deleting a role requires confirmation dialog
- Roles populate the dropdown in the User form
- Toast notification on all CRUD actions

---

### EMPLOYEE SETUP (accessed via Employees → Setup button)

The Employee Setup modal is accessed from the Employees page **Setup** button and manages reference data used across the HR module.

**Tabs:**
- **Code Series** — Employee code prefix patterns per company
- **Departments** — Department master list
- **Designations** — Job title master list
- **Document Types** — Employee document types with mandatory flags
- **Shifts** — Work shift definitions

**Document Types tab columns:**
| Column | Description |
|---|---|
| Document type | Name + code (e.g. Aadhaar Card / AADHAAR) |
| Flags | MandatoryNumber, Mandatory, Optional |
| Sort | Display order |
| Action | Edit |

**Pre-populated document types:**
| Document Type | Code | Flags | Sort |
|---|---|---|---|
| Aadhaar Card | AADHAAR | MandatoryNumber | 10 |
| PAN Card | PAN | Number | 20 |
| Bank Proof (passbook/cancelled cheque) | BANK_PROOF | Mandatory | 30 |
| Photograph | PHOTO | Mandatory | 40 |
| Driving Licence | DRIVING_LICENCE | ExpiryNumber | 50 |
| 10th Marksheet | MARKSHEET_10 | — | 60 |
| 12th Marksheet | MARKSHEET_12 | — | 70 |
| Degree Certificate | DEGREE | — | 80 |
| Experience Letter | EXPERIENCE_LETTER | — | 90 |
| Medical Fitness Certificate | MEDICAL_FITNESS | Expiry | 100 |
| Police Verification | POLICE_VERIFICATION | — | 110 |
| Offer Letter | OFFER_LETTER | — | 120 |
| Appointment Letter | APPOINTMENT_LETTER | — | 130 |
| Signed Joining Letter | JOINING_LETTER_SIGNED | — | 140 |
| PF Form 11 | PF_FORM_11 | — | 150 |
| PF Form 2 (Nomination) | PF_FORM_2_NOMINATION | — | 160 |
| ESIC Family Declaration | ESIC_FAMILY_DECLARATION | — | 170 |

**New Document Type modal:**
| Field | Type |
|---|---|
| Code | Text |
| Name | Text |
| Mandatory (Gates Attendance) | Toggle — if on, employee cannot punch without this doc |
| Has Expiry Date | Toggle |
| Needs Document Number | Toggle |
| Sort Order | Number |

**Footer:** Cancel | **"Create type"** (primary)

**Edit behavior:**
- Clicking the Edit (pencil) icon on any document type row opens the same "New document type" modal pre-filled with that row's data
- Code field becomes read-only during edit
- Button text changes to "Update type"
- Toggle combinations determine Flags column value:
  - Mandatory ON + Needs Document Number ON → "MandatoryNumber"
  - Has Expiry Date ON + Needs Document Number ON → "ExpiryNumber"
  - Has Expiry Date ON only → "Expiry"
  - Needs Document Number ON only → "Number"
  - Mandatory ON only → "Mandatory"

**Behaviors:**
- Mandatory documents affect the employee Documents progress bar (e.g. 3/3 docs)
- Document types with "Gates Attendance" flag block punching until uploaded
- Employee progress bar in the Employees list counts only mandatory documents

---

### CROSS-MODULE BEHAVIORS

- Company list drives the multi-company architecture across the entire ERP
- All modules filter by company when "All companies" dropdown is used
- Payroll settings (PF/ESIC rates, lock day) control payroll calculations and punch locking
- Employee Setup document types determine the Documents progress column in Employees list
- Department and Designation masters populate dropdowns in Add Employee form
- All data persists in localStorage
- Toast notifications on every create / edit / delete action
