# PRD: Partners Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Partners (Vendors, Vendor Categories, Contractor Vault, Monthly Compliance, RAG Matrix, BOCW Cess)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction companies work with dozens of vendors (material suppliers, fuel stations, equipment hire parties) and subcontractors (labour contractors). Managing vendor TDS compliance, tracking contractor PF/ESIC statutory filings, and ensuring BOCW (Building and Other Construction Workers) cess payments are current — all require manual follow-ups. Missed compliance leads to government penalties, project stoppages, and legal liability for the principal employer.

---

## Proposed Solution

A partners management module that centralizes vendor and contractor information, automates TDS tracking for vendor payments, enforces monthly PF/ESIC compliance tracking for labour contractors with a visual RAG (Red-Amber-Green) matrix, and calculates BOCW cess liability per project.

---

## Key Features

### 1. Vendors (`/vendors`)

#### Vendor List
- **Columns:** Vendor (name + city), Deals In (material category tags), Contact (person + phone), Type (Fuel/Hire/Material/Service/Subcontractor), GSTIN, TDS (section + rate, e.g., "2% 194C"), Active (toggle), Actions (Edit)
- **Filters:** Search, Type, Active status

#### Add/Edit Vendor Modal
- **Details Tab:**
  - Name, Type (Material/Fuel/Hire/Service/Subcontractor — dropdown)
  - Deals In (multi-select tags from Vendor Categories)
  - GSTIN, PAN
  - TDS Section (e.g., 194C, 194J), TDS Rate (%)
  - Active toggle
- **Address Tab:** Address, City, State, PIN Code
- **Contacts Tab:**
  - Contact entries: Name, Phone, Email
  - "+ Add Contact" button for multiple contacts
- **Work Detail Tab** (for subcontractors):
  - Work Type (All/Specific), Contractor Type (Sub Contractor/Labour Contractor)
  - Vendor Currency (INR), Exchange Rate
  - Hire details: Hire type (Taken/Given), Contract Code, Period (From–To)
  - Machine Category, Machine, Required Avg, Charges Base (Monthly/Daily), Rate, Min Working Days
  - Allow BD Days, Allow Idle Days, Operator/Helper/Maintenance/Fuel charges toggles
  - Terms & Conditions, Requirements tabs

#### Cross-module Usage
- Vendors populate dropdowns in: Inventory Purchases, Inventory Payments, Machinery Fuel entries, Machinery Hire Bills
- Vendor TDS % used for Hire Bill TDS calculation

### 2. Vendor Categories (`/vendors/categories`)
- **Table columns:** # (row number), Category Name, Description, Vendors (count of linked vendors), Actions (Edit/Delete)
- **Add/Edit Modal:** Name (text), Description (text)
- **Default categories shipped with the system** (admin-editable): Material, Fuel, Hire, Service, Transport, Subcontractor
- Categories populate "Deals In" multi-select in Vendor form and Type filters

### 3. Contractor Vault (`/contractors`)

#### Contractor List
- **Columns:** Contractor Name, Contact Person, License Number, PF Registration, ESIC Registration, Insurance, BOCW Registration, Compliance Status (Compliant/Non-compliant/Partially compliant), Actions (View/Edit)
- **Compliance Status auto-derived:** Based on Monthly Compliance submissions for last 3 months

#### Contractor Detail View
- Document checklist with expiry tracking for: Labour License, PF Registration, ESIC Registration, Insurance Policy, BOCW Registration
- Monthly compliance history (links to Monthly Compliance filtered view)
- Work orders and billing summary

### 4. Monthly Compliance (`/contractors/compliance`)

#### Compliance Table
- **Columns:** Contractor, Month, PF Challan #, PF Amount (₹), PF Date, ESIC Challan #, ESIC Amount (₹), ESIC Date, Status (Verified/Submitted/Partial/Missing), Actions (Edit/Verify)
- **Filters:** Contractor, Month, Status

#### Record Submission Modal
- **Fields:** Contractor (dropdown), Month (month picker), PF Challan Number, PF Amount, PF Payment Date, ESIC Challan Number, ESIC Amount, ESIC Payment Date

#### Status Auto-Derivation
- Both PF and ESIC submitted → **Submitted**
- Only one submitted → **Partial**
- Neither submitted → **Missing**
- Admin clicks "Verify" → **Verified**

#### Auto-Behaviors
- Compliance status auto-updates RAG Matrix
- Missing compliance for current/previous month generates Notification
- Verified status marked with admin name and timestamp

### 5. RAG Matrix (`/contractors/rag`)

#### Visual Matrix
- **Rows:** Contractors (from Contractor Vault)
- **Columns:** Months (Apr → Mar for selected FY)
- **Status Dots:**
  - Green — Verified
  - Yellow — Submitted/Partial
  - Red — Missing/Rejected
  - Gray — No filing yet (future months)
- **FY Selector:** Financial year dropdown to view historical compliance

#### Behaviors
- Matrix auto-populates from Monthly Compliance data
- Single glance shows compliance health of all contractors across the year
- Clicking a dot navigates to that contractor's compliance detail for that month

### 6. BOCW Cess (`/bocw`)

#### BOCW Table
- **Columns:** Project Name, Contract Value (₹), Cess Rate (1% — statutory), Cess Liability (auto-calc: Contract Value × 1%), Paid (₹), Balance (₹), Last Payment Date, Status (Paid/Partial/Pending), Actions (Record Payment)

#### Record Payment Modal
- Fields: Project, Amount Paid, Payment Date, Reference Number, Remarks

#### Auto-Behaviors
- Cess Liability auto-calculated from Project Contract Value
- Balance = Liability − Total Paid
- Status: Paid (Balance = 0), Partial (Balance > 0 with some payment), Pending (no payment)
- Project data sourced from Projects → Portfolio

---

## Non-Functional Requirements

- **Data persistence:** Vendor, contractor, compliance, and BOCW records are stored in the production database with full historical retention (no data loss on status transitions).
- **Document storage:** Contractor licenses, registrations, and insurance documents are stored in secure, access-controlled file storage with expiry-based reminder scheduling.
- **Compliance rate configuration:** Statutory rates (PF, ESIC, BOCW cess %) are configurable per company/region to accommodate government rate changes without requiring a code release.
- **Auditability:** Compliance verification actions record the verifying admin's identity and timestamp for statutory audit purposes.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Contractor compliance tracking | 100% of contractors tracked monthly |
| Compliance gap detection | Missing filings flagged within 5 days of month-end |
| RAG Matrix coverage | All active contractors × all months populated |
| BOCW cess payment compliance | Zero projects with overdue cess balance |
| Vendor TDS accuracy | 100% accurate TDS deduction on hire bills |
| Vendor data completeness | All vendors have GSTIN, PAN, and TDS details |
