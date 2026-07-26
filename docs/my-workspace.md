## MY WORKSPACE MODULE

---

### SIDEBAR STRUCTURE

```
My Workspace
  ├── My Punch
  ├── My Leave
  ├── My Salary Summary
  └── Face Enrolment
```

---

### MY PUNCH (`/hr/punch`)

**Layout:**
- Page title "My Punch"
- Top-left: "Monthly History" label with calendar icon
- Top-right: Month selector (e.g. "July 2026") with ← → navigation + **"Punch In"** button (primary)

**Monthly History table columns:**
| Column | Description |
|---|---|
| Date | Calendar date (01 Jul 2026 etc.) |
| Day | Day of week (Monday, Tuesday etc.) |
| In | Punch-in time |
| Out | Punch-out time |
| OT | Overtime hours |
| Status | Present / Absent / Weekly off / Holiday |

**Status values:**
- **Present** — shown with in/out times populated (e.g. "02:49 am" in, "2" OT)
- **Absent** — no in/out times, gray text
- **Weekly off** — Sundays and designated off days
- **Holiday** — declared holidays

**Punch In modal** (triggered by "Punch In" button):
- Header: "Punch in" with clock icon
- Status badge: "Ready to Punch In" (green)
- Large digital clock: current time (e.g. "06:03 pm")
- Seconds counter
- Date display: "Wednesday, 22 July 2026"
- Three info boxes: IN TIME (—) | OUT TIME (—) | WORKED (00:00:00)
- **"Punch In"** button (green, large)
- Note: "Opens the camera — a photo is recorded with your punch."
- Warning: "User denied Geolocation" (red, if location access denied)
- Info: "This month is locked for payroll — punching is closed." (when payroll is processed)

**Behaviors:**
- Punch In opens device camera for photo capture (mocked)
- Requests geolocation — shows warning if denied
- Month is locked once payroll is processed for that period
- Monthly history auto-populates from attendance data
- ← → arrows navigate between months

---

### MY LEAVE (`/hr/leave`)

**Layout:**
- Page title "My Leave"
- Top-left: Financial Year selector (e.g. "FY 2026-27")
- Top-right: **"Apply leave"** button (primary, pink/red)

**Leave Balance table (top section):**
| Leave Type | Opening | Accrued | Used | Balance |
|---|---|---|---|---|
| Earned Leave | 0 | 6 | 2 | **4** |
| Casual Leave | 0 | 2.33 | 0 | **2.33** |
| Sick Leave | 0 | 2.33 | 0 | **2.33** |
| Leave Without Pay | Unpaid | — | — | — |

**Columns:**
| Column | Description |
|---|---|
| Leave type | Category of leave |
| Opening | Opening balance at start of FY |
| Accrued | Leave earned during FY |
| Used | Leave consumed |
| Balance | Remaining balance (bold) |

**My Applications table (below):**
| Column | Description |
|---|---|
| Type | Leave type |
| Dates | From — To date range |
| Days | Number of days |
| Reason | Employee's reason text |
| Status | Pending / Approved / Rejected |
| Remarks | Manager's response (if any) |
| Action | Cancel button (× Cancel) |

**Pre-populated leave applications:**
| Type | Dates | Days | Reason | Status | Remarks |
|---|---|---|---|---|---|
| Leave Without Pay | 02 Nov – 03 Nov 2026 | 2 days | Unpaid personal leave | Pending | — |
| Sick Leave | 12 Oct – 13 Oct 2026 | 2 days | Fever and rest advised | Pending | — |
| Casual Leave | 07 Sept 2026 | 1 day | Personal work at bank | Rejected | Peak billing week, please reschedule. — hr@demo.local |
| Earned Leave | 03 Aug – 04 Aug 2026 | 2 days | Family function in Jaipur | Approved | Approved, enjoy. — hr@demo.local |

**Apply Leave modal:**
- Fields: Leave Type (dropdown) | From Date | To Date | Reason (textarea)
- Auto-calculates number of days
- Validates against leave balance
- On submit: new Pending row appears, toast "Leave applied successfully"

**Cancel action:**
- Available on Pending and Approved leaves
- Confirmation dialog → status changes to Cancelled
- Balance restored if Approved leave is cancelled

**Behaviors:**
- FY selector filters leave balance and applications to selected financial year
- Leave balances update in real time as leaves are applied/approved/cancelled
- Leave Without Pay has no balance tracking — always available

---

### MY SALARY SUMMARY (`/hr/salary`)

**Layout:**
- Page title "My Salary Summary"
- Employee's own salary slip view (same format as admin Payroll Runs slip)
- Month selector to view past salary slips

**Salary Slip display:**

*Employee info header:*
- Emp code | Name | Designation
- Department | Site/Project | Date of Joining
- UAN | Bank Name | Bank A/C (masked as XXXXXX1234)
- Payment Mode: BANK

*Attendance summary (4 boxes):*
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

**Behaviors:**
- Shows only the logged-in employee's own salary data
- Month selector shows only months where payroll has been processed
- Print/Download button → toast "Downloading salary slip..."

---

### FACE ENROLMENT (`/my/face-enrol`)

**Purpose:**
One-time biometric face enrolment performed by the employee. Required before face-based punch-in is enabled. Once enrolled, the employee does not need to revisit this page.

**Layout:**
- Page title "Face Enrolment"
- Employee name displayed in header (e.g. "Face enrolment — Ramesh Kumar")
- Instructions: "Capture 3–5 photos, varying the angle and lighting slightly between them."
- Enrolment status indicator

**Enrolment status:**
| State | Display |
|---|---|
| Not enrolled | 🔒 "Not enrolled yet." (gray) |
| Enrolled | ✅ "Enrolled on DD MMM YYYY" (green) |

**PHOTOS section:**
- Counter: "PHOTOS (X/5)"
- Grid of captured photo thumbnails (max 5)
- **"Capture"** button with camera icon — opens device camera (mocked)
- Each captured photo shows a small preview thumbnail
- Minimum 3 photos required, maximum 5

**BIOMETRIC CONSENT section:**
| Field | Type |
|---|---|
| Consent Method | Dropdown: "Signed paper form (scanned)" / "Digital consent (in-app)" / "Verbal (witnessed)" |
| Consent Acknowledgement | Checkbox: "This worker was told what their face data is used for and has consented (v1-YYYY-MM)" |

- Note text: "Written consent is required for biometric data and is recorded against this enrolment. It can be withdrawn later."

**"Enrol" button (primary):**
- Disabled until: at least 3 photos captured AND consent checkbox is checked
- On click: toast "Face enrolled successfully", status changes to Enrolled, button changes to "Re-enrol" (secondary)

**Re-enrol behavior:**
- If already enrolled, shows green status with date
- "Re-enrol" button clears existing photos and resets the flow
- Confirmation dialog: "This will replace your existing face data. Continue?"

**Behaviors:**
- This is a one-time setup step per employee
- Face enrolment is required before face-based punch-in works
- Consent must be recorded before enrolment is accepted
- Admin can view enrolment status in Employee detail → Documents tab
- Data persists in localStorage (mocked — no actual biometric processing)

---

### CROSS-MODULE BEHAVIORS

- My Punch data feeds into the admin Attendance module
- My Leave applications appear in admin Leave Summary for approval
- My Salary Summary reads from Payroll Runs data for the logged-in employee
- Punch geolocation data appears in admin Attendance → Punch Exceptions
- Face Enrolment status gates face-based punch-in (employee cannot face-punch without enrolling)
- All data persists in localStorage
- Toast notifications on punch, leave apply, leave cancel, and face enrolment actions
