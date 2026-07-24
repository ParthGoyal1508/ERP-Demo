Here's a tightened, Lovable-ready prompt:

---

# Construction ERP — Lovable Prompt

Build a fully functional, responsive **Construction Company ERP web app** (React + TypeScript + Tailwind CSS) with local persistence via localStorage. This is an interactive prototype — every button, form, table action, filter, and workflow must work. Pre-populate all modules with realistic mock data.

---

## AUTH
Login page with email/password, show/hide password, remember me, and mock auth. Demo credentials shown on screen. Redirect to dashboard on success.

---

## LAYOUT
- Collapsible left sidebar with module groups and icons
- Top header with global search, notifications bell, and user avatar/profile menu
- Toast notifications for all create/edit/delete actions
- Confirmation dialogs before destructive actions
- Empty states and form validation throughout

---

## DASHBOARD
Summary cards (Total Employees, Present Today, Absent, On Leave, Active Projects, Total Machinery, Monthly Expenses, Pending Approvals). Cards are clickable and navigate to the relevant module. All values derive from the underlying mock data.

---

## SIDEBAR MODULES

**HR & Payroll**
- Employees — list with ID, name, avatar, designation, department, project, phone, status. Full CRUD, search, filter by dept/project/status, sort, pagination. Detail page with personal info, employment, salary, attendance summary, leave summary, documents tabs.
- Attendance — daily view table (employee, project, in/out time, hours, status: Present/Absent/Half Day/Leave). Mark, edit, filter by date/project/status. Mock geo-tag data shown.
- Leave Management — leave request list (employee, type, dates, days, reason, status). Apply leave form. Approve/Reject/Cancel actions. Leave balance per employee.
- Payroll — monthly payroll table (employee, basic, allowances, deductions, PF, ESIC, net salary, status). Generate payroll, view salary slip modal, bank salary sheet view (mocked, no external links).
- PF & ESIC — compliance table with employee/employer contributions, monthly period, status. Editable records.

**Plant & Machinery**
- Machinery & Vehicles — unified list with ID, number, type, model, assigned project, operator, status (Active/Inactive/Under Maintenance). Full CRUD, search, filter, sort.
- Fuel Management — entries with vehicle, date, quantity, cost, rate, odometer, project. Full CRUD + summary totals (total fuel, total cost, avg consumption).
- Daily Vehicle Readings — opening/closing readings, total usage, fuel, driver, project. Full CRUD.
- Vehicle Documents — RC, Insurance, Fitness, Pollution, Permit per vehicle with expiry dates and status alerts.
- GPS Tracking — mock location screen showing vehicles, last-known location, assigned project, status. No real GPS integration.

**Project Management**
- Projects — list with ID, name, client, location, manager, budget, actual cost, revenue, P&L, status (Planning/Ongoing/On Hold/Completed). Full CRUD, search, filter, sort.
- Project Detail page with tabs: Overview, Employees, Machinery, Materials/Inventory, Daily Work Reports, Bills, Expenses, Revenue, Costing, P&L.
- Materials/Inventory — stock in/out/transfer with quantity, unit, supplier, category, history.
- Daily Work Reports — date, description, workers, machinery used, materials, % progress, supervisor, remarks. Full CRUD.
- Bills & Expenses — bills (vendor, category, amount, tax, payment status) and expenses (category, amount, paid by, status). Full CRUD.
- Project P&L — dynamic calculation: Revenue − (Labour + Material + Machinery + Fuel + Other) = Gross Profit, Net Profit, Margin %. Updates as financial records change.
- Project Costing — cost breakdown by category vs budget with variance.

**Reports**
- Attendance, Payroll, Employee, Machinery, Fuel, Project Cost, Expense, P&L reports. Each has date range + relevant filters + mocked export button.

**Settings**
- Company Settings (name, logo, address)
- User Management (list of users, roles)
- Roles & Permissions (role list with permission counts, user assignments)

---

## TECHNICAL REQUIREMENTS
- All data persists in localStorage; survives page refresh
- Dashboard metrics are computed from live mock data, not hardcoded
- Reusable component system: tables, modals, forms, badges, buttons, filters
- No backend, no external APIs, no WhatsApp or banking integrations — replace any such workflow with an in-app mock
- Desktop-first, mobile-friendly
- Professional ERP aesthetic: white/light-gray main area, dark sidebar, status badges, clean typography