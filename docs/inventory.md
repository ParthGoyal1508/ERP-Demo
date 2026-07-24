Here's the Lovable prompt for the Inventory module:

---

## INVENTORY MODULE

Add an **Inventory** section to the sidebar with four sub-pages: **Stock**, **Purchases**, **Issues**, **Transfers**, and **Payments**.

---

### SIDEBAR STRUCTURE

```
Inventory
  ├── Stock
  ├── Purchases
  ├── Issues
  ├── Transfers
  └── Payments
```

---

### STOCK (`/inventory/stock`)

**Layout:**
- Page title "Stock"
- Top-right action buttons: **"New purchase"** (dark/primary) | **"New issue"** | **"New transfer"** | **"Masters"**
- Search bar top-left: "Search item code, name..."
- Filters: All companies (dropdown) | All projects (dropdown) | All categories (dropdown)

**Stock table columns:**
| Column | Description |
|---|---|
| Item | Material name |
| Project | Assigned project/site |
| Category | e.g. CEMENT, AGGREGATE, STEEL |
| Unit | BAG, CUM, KG, NOS |
| Received | Total quantity received |
| Issued | Total quantity issued to site |
| Transfer in | Quantity transferred in from another store |
| Transfer out | Quantity transferred out |
| In stock | Current balance (Received + Transfer in − Issued − Transfer out) |
| Avg rate | Average purchase rate per unit (₹) |
| Stock value | In stock × Avg rate (₹) |

**Pre-populated mock data:**
| Item | Project | Category | Unit | Received | Issued | Transfer in | Transfer out | In stock | Avg rate | Stock value |
|---|---|---|---|---|---|---|---|---|---|---|
| Cement OPC 53 Grade | NH-11 Widening | CEMENT | BAG | 0 | 0 | 30 | 0 | 30 BAG | ₹385 | ₹11,550 |
| Aggregate 20mm | NH-48 O&M | AGGREGATE | CUM | 150 | 90 | 0 | 0 | 60 CUM | ₹1,350 | ₹81,000 |
| Cement OPC 53 Grade | NH-48 O&M | CEMENT | BAG | 200 | 125 | 0 | 50 | 25 BAG | ₹385 | ₹9,625 |
| TMT Steel 12mm | NH-48 O&M | STEEL | KG | 2,000 | 1,200 | 0 | 0 | 800 KG | ₹62 | ₹49,600 |
| Cement OPC 53 Grade | SH-22 Maintenance | CEMENT | BAG | 20 | 0 | 0 | 0 | 20 BAG | ₹385 | ₹7,700 |

**Behaviors:**
- In stock value auto-calculates: Received + Transfer in − Issued − Transfer out
- Stock value auto-calculates: In stock × Avg rate
- Search filters rows by item name or code in real time
- Project/category dropdowns filter the table
- Clicking a row opens a stock detail drawer/modal showing full movement history for that item

---

### NEW PURCHASE MODAL

Triggered by **"New purchase"** button on Stock page.

**Modal title:** "New Purchase"

**Fields:**
| Field | Type | Notes |
|---|---|---|
| Project Store | Dropdown | e.g. NH48 — NH-48 O&M |
| Item | Dropdown | Searchable list of materials |
| Vendor | Dropdown | Searchable, shows vendor list |
| Date | Date picker | Defaults to today |
| Rate (₹ / unit) | Number | Per unit purchase rate |
| Quantity | Number | Units received |
| Bill File (optional) | File upload | Mocked — shows filename only |

**Vendor dropdown** shows searchable list:
- Shree Shyam Fuel Station
- Jai Bhavani Earthmovers
- Bansal Building Materials
- Maruti Equipment Rentals
- Rajputana Machinery Services

**Footer buttons:** Cancel | **"Record purchase"** (dark primary)

**On submit:**
- Stock table updates: Received qty increases, In stock recalculates, Stock value updates
- New row added to Purchases page
- Toast: "Purchase recorded successfully"

---

### NEW ISSUE MODAL

Triggered by **"New issue"** button.

**Fields:**
| Field | Type |
|---|---|
| Project Store | Dropdown |
| Item | Dropdown |
| Issued To | Text (person or team) |
| Date | Date picker |
| Quantity | Number |
| Remarks | Textarea (optional) |

**On submit:**
- Issued qty increases on Stock table
- In stock decreases accordingly
- New row added to Issues page
- Toast: "Issue recorded successfully"

---

### NEW TRANSFER MODAL

Triggered by **"New transfer"** button.

**Fields:**
| Field | Type |
|---|---|
| From Project Store | Dropdown |
| To Project Store | Dropdown |
| Item | Dropdown |
| Date | Date picker |
| Quantity | Number |
| Remarks | Textarea (optional) |

**On submit:**
- Transfer out increases on source project row
- Transfer in increases on destination project row
- In stock updates on both rows
- New row added to Transfers page
- Toast: "Transfer recorded successfully"

---

### PURCHASES (`/inventory/purchases`)

**Layout:**
- Page title "Purchases"
- Top-right: **"New purchase"** button (same modal as above)
- Filters: All projects | All vendors | All items | Date range | Any status

**Table columns:**
| Column | Description |
|---|---|
| Date | Purchase date |
| Project | Project store |
| Item | Material name |
| Vendor | Supplier name |
| Qty | Quantity purchased |
| Unit | BAG / KG / CUM etc. |
| Rate | Per unit rate (₹) |
| Amount | Qty × Rate (₹) |
| Bill | Bill reference / file indicator |
| Payment | Paid / Unpaid / Part paid badge |
| Actions | Edit / Delete |

**Pre-populated mock rows matching stock data above.**

**Row actions:**
- Edit opens pre-filled modal
- Delete with confirmation dialog
- Clicking Bill column indicator opens bill view modal (mocked)

---

### ISSUES (`/inventory/issues`)

**Layout:**
- Page title "Issues"
- Top-right: **"New issue"** button
- Filters: All projects | All items | Date range

**Table columns:**
| Column | Description |
|---|---|
| Date | Issue date |
| Project | Source project store |
| Item | Material name |
| Issued To | Person or team |
| Qty | Quantity issued |
| Unit | Unit of measure |
| Remarks | Notes |
| Actions | Edit / Delete |

---

### TRANSFERS (`/inventory/transfers`)

**Layout:**
- Page title "Transfers"
- Top-right: **"New transfer"** button
- Filters: All projects | All items | Date range

**Table columns:**
| Column | Description |
|---|---|
| Date | Transfer date |
| From Project | Source store |
| To Project | Destination store |
| Item | Material name |
| Qty | Quantity transferred |
| Unit | Unit of measure |
| Remarks | Notes |
| Actions | Edit / Delete |

---

### PAYMENTS (`/inventory/payments`)

**Layout:**
- Page title "Payments"
- Top: **Vendor selector dropdown** — "Select vendor" (filters the payments list)
- Section heading: **"Recent payments"**

**Recent Payments table columns:**
| Column | Description |
|---|---|
| Date | Payment date |
| Vendor | Vendor/supplier name |
| Amount | Payment amount (₹) |
| Mode | UPI / BANK / CASH |
| Ref | UTR or reference number |
| Allocated bills | Number of bills this payment covers |

**Pre-populated mock data:**
| Date | Vendor | Amount | Mode | Ref | Allocated bills |
|---|---|---|---|---|---|
| 17 Jul 2026 | Bansal Building Materials | ₹1,02,500 | UPI | BOOT-FULL-1784272647189 | 1 |
| 17 Jul 2026 | Bansal Building Materials | ₹1,00,000 | BANK | BOOT-PART-1784272647159 | 1 |
| 17 Jul 2026 | Bansal Building Materials | ₹1,24,000 | BANK | BOOT-1784272606491 | 1 |
| 15 Jul 2026 | Bansal Building Materials | ₹50,000 | BANK | UTR2607150042 | 1 |

**New Payment button** (top-right):
- Modal fields: Vendor | Amount | Date | Mode (UPI/BANK/CASH) | Reference number | Allocate to bill (optional dropdown)
- On submit: new row appears in table, toast "Payment recorded"

**Vendor filter behavior:**
- Selecting a vendor filters Recent payments to show only that vendor's payments
- Clearing selector shows all payments

---

### MASTERS (modal or page, triggered by "Masters" button on Stock)

**Manages the reference data used in dropdowns:**

**Item Masters tab:**
- Table: Item name | Category | Unit | Description | Actions (Edit/Delete)
- Add new item form

**Category Masters tab:**
- Table: Category name | Actions
- Pre-populated: CEMENT, AGGREGATE, STEEL, BRICKS, SAND, PAINT, ELECTRICAL, PLUMBING

**Vendor Masters tab:**
- Table: Vendor name | Phone | GST number | Address | Actions
- Pre-populated with the 5 mock vendors listed above

---

### CROSS-MODULE BEHAVIORS

- Every purchase recorded here also appears in the **Project → Bills** section for that project
- Every payment recorded here links back to purchases via the Allocated bills count
- Stock In stock values update immediately across all views when purchases, issues, or transfers are saved
- All data persists in localStorage
- Toast notifications on every create/edit/delete action
- Empty state shown when no records match the current filter