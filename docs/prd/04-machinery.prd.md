# PRD: Machinery Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Machinery (Asset Register, Logbook, Fuel, Maintenance, Hire Bills, Equipment Categories, Equipment Doc Types, Hire Rates)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies operate fleets of heavy equipment (excavators, loaders, pavers, generators) worth crores — both owned and hired. Without centralized tracking, they face: untracked fuel theft and consumption variance, missed document renewals (RC, Insurance, PUC, Fitness) leading to legal penalties, unverified hire bills leading to overpayment, reactive maintenance causing costly breakdowns, and no visibility into asset utilization (paying for idle hired machines).

---

## Proposed Solution

A comprehensive machinery management module covering the full lifecycle of construction equipment: asset registration with document tracking, daily logbook entries, fuel consumption monitoring with variance alerts, preventive and breakdown maintenance scheduling, hire bill verification against logbook data, and utilization analytics for hire-vs-release decisions.

---

## Key Features

### 1. Asset Register (`/machinery`)

#### Equipment List
- **Table columns:** Code, Machine (name + model), Class (Equipment/Tool/Plant/Vehicle), Category, Ownership (Owned/Hired), Status (Active/Inactive/Under Maintenance), Site (deployed at), Reading (hrs/km), Utilization %, Flags (alert badge count)
- **Filters:** Search, Category, Ownership, Status, Site
- **Alert Flags:** Count of expiring/expired documents + overdue maintenance

#### Add/Edit Equipment Modal
- **Fields:**
  - Code (auto-gen, editable), Name, Category (from Equipment Categories master), Ownership (Owned/Hired), Class (Equipment/Tool/Plant/Vehicle), Power Source (Diesel/Petrol/Electric/Manual)
  - Status (Active/Inactive/Under Maintenance), Deployed at Site (from Projects → Sites)
  - Make, Model, Manufacturing Year, Registration Number, Chassis Number, Engine Number
  - Current Reading (hrs or km based on category meter type)
  - Fuel Benchmark Override (L/hr or L/km — overrides category default)
  - Purchase Date, Purchase Cost, Depreciation Method (WDV/SLM), Depreciation Rate (%)

#### Equipment Documents
- **Per-machine document tracking** with types from Equipment Doc Types master
- **Document types:** RC, Insurance, PUC/Pollution Certificate, Fitness, Permit, Road Tax, Loan Document, Calibration, Warranty, Other
- **Each document record:** Document Number, Expiry Date, File Upload, Status
- **Status auto-derived:**
  - Valid (green) — expiry > 30 days away
  - Expiring Soon (yellow) — expiry within 30 days (configurable remind days per doc type)
  - EXPIRED (red) — past expiry date
- **Expiry alerts** flow to Dashboard Alerts and Notifications Center via a scheduled backend job that scans expiry dates daily

### 2. Logbook (`/machinery/logbook`)

#### Logbook Entries Table
- **Columns:** Date, Machine, Site, Operator, Opening Reading, Closing Reading, Total Hours/Km (auto-calc: Closing − Opening), Fuel (L), Remarks, Actions (Edit/Delete)
- **Add Entry Modal:** Machine (dropdown), Date, Site, Operator (employee dropdown), Opening Reading (auto-populated from last closing), Closing Reading, Fuel Consumed (L), Remarks

#### Auto-Behaviors
- Logbook entries auto-update machine's Current Reading in Asset Register
- Total Hours/Km data used for utilization calculation
- Logbook hours used to verify Hire Bills

### 3. Fuel (`/machinery/fuel`)

#### Fuel Entries Table
- **Columns:** Date, Machine, Site, Quantity (L), Rate (₹/L), Amount (auto-calc: Qty × Rate), Reading at Fill, Vendor (from Partners → Vendors of type Fuel), Actions (Edit/Delete)
- **Summary Totals Bar:** Total Fuel (L), Total Cost (₹), Average Consumption (L/hr or L/km)
- **Filters:** Date range, Machine, Site

#### Fuel Variance Alerts
- If actual fuel consumption exceeds the category benchmark by >15% (threshold configurable in Equipment Categories), an alert is raised
- Alert appears in: Machinery Flags, Dashboard Alerts, Notifications Center
- Helps detect fuel theft or inefficient operation

### 4. Maintenance (`/machinery/maintenance`)

#### Due Services Section
- **Table columns:** Machine, Service Name, Interval (every X hrs/km), Remaining (units until due), Last Done (date + reading)
- Services turn red when Remaining < 10% of interval

#### Maintenance Jobs Section
- **Table columns:** Machine, Opened (date), Job Type (Breakdown/Scheduled), Problem Description, Total Cost (₹), Status (Open/In Progress/Closed), Actions (Edit/Close)

#### New Maintenance Job Modal
- Fields: Machine, Job Type (Breakdown/Scheduled), Linked Service (optional — from Due Services), Reading at Service, Problem Description (textarea)

#### New Service Schedule Modal
- Fields: Machine, Service Name (e.g., "Engine Oil Change"), Interval (hrs/km), Last Done Reading, Last Done Date

#### Auto-Behaviors
- Opening a job → machine Status changes to "Under Maintenance"
- Closing a job → machine Status resets to "Active"
- If job is linked to a service → closing updates "Last Done" reading and date, resets "Remaining" counter
- Open/due maintenance jobs generate Notifications

### 5. Hire Bills (`/machinery/hire-bills`)

#### Hire Bill List
- **Columns:** Bill #, Vendor, Machine, Period (From–To), Billed Hours, Logbook Hours, Variance (Billed − Logbook), Amount (₹), TDS (₹), Net Payable (₹), Status (Pending Verification/Verified/Paid), Actions

#### Add Hire Bill Modal
- Fields: Vendor (from Partners), Machine, Period From/To, Billed Hours, Rate (auto from Hire Rates), Amount, Party Bill Number

#### Verification Workflow
1. New bill created → Status: Pending Verification
2. Admin clicks "Verify" → system compares Billed Hours to the sum of Logbook Hours for that machine/period
3. Variance displayed — positive variance means over-billed (highlighted red)
4. If variance is within the acceptable threshold → Status: Verified
5. "Mark Paid" becomes available → calculates TDS (using vendor TDS % from Partners) and Net Payable
6. Status: Paid

#### Auto-Behaviors
- Billed vs Logbook comparison is automatic
- TDS calculation uses vendor's TDS section and rate from Partners module
- Rate auto-populated from Hire Rates master for the machine's category

### 6. Equipment Categories (`/machinery/categories`)
- **Table columns:** Category Name, Class (Plant/Tool/Equipment/Vehicle), Meter Type (hrs/km), Fuel Benchmark (L/hr or L/km), Sort Order, Actions (Edit)
- **Fuel Variance Alert Threshold:** Configurable percentage (default 15%)
- **Default categories shipped with the system** (admin-editable): Excavator, Backhoe Loader, Bulldozer, Wheel Loader, Grader, Roller, Paver, Pump, Plant, Crusher — each with an industry-standard fuel benchmark that companies can override

### 7. Equipment Doc Types (`/machinery/doc-types`)
- **Table columns:** Document Type Name, Code, Flags (Number/Expiry indicators), Default Remind Days (before expiry), Sort Order, Actions (Edit)
- **New/Edit Modal:** Code, Name, Default Remind Days, Sort Order, Has Expiry Date (toggle), Needs Document Number (toggle), Active (toggle)
- **Default document types shipped with the system** (admin-editable): RC, Insurance, PUC, Fitness, Permit, Road Tax, Loan Doc, Calibration, Warranty, Other

### 8. Hire Rates (`/machinery/rates`)
- **Table columns:** Applies To (Category), Rate per Unit (₹/hr or ₹/km), Effective From (date), Effective To (date or "Current")
- **Add Rate Modal:** Category (dropdown), Rate, Effective From, Effective To (optional — blank = current)
- Rates are entered and maintained per company/region since hire rates vary by market and contract; the system maintains a full effective-dated history so historical hire bills always reference the rate in force at the time

---

## Non-Functional Requirements

- **Data persistence:** Asset, logbook, fuel, and maintenance records are stored in the production database; utilization and variance calculations are computed server-side from actual recorded data.
- **Document storage:** Uploaded equipment documents (RC, Insurance, PUC, etc.) are stored in secure file storage with a daily scheduled job scanning for approaching/expired documents.
- **Financial accuracy:** Hire bill verification, TDS calculation, and rate lookups must use the exact effective-dated rate and vendor TDS configuration in force for the billing period, with full audit trail of any overrides.
- **Alerting:** Fuel variance and maintenance-due alerts are generated by scheduled backend jobs, not client-side computation, so they fire consistently regardless of who is logged in.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Document expiry compliance | Zero machines operating with expired documents |
| Fuel variance detection | 100% of >15% variances flagged within 24 hours |
| Hire bill overpayment prevention | Zero unverified bills paid |
| Maintenance-driven breakdowns | 50% reduction (via preventive service schedules) |
| Asset utilization visibility | 100% machines tracked with monthly utilization % |
| Hired + underutilized detection | All hired machines <60% utilization flagged for release review |
