# PRD: Projects Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Projects (Portfolio, Daily Work Reports, Project P&L, Clients, Sites)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction project management involves tracking budgets running into crores, coordinating labour/machinery/materials across multiple sites, monitoring daily progress against BOQ targets, managing RA bills and subcontractor billing, and calculating real-time P&L. Currently, project managers rely on disconnected DPR (Daily Progress Report) notebooks, manual cost tracking, and periodic P&L calculations that are always weeks behind reality — making it impossible to catch cost overruns before they become critical.

---

## Proposed Solution

A project management module that provides portfolio-level visibility, per-project deep-dive (with tabs for employees, machinery, materials, DWRs, bills, revenue, and P&L), daily work report capture with BOQ-linked quantity tracking, and dynamic P&L calculation that updates as financial records change across all modules.

---

## Key Features

### 1. Portfolio (`/projects/portfolio`)

#### Project List
- **Columns:** Code, Project Name, Client, Location, Contract Value (₹), Status (Planning/Ongoing/On Hold/Completed), Start Date, End Date, Actions (View/Edit/Delete)
- **Filters:** Search, Status, Client
- **Sort & Pagination**

#### Add/Edit Project Modal
- **Fields:**
  - Code (auto-gen, editable), Project Name, Client (from Clients master), Location
  - Contract Value (₹), Start Date, Expected End Date
  - Status (Planning/Ongoing/On Hold/Completed)
  - Project Manager (employee dropdown)
  - Department Type (dropdown), Project Type (e.g., Road, Building, Bridge)
  - Division (Contract/Own)
  - Site/Toll/Plant Start Date, Purchase Limit, Order Number
  - Is HO (checkbox), Site Type (Site/Toll/Plant)
  - Is Locked (checkbox — "After locking, entries cannot be made")
  - CGST Rules applicability checkbox
  - Description (textarea)

#### Project Detail Page (tabbed)
- **Overview Tab:** Summary card with project info, status, contract value, dates, manager
- **Employees Tab:** List of employees assigned to this project (from HR, filtered by project)
- **Machinery Tab:** Equipment deployed at this site (from Asset Register, filtered by site)
- **Materials/Inventory Tab:** Stock items filtered by project store (from Inventory)
- **Daily Work Reports Tab:** DWRs for this project
- **Bills & Expenses Tab:**
  - Bills: Vendor, Category, Amount, Tax, Payment Status
  - Expenses: Category, Amount, Paid By, Status
  - Work Orders (with tabs: Work Detail, Terms & Conditions, Requirements, Hire Contract, Material, Labour)
- **Revenue Tab:** Revenue entries with Description, Amount, Date, Status (Received/Pending)
- **Costing Tab:** Cost breakdown by category vs budget with variance
- **P&L Tab:** Dynamic P&L calculation (see Project P&L below)

#### Project Documents (per-site)
- **Tabs:** Address Details, Tax Details, Other Details, GST, Document
- **Document attachment grid:** Document Name (dropdown), File upload, File Path, Remark, Add/Delete rows

### 2. Daily Work Reports (`/projects/dwr`)

#### DWR List
- **Columns:** Date, Project, Supervisor, Workers (count), Machinery (count), Progress (%), Weather (Clear/Rainy/Overcast), Status (Draft/Submitted/Approved), Actions (View/Edit/Delete)
- **Filters:** Project, Date range, Status

#### Add/Edit DWR Modal
- **Fields:**
  - Project (dropdown), Work Date (default today), DPR Number (auto-gen: site code + sequence)
  - Supervisor (employee dropdown), Weather
  - Contract For: Self or Contract Number (radio + dropdown)
  - RFI No. (from Master), Layer, Chainage (dropdown)
  - Task Group (from BOQ groups), Task (from BOQ items)
  - Task quantity info display: Unit, Total Qty, Completed Qty, Pending Qty, Target Qty (Upto), Today Done Qty
  - Layer No./Section, Road Side (dropdown)
  - Chainage From/To (meters), Chainage Range
  - Payment Mode: Work Basis / Day Basis
  - **Measurement (Qty):** Nos × Nos × Nos × Length × Breadth × Depth × Density = Actual Qty (with Add/Subtract)
  - Location (searchable), Daily Work description (textarea)
  - File Attachment (upload)
  - Engineer's Name (searchable), Remark (textarea)
  - Workers on Site (count), Machinery Deployed (count)
  - Progress (%), Status (Draft/Submitted)

#### BOQ/Task Group Integration
- Task Groups (BOQ) with items: BOQ No., Task Group, Task Name, Start Date, Finish Date, Duration, Scope Qty, Per Day Qty, Done Qty Till Date, Avg Qty Per Day, Pending Qty, Days to Complete, Target Qty Per Day
- BOQ Import from Excel — real file parsing and validation against the expected column schema, with row-level error reporting for malformed data
- BOQ Estimate Import from Excel — same validation pipeline
- **Group/Task (BOQ) Alert:** Today Task, Delayed Task, To be Delayed tabs with quantity tracking

### 3. Project P&L (`/projects/pnl`)

#### Summary Cards
- Contract Value (₹), Revenue Booked (green), Total Expenses (red), Gross Profit (purple), Margin % (orange)

#### Cost Breakdown Table
- **Columns:** Category, Budget (₹), Actual (₹), Variance (₹), Variance %
- **Categories:** Labour, Materials, Machinery & Fuel, Subcontractors, Overheads
- Variance color: green if under budget, red if over

#### Revenue Section
- Description, Amount, Date, Status (Received/Pending)
- RA Bills (Running Account Bills) with billing details

#### P&L Statement
- Revenue Booked − Labour − Material − Machinery − Fuel − Subcontractors − Overheads = **Gross Profit**
- Gross Profit / Revenue = **Margin %**
- Period selector: Monthly / Quarterly / Yearly / Cumulative

#### Dynamic Calculation
- Labour cost from Payroll (employees assigned to this project)
- Material cost from Inventory Purchases (filtered by project)
- Machinery & Fuel from Machinery module (assets at this site)
- Subcontractor costs from Partners → Contractor billing
- All values are recalculated by the backend as underlying records change, so the P&L always reflects current data

### 4. Clients (`/projects/clients`)
- **Table columns:** Client Name, Contact Person, Phone, Email, Address, Projects (count), Status (Active/Inactive), Actions (Edit/Delete)
- **Add/Edit Modal:** Name, Contact Person, Phone, Email, Address, GSTIN, Status toggle
- Clients populate the Client dropdown in Project forms

### 5. Sites (`/projects/sites`)
- **Table columns:** Site Name, Project (linked), Location (address + coordinates), Geofence Radius (meters), Status (Active/Inactive), Actions (Edit/Delete)
- **Add/Edit Modal:** Site Name, Project (dropdown), Location, Latitude, Longitude, Geofence Radius (m), Status toggle
- **Geofencing:** Sites define the geographic boundary for attendance punch validation — punches outside the radius flagged as exceptions
- Sites populate "Deployed at Site" in Machinery and site filters across modules

---

## Non-Functional Requirements

- **Data integrity:** Financial figures (Contract Value, Revenue, Costs) are computed server-side from linked transactional records (Payroll, Inventory, Machinery, Partners billing) — never entered as static totals disconnected from source data.
- **File import validation:** BOQ/Excel imports are validated against a defined schema before commit; invalid rows are rejected with a downloadable error report rather than partially applied.
- **Locking:** Once a project is marked "Is Locked," the backend rejects further transactional entries against it, independent of client-side UI state.
- **Geofencing accuracy:** Site coordinates and geofence radius are used server-side to validate attendance punches in real time.
- **Auditability:** All edits to BOQ quantities, DWR submissions, and P&L-impacting records are logged to the Activity Log with before/after values.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| DWR submission rate | 100% daily for active projects |
| P&L data freshness | Real-time (updates within minutes of any financial record change) |
| Cost overrun detection | Flagged when any category exceeds budget by >10% |
| BOQ progress tracking accuracy | Within 5% of physical site measurement |
| Project visibility | All active projects have complete detail pages with all tabs populated |
| RA Bill processing time | < 2 days from submission to verification |
