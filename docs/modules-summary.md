# Modules Summary

This document lists the application categories, modules, submodules and their key functionalities.

## Dashboard & Reports

- Module: Dashboard
  - Description: Overview dashboards, KPI cards, group/site dashboards, activity & notifications.
  - Submodules:
    - Overview / Home
    - Group dashboards
    - Site dashboards
    - KPI cards
    - Reports & Utilization
    - Notifications & Activity log
  - Key functions: renderDashboard, renderGroupDashboard, renderSiteDashboard, renderReports, getNotifications, renderActivityLog

- Module: Reports
  - Description: Cross-module report generation and exports.
  - Submodules:
    - Report builder
    - Exports (CSV/PDF)
    - Scheduled/Ad-hoc reports
  - Key functions: renderReports, generateReport, exportReport, renderUtilizationReport

## Human Resources (HR) & Payroll

- Module: HR & Payroll
  - Description: Employee lifecycle, attendance, leaves, payroll processing and statutory artifacts.
  - Submodules:
    - Employee management
    - Attendance
    - Leave management
    - Payroll runs & salary slips
    - Challans & statutory
    - Loans
    - HR setup (code series, departments, designations)
  - Key functions: renderEmployees, saveNewEmployee, renderAttendance, saveAttendance, renderLeave, approveLeave, renderPayroll, runPayroll, viewSalarySlip, renderChallans, renderLoans

- Module: My Workspace
  - Description: Personal user area for punches, leaves, salary summary and quick utilities.
  - Submodules:
    - My punches
    - My leaves
    - Salary summary
    - Face enrolment / quick utilities
  - Key functions: renderMyWorkspace, renderMyPunch, savePunch, applyLeave, renderSalarySummary, startFaceEnrolment

## Inventory & Purchasing

- Module: Inventory
  - Description: Stock management, purchases, issues, transfers, payments and item masters.
  - Submodules:
    - Stock register
    - Purchases / GRN
    - Issues / Consumption
    - Transfers
    - Payments & supplier settlements
    - Item masters
  - Key functions: renderStock, renderPurchases, openNewPurchaseModal, saveNewPurchase, openNewIssueModal, saveNewIssue, openNewTransferModal, saveNewTransfer, renderPayments, addMasterItem

## Projects & Clients

- Module: Projects
  - Description: Project portfolio, client management, sites, Daily Work Reports (DWR) and project P&L.
  - Submodules:
    - Project portfolio
    - Clients
    - Sites
    - Daily Work Reports (DWR)
    - Project P&L
  - Key functions: renderPortfolio, addProject, saveProject, renderClients, renderSites, renderDWR, addDWR, renderProjectPnL

## Machinery / Plant

- Module: Machinery / Plant
  - Description: Asset register, logbooks, fuel entries, maintenance jobs, hire bills, equipment settings.
  - Submodules:
    - Asset register & documents
    - Logbook entries
    - Fuel management
    - Maintenance jobs
    - Hire bills
    - Equipment categories & document types
  - Key functions: renderAssetRegister, addAsset, renderLogbook, addLogEntry, renderMachineryFuel, addFuelEntry, renderMaintenance, addMaintenanceJob, renderHireBills

## Partners (Vendors & Contractors)

- Module: Partners
  - Description: Vendor & contractor management, compliance submissions, categories and RAG scoring.
  - Submodules:
    - Vendor master
    - Contractor master
    - Vendor categories
    - Compliance submissions & verification
    - RAG matrix / compliance dashboard
  - Key functions: renderVendors, addVendor, saveVendor, renderContractors, renderRAGMatrix, renderVendorCategories, renderContractorCompliance, verifyCompliance

## Settings & Administration

- Module: Settings & Admin
  - Description: Application configuration — companies, users, roles, permissions and employee setup artifacts.
  - Submodules:
    - Company management
    - User & role management
    - Roles & permissions
    - Employee setup (code series, depts, designations, doc types, shifts)
  - Key functions: renderCompanies, addCompany, renderUsers, addUser, renderRoles, addRole, renderEmployeeSetup, addCodeSeries, addDepartment

## App Shell & Utilities

- Module: App Shell & Utilities
  - Description: Application bootstrap, routing, UI helpers and global data persistence used across modules.
  - Submodules:
    - Routing & navigation
    - UI utilities (modals, toasts, confirmations)
    - Persistence & global AppData
    - Formatters & helpers
  - Key functions: initAuth, handleRoute, navigateTo, showApp, toast, openModal, closeModal, generateId, formatCurrency, loadData, saveData

---

If you want, I can expand each module's submodules into more granular feature lists (screens, API endpoints, data models), or link specific lines in `js/` and `docs/` files where each function is implemented.
