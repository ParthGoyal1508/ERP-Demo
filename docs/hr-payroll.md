Looking at the frames already analyzed, here's the detailed Lovable prompt for the HR & Payroll module:

---

## HR & PAYROLL MODULE

---

### SIDEBAR STRUCTURE

```
Attendance and Payroll
  ├── Employees
  ├── Attendance
  ├── Leave Summary
  ├── Payroll Runs
  ├── Challans
  └── Loans
```

---

### EMPLOYEES (`/hr/employees`)

**Layout:**
- Page title "Employees"
- Top-right: **"+ Add employee"** button (primary)
- Filters row: Company dropdown | All statuses | All types | All projects | All documents | **Transfers** button | **Setup** button
- Search bar: "Search name, code, mobile..."

**Employee table columns:**
| Column | Description |
|---|---|
| Code | EMP-0001, DEMO-0001 etc. |
| Name | Full name |
| Department | Civil Engineering, Accounts & Finance etc. |
| Designation | Project Manager, Accountant etc. |
| Mobile | 10-digit number |
| Company | Demo Constructions Pvt Ltd |
| Project | NH-48 O&M etc. |
| Documents | Progress bar showing X/3 docs uploaded |
| Status | Active (green badge) |
| Action | View / Edit / Delete / Transfer icons |

**Pre-populated mock employees:**

| Code | Name | Department | Designation | Mobile | Project |
|---|---|---|---|---|---|
| EMP-0001 | Ramesh Kumar | Accounts & Finance | Accountant | 9999900001 | NH-48 O&M |
| DEMO-0001 | Suresh Sharma | Civil Engineering | Project Manager | 9820000013 | NH-48 O&M |
| DEMO-0002 | Meena Verma | Accounts & Finance | Accountant | 9820000026 | NH-48 O&M |
| DEMO-0003 | Rajendra Singh | Civil Engineering | Senior Site Engineer | 9820000039 | NH-48 O&M |
| DEMO-0004 | Amit Kumar | Civil Engineering | Site Engineer | 9820000052 | NH-48 O&M |
| DEMO-0005 | Vikram Meena | Quality Assurance & Control | Quality Control Engineer | 9820000065 | NH-48 O&M |
| DEMO-0006 | Dinesh Yadav | Site Operations & Maintenance | Site Supervisor | 9820000078 | NH-48 O&M |
| DEMO-0007 | Ramavtar Gurjar | Electrical & Mechanical | Electrician | 9820000091 | NH-48 O&M |
| DEMO-0008 | Kalu Ram | Plant & Machinery | Mechanic / Fitter | 9820000104 | NH-48 O&M |
| DEMO-0009 | Bhanwar Lal | Plant & Machinery | Plant Operator | 9820000117 | NH-48 O&M |
| DEMO-0010 | Mukesh Saini | Stores & Procurement | Store Keeper | 9820000130 | NH-48 O&M |
| DEMO-0011 | Pappu Ram | Site Operations & Maintenance | Mason | 9820000143 | NH-48 O&M |
| DEMO-0012 | Sita Devi | Site Operations & Maintenance | Helper | 9820000156 | NH-48 O&M |
| DEMO-0013 | Gopal Nath | Site Operations & Maintenance | Helper | 9820000169 | NH-48 O&M |
| DEMO-0014 | Kamla Devi | Site Operations & Maintenance | Helper | 9820000182 | NH-48 O&M |
| DEMO-0015 | Bheru Lal | Health, Safety & Environment | Security Guard | 9820000195 | NH-48 O&M |

**Documents column:**
- Shows a colored progress bar: 3/3 docs = full green, 2/3 = yellow, 1/3 = orange, 0/3 = red
- Clicking opens a document status mini-modal

**Add Employee modal/form:**

Fields grouped in sections:

*Basic Info:*
- Employee Code (auto-generated, editable)
- Full Name
- Date of Birth
- Gender (dropdown)
- Photo upload (mocked)

*Employment Details:*
- Company (dropdown)
- Department (dropdown)
- Designation (text)
- Employment Type (dropdown: Full Time / Contract / Daily Wage)
- Date of Joining
- Project (dropdown)

*Contact Info:*
- Mobile
- Alternate Mobile
- Email
- Address

*Salary Info:*
- Basic Salary
- HRA
- Conveyance Allowance
- Site Allowance
- PF applicable (toggle)
- ESIC applicable (toggle)

*Bank Details:*
- Bank Name
- Account Number
- IFSC Code
- UAN Number

**On submit:** New row appears in table, toast "Employee added successfully", documents progress shows 0/3.

**Employee detail page** (clicking employee name or view icon):

Tabs:
- **Overview** — summary card with photo, name, code, designation, department, project, mobile, joining date, status
- **Personal** — DOB, gender, address, emergency contact
- **Employment** — company, type, joining date, project history
- **Salary** — current salary structure breakdown
- **Attendance** — mini monthly calendar with present/absent/leave markers + summary stats
- **Leaves** — leave balance table + leave history
- **Documents** — list of uploaded docs with status badges
- **Loans** — active loans and EMI history

---

### ATTENDANCE (`/hr/attendance`)

**Layout:**
- Page title "Attendance"
- Top filters: Search name or code | All sites dropdown | Date picker (defaults to today) | ← → navigation arrows
- Top-right buttons: **Exceptions** | **Modifications** | **Holidays**

**Attendance table columns:**
| Column | Description |
|---|---|
| # | Row number |
| Emp Code | DEMO-0001 etc. |
| Employee | Full name |
| Project | Site/project name |
| Department | Department name |
| Designation | Job title |
| In | Check-in time (e.g. 09:00 am) |
| Out | Check-out time (e.g. 06:00 pm) |
| OT | Overtime hours |
| Worked | Total hours (e.g. 9h 00m) |
| Status | Complete (green) / Absent (red) / Half Day (orange) / On Leave (blue) |
| Approval | Approval status icon |
| Actions | Edit / Delete icons |

**Status badges:**
- **Complete** — green
- **Absent** — red
- **Half Day** — orange
- **On Leave** — blue
- **Holiday** — gray

**Pre-populated mock attendance for today's date** with all DEMO employees showing 09:00 am / 06:00 pm / 9h 00m / Complete. A few rows showing Absent in red.

**Edit attendance modal:**
- Fields: Employee (read-only) | Date (read-only) | In Time | Out Time | Status dropdown | Remarks
- Save updates the row immediately

**Exceptions modal** (top-right button):
- Title: "Punch exceptions"
- Month selector (dropdown)
- Table: Exception | Employee | Date | Accuracy | Location | Detail
- Pre-populated rows:
  - Outside geofence | Ramesh Kumar (EMP-0001) | 17 Jul 2026 | ±8m | 26.912400, 75.787300 | "Punch outside the site geofence" (red highlight)
  - Mock location | Ramesh Kumar (EMP-0001) | 17 Jul 2026 | ±8m | 26.912400, 75.787300 | "Mock/fake GPS detected — punch rejected"

**Modifications modal** (top-right button):
- Shows a log of all manual attendance edits
- Columns: Employee | Original In | Original Out | Modified In | Modified Out | Modified By | Date | Reason

**Holidays modal** (top-right button):
- Table of declared holidays for the year
- Columns: Date | Day | Holiday Name | Type (National/State/Optional)
- Add Holiday button

**Behaviors:**
- Date navigation (← →) moves day by day
- All site dropdown filters by project
- Search filters by name or employee code in real time
- Absent employees shown with red badge; no in/out times

---

### LEAVE SUMMARY (`/hr/leave`)

**Layout:**
- Page title "Leave Summary"
- Filters: Employee search | Department | Leave Type | Status | Date range
- Top-right: **"+ New leave request"** button

**Leave balance table** (top section per selected employee or all employees summary):
| Leave Type | Opening | Accrued | Used | Balance |
|---|---|---|---|---|
| Earned Leave | 0 | 6 | 2 | 4 |
| Casual Leave | 0 | 2.33 | 0 | 2.33 |
| Sick Leave | 0 | 2.33 | 0 | 2.33 |
| Leave Without Pay | 0 | 0 | 0 | 0 |

**All leave applications table:**
| Column | Description |
|---|---|
| Employee | Name + code |
| Type | Leave type |
| Dates | From — To |
| Days | Number of days |
| Reason | Reason text |
| Status | Pending / Approved / Rejected / Cancelled badge |
| Remarks | Manager response |
| Action | Approve / Reject / Cancel buttons (based on current status) |

**Approve/Reject flow:**
- Approve button → confirmation dialog → status changes to Approved (green), leave balance deducted
- Reject button → modal asking for rejection remarks → status changes to Rejected (red), remarks saved
- Cancel button → confirmation → status Cancelled

**New Leave Request modal:**
- Fields: Employee (dropdown) | Leave Type | From Date | To Date | Reason
- Auto-calculates days
- On submit: Pending row appears in table

**Pre-populated mock leave applications:**
| Employee | Type | Dates | Days | Reason | Status |
|---|---|---|---|---|---|
| Ramesh Kumar | Leave Without Pay | 02 Nov–03 Nov 2026 | 2 | Unpaid personal leave | Pending |
| Ramesh Kumar | Sick Leave | 12 Oct–13 Oct 2026 | 2 | Fever and rest advised | Pending |
| Ramesh Kumar | Casual Leave | 07 Sep 2026 | 1 | Personal work at bank | Rejected |
| Ramesh Kumar | Earned Leave | 03 Aug–04 Aug 2026 | 2 | Family function in Jaipur | Approved |

---

### PAYROLL RUNS (`/hr/payroll`)

**Layout:**
- Page title "Payroll Runs"
- Month selector (dropdown: July 2026 etc.)
- Top-right: **"Run payroll"** button

**Payroll list table:**
| Column | Description |
|---|---|
| Emp Code | Employee code |
| Employee | Full name |
| Department | Department |
| Days | Payable days |
| Basic | Basic salary |
| Allowances | Total allowances |
| Deductions | Total deductions |
| Net Pay | Final amount |
| Status | Draft / Processed / Paid |
| Actions | View slip / Edit |

**Clicking "View slip"** opens the **Salary Slip modal:**

*Employee info header:*
- Emp code | Name | Designation (top row)
- Department | Site/Project | Date of Joining
- UAN | Bank Name | Bank A/C masked as XXXXXX1234
- Payment Mode: BANK

*Attendance summary bar (4 boxes):*
- Month Days: 31 | Payable Days: 31 | LOP Days: 0 | OT Hours: 0

*Earnings table:*
| Component | Amount |
|---|---|
| Basic | ₹15,000 |
| House Rent Allowance | ₹6,000 |
| Conveyance Allowance | ₹1,600 |
| Site Allowance | ₹2,400 |

*Deductions table:*
| Component | Amount |
|---|---|
| PF (Employee) | ₹1,800 |
| Advance Recovery | ₹5,000 |

*Employer Contributions box (gray bg, informational):*
- Label: "Paid by the company — not deducted from salary. Shown for the full cost-to-company picture."
- PF (Employer): ₹550
- EPS (Employer): ₹1,250
- EDLI: ₹75
- PF Admin Charges: ₹75
- Gratuity Provision: ₹721.50
- Bonus Provision: ₹583.10
- **Total employer cost: ₹3,254.60**

*Summary footer:*
- Gross Earnings: ₹25,000
- Total Deductions: −₹6,800
- **Net Pay: ₹18,200.00** (large bold)
- Amount in words: "Rupees Eighteen Thousand Two Hundred Only"
- Wage note: "PF wages ₹15,000 · EPS wages ₹15,000 · ESIC wages ₹0 · Bonus wages ₹15,000"
- Footer: "Computer-generated payslip — no signature required"

**Print/Download button** → toast "Downloading salary slip..."

**Run Payroll flow:**
- Button opens confirmation: "Run payroll for July 2026 for all active employees?"
- On confirm: all employee rows generated with calculated values, status set to Draft
- "Mark as Processed" bulk action available
- Status badge: Draft (gray) → Processed (blue) → Paid (green)

**Bank Salary Sheet** (button or tab within Payroll):
- Table showing: Employee | Bank | Account No | IFSC | Net Pay
- All employees for the selected month
- Mocked "Export to bank" button → toast "Bank file exported (mocked)"

---

### CHALLANS (`/hr/challans`)

**Layout:**
- Page title "Challans"
- Tabs: **PF Challan** | **ESIC Challan** | **PT Challan**
- Month selector
- Top-right: **"Generate challan"** button

**PF Challan tab:**
| Column | Description |
|---|---|
| Emp Code | Employee code |
| Employee | Name |
| UAN | UAN number |
| PF Wages | Wages on which PF is calculated |
| EPS Wages | Wages for EPS |
| Employee PF (12%) | Employee contribution |
| Employer PF (3.67%) | Employer PF contribution |
| EPS (8.33%) | Employer EPS |
| EDLI | EDLI contribution |
| Admin Charges | PF admin charges |
| Total | Sum of all contributions |

**Summary row** at bottom: Total across all employees

**ESIC Challan tab:**
| Column | Description |
|---|---|
| Emp Code | Employee code |
| Employee | Name |
| ESIC Number | Mock ESIC ID |
| ESIC Wages | Gross wages subject to ESIC |
| Employee ESIC (0.75%) | Employee share |
| Employer ESIC (3.25%) | Employer share |
| Total | Combined contribution |

**Generate Challan button** → shows mock challan summary modal with total amounts and a mocked "Download ECR file" button → toast "ECR file downloaded (mocked)"

---

### LOANS (`/hr/loans`)

**Layout:**
- Page title "Loans"
- Top-right: **"+ New loan"** button
- Search: employee name/code
- Filter: All statuses | All employees

**Loans table:**
| Column | Description |
|---|---|
| Loan ID | LOAN-001 etc. |
| Employee | Name + code |
| Loan Amount | Total sanctioned (₹) |
| EMI | Monthly deduction (₹) |
| Disbursed On | Date |
| Paid | Amount recovered so far |
| Balance | Remaining (₹) |
| Status | Active / Closed / Pending |
| Actions | View / Edit / Delete |

**New Loan modal:**
- Fields: Employee (dropdown) | Loan Amount | EMI per month | Disbursement Date | Reason | Remarks
- On submit: row added, EMI auto-appears as deduction in future payroll runs

**Loan detail modal** (clicking View):
- Header: Employee info + loan summary
- EMI repayment schedule table: Month | EMI | Principal | Interest (if any) | Balance | Status (Paid/Pending)
- Each paid month shows ✓ green

---

### CROSS-MODULE BEHAVIORS

- Attendance data feeds into Payroll: LOP days auto-deduct from payable days
- Approved leaves reflect in attendance as "On Leave" status
- Loan EMIs auto-appear as deductions in Payroll Runs for that employee
- PF and ESIC contributions from Payroll feed into Challans automatically
- Employee added here appears in Attendance, Leave, Payroll, and Challans immediately
- All data persists in localStorage
- Dashboard "Present Today / Absent / On Leave" cards derive from today's Attendance data
- Toast notifications on every create / edit / delete / approve / reject action
- Confirmation dialogs before all destructive actions