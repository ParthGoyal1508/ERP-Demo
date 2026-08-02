# PRD: Inventory Module

**Product:** BuildCore ERP — Construction Company Management System
**Module:** Inventory (Stock, Purchases, Issues, Transfers, Payments)
**Version:** 1.0
**Date:** 2026-08-02

---

## Problem Statement

Construction sites consume large quantities of materials (cement, steel, aggregate, sand, bricks) that are purchased from multiple vendors, stored at different project sites, and issued to work activities. Without centralized inventory tracking, companies face: material pilferage, inaccurate stock counts, duplicate purchases, untracked inter-site transfers, and vendor payment disputes. Manual stock registers at each site are error-prone and lack real-time visibility for head office.

---

## Proposed Solution

A multi-site inventory management module that tracks material stock in real-time across all project stores — from purchase receipt through issue to work and inter-site transfers. Includes vendor payment allocation against purchase bills, item/category masters, and auto-calculated stock balances.

---

## Key Features

### 1. Stock (`/inventory/stock`)

#### Stock Table (real-time balances)
- **Columns:** Item, Project (store), Category, Unit (BAG/CUM/KG/NOS/MT/LTR), Received (total purchased), Issued (total issued), Transfer In, Transfer Out, In Stock (auto-calc: Received + Transfer In − Issued − Transfer Out), Avg Rate (₹), Stock Value (auto-calc: In Stock × Avg Rate)
- **Filters:** Search, Project/Store, Category
- **Sort by:** Item, In Stock, Stock Value

#### Auto-Calculation
- In Stock = Received + Transfer In − Issued − Transfer Out
- Stock Value = In Stock × Weighted Average Rate
- All quantities are recalculated server-side as purchases, issues, and transfers are recorded, backed by an append-only stock ledger for auditability

#### Quick Actions from Stock Page
- "New Purchase" button → Purchase modal
- "New Issue" button → Issue modal
- "New Transfer" button → Transfer modal
- "Masters" button → Item & Category Masters modal

### 2. Purchases (`/inventory/purchases`)

#### Purchase Table
- **Columns:** Date, Project (store), Item, Vendor, Quantity, Unit, Rate (₹), Amount (auto-calc: Qty × Rate), Bill (file link), Payment Status (Paid/Unpaid/Part Paid), Actions (Edit/Delete)
- **Filters:** Date range, Project, Vendor, Payment Status

#### New Purchase Modal
- **Fields:** Project Store (dropdown), Item (from Item Masters), Vendor (from Partners → Vendors), Date, Rate (₹ per unit), Quantity, Bill File Upload
- Amount auto-calculated: Quantity × Rate
- On save: Stock "Received" quantity increments, Avg Rate recalculates

#### Behaviors
- Purchases also appear in Projects → Bills & Expenses tab
- Purchase records create payable entries for Vendor Payments

### 3. Issues (`/inventory/issues`)

#### Issue Table
- **Columns:** Date, Project (store), Item, Issued To (person/activity), Quantity, Unit, Remarks, Actions (Edit/Delete)
- **Filters:** Date range, Project, Item

#### New Issue Modal
- **Fields:** Project Store (dropdown), Item (dropdown — only items with stock > 0), Issued To (text — person or work activity), Date, Quantity, Remarks
- **Validation:** Quantity cannot exceed In Stock balance (enforced server-side)
- On save: Stock "Issued" quantity increments, In Stock decreases

### 4. Transfers (`/inventory/transfers`)

#### Transfer Table
- **Columns:** Date, From Project (store), To Project (store), Item, Quantity, Unit, Remarks, Actions (Edit/Delete)
- **Filters:** Date range, From Project, To Project, Item

#### New Transfer Modal
- **Fields:** From Project Store, To Project Store, Item (dropdown — from source store), Date, Quantity, Remarks
- **Validation:** Quantity cannot exceed source store's In Stock (enforced server-side)
- On save: Source store "Transfer Out" increments; Destination store "Transfer In" increments

### 5. Payments (`/inventory/payments`)

#### Payment Table
- **Columns:** Date, Vendor, Amount (₹), Payment Mode (UPI/Bank Transfer/Cash/Cheque), Reference Number, Allocated Bills (count), Actions (View/Edit/Delete)
- **Filters:** Date range, Vendor, Payment Mode

#### New Payment Modal
- **Fields:** Vendor (dropdown), Amount (₹), Date, Payment Mode (dropdown), Reference Number
- **Bill Allocation:** After entering amount, shows list of unpaid/part-paid bills for selected vendor — user allocates payment amount across bills
- On save: Allocated bill statuses update (Unpaid → Part Paid → Paid based on total allocated)

### 6. Item Masters (via Masters modal)

#### Item Master Table
- **Columns:** Code (auto-gen), Item Name, Category (dropdown), Unit, Description, Actions (Edit/Delete)
- **Add/Edit Fields:** Code (auto, editable), Name, Category, Unit (BAG/CUM/KG/NOS/MT/LTR), Description
- Items populate dropdowns in Purchase, Issue, Transfer forms

#### Category Master Table
- **Columns:** # (row), Category Name (uppercase), Items Count, Actions (Delete)
- **Add Field:** Category Name
- **Default categories shipped with the system** (admin-editable): CEMENT, AGGREGATE, STEEL, BRICKS, SAND, PAINT, ELECTRICAL, PLUMBING
- Categories populate the Category dropdown in Item Masters and filters

---

## Non-Functional Requirements

- **Ledger-based accounting:** Stock balances are derived from an append-only transaction ledger (purchases, issues, transfers), never from a mutable running total, so historical balances can always be reconstructed and audited.
- **Concurrency control:** Issue and Transfer validations (quantity vs. available stock) are enforced with database-level locking or optimistic concurrency checks to prevent overselling stock under simultaneous submissions from multiple sites.
- **Document storage:** Purchase bill files are stored in secure, access-controlled file storage with retrieval links from the Purchase Table.
- **Payment reconciliation:** Payment-to-bill allocation is transactional — a payment record and its bill status updates commit together or not at all.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Stock accuracy | Within 2% of physical stock count |
| Material pilferage detection | 100% of issues tracked with person/activity attribution |
| Vendor payment reconciliation | Zero disputed payments (all payments allocated to bills) |
| Inter-site transfer tracking | 100% of transfers logged with source/destination |
| Purchase to payment cycle | Full audit trail from PO → receipt → bill → payment |
| Stock-out incidents | 50% reduction through real-time visibility |
