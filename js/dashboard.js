function renderDashboard(container){
    const d=AppData;
    const totalEmployees=d.employees.length;
    const present=d.attendance.filter(a=>a.status==='Complete').length;
    const absent=d.attendance.filter(a=>a.status==='Absent').length;
    const onLeave=d.attendance.filter(a=>a.status==='On Leave').length;
    const onMuster=d.employees.filter(e=>e.status==='Active').length;
    const activeProjects=d.projects.filter(p=>p.status==='Ongoing').length;
    const totalMachinery=d.assets.length;
    const totalContract=d.projects.reduce((s,p)=>s+p.contractValue,0);
    const monthExpenses=d.purchases.reduce((s,p)=>s+p.amount,0)+d.machineryFuel.reduce((s,f)=>s+f.amount,0);
    const pendingApprovals=d.leaves.filter(l=>l.status==='Pending').length;
    container.innerHTML=`
    <div class="page-header"><h1>Dashboard</h1><span style="color:#6b7280;font-size:13px">${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></div>
    <div class="cards-grid">
        <div class="card card-clickable" onclick="navigateTo('#/hr/employees')"><div class="card-icon blue"><i class="fas fa-users"></i></div><div class="card-value">${totalEmployees}</div><div class="card-label">Total Employees</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/hr/attendance')"><div class="card-icon green"><i class="fas fa-user-check"></i></div><div class="card-value">${present}</div><div class="card-label">Present Today</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/hr/attendance')"><div class="card-icon red"><i class="fas fa-user-times"></i></div><div class="card-value">${absent}</div><div class="card-label">Absent</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/hr/leave')"><div class="card-icon yellow"><i class="fas fa-calendar-minus"></i></div><div class="card-value">${onLeave}</div><div class="card-label">On Leave</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/projects/portfolio')"><div class="card-icon purple"><i class="fas fa-project-diagram"></i></div><div class="card-value">${activeProjects}</div><div class="card-label">Active Projects</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/machinery')"><div class="card-icon cyan"><i class="fas fa-truck"></i></div><div class="card-value">${totalMachinery}</div><div class="card-label">Total Machinery</div></div>
        <div class="card"><div class="card-icon orange"><i class="fas fa-rupee-sign"></i></div><div class="card-value">${formatCurrency(monthExpenses)}</div><div class="card-label">Monthly Expenses</div></div>
        <div class="card card-clickable" onclick="navigateTo('#/hr/leave')"><div class="card-icon pink"><i class="fas fa-clock"></i></div><div class="card-value">${pendingApprovals}</div><div class="card-label">Pending Approvals</div></div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:24px">
        <div class="card" style="padding:20px">
            <h3 style="margin-bottom:12px;font-size:15px"><i class="fas fa-bell" style="color:#f59e0b"></i> Alerts & Reminders</h3>
            <div style="max-height:220px;overflow-y:auto">
                ${d.alerts.map(a=>`<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:13px"><span style="color:#3b82f6;font-size:8px;margin-top:5px">●</span><div><strong>${a.machine}</strong> — ${a.desc}<br><span style="color:#6b7280;font-size:11px">${a.detail} | ${a.due}</span></div></div>`).join('')}
            </div>
            <a href="#/machinery" style="display:block;margin-top:12px;font-size:12px;color:#3b82f6">Open the asset register for per-machine flags →</a>
        </div>
        <div class="card" style="padding:20px">
            <h3 style="margin-bottom:12px;font-size:15px"><i class="fas fa-clipboard-list" style="color:#3b82f6"></i> Quick Stats</h3>
            <div style="font-size:13px">
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6"><span>Contract Value</span><strong>${formatCurrency(totalContract)}</strong></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6"><span>Employees on Muster</span><strong>${present}/${onMuster}</strong></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6"><span>Materials Cost</span><strong>${formatCurrency(d.purchases.reduce((s,p)=>s+p.amount,0))}</strong></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6"><span>Fuel Cost</span><strong>${formatCurrency(d.machineryFuel.reduce((s,f)=>s+f.amount,0))}</strong></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0"><span>Hire Bills</span><strong>${formatCurrency(d.hireBills.reduce((s,h)=>s+h.amount,0))}</strong></div>
            </div>
        </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
        <div class="card" style="padding:20px">
            <h3 style="margin-bottom:12px;font-size:15px"><i class="fas fa-user-check" style="color:#10b981"></i> Today's Attendance</h3>
            <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>Employee</th><th>Department</th><th>Status</th></tr></thead><tbody>
            ${d.attendance.slice(0,8).map(a=>`<tr><td>${a.employee}</td><td>${a.department}</td><td>${getStatusBadge(a.status)}</td></tr>`).join('')}
            </tbody></table></div>
        </div>
        <div class="card" style="padding:20px">
            <h3 style="margin-bottom:12px;font-size:15px"><i class="fas fa-calendar-check" style="color:#8b5cf6"></i> Recent Leaves</h3>
            <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>Employee</th><th>Type</th><th>Days</th><th>Status</th></tr></thead><tbody>
            ${d.leaves.map(l=>`<tr><td>${l.employee}</td><td>${l.type}</td><td>${l.days}</td><td>${getStatusBadge(l.status)}</td></tr>`).join('')}
            </tbody></table></div>
        </div>
    </div>`;
}

function renderGroupDashboard(container){
    const d=AppData;
    const comp1Emps=d.employees.filter(e=>e.company==='Demo Constructions Pvt Ltd');
    const comp1Payroll=comp1Emps.reduce((s,e)=>s+e.basicSalary+e.hra+e.conveyance+e.siteAllowance,0);
    const comp1Loans=d.loans.filter(l=>l.status==='Active').reduce((s,l)=>s+l.balance,0);
    container.innerHTML=`
    <div class="page-header"><h1>Group Dashboard</h1></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">
        <div class="card"><h4 style="margin-bottom:8px">Demo Constructions Pvt Ltd</h4><p style="font-size:12px;color:#6b7280">Payroll: Aug 2026</p>
            <table style="margin-top:8px"><tbody>
                <tr><td style="font-size:12px">Headcount</td><td style="text-align:right"><strong>${comp1Emps.length}</strong></td></tr>
                <tr><td style="font-size:12px">Payroll cost</td><td style="text-align:right"><strong>${formatCurrency(28254.60)}</strong></td></tr>
                <tr><td style="font-size:12px">PF / ESIC pending</td><td style="text-align:right">2 / 0</td></tr>
                <tr><td style="font-size:12px">Loans outstanding</td><td style="text-align:right">${formatCurrency(comp1Loans)}</td></tr>
                <tr><td style="font-size:12px">Docs pending</td><td style="text-align:right">0</td></tr>
            </tbody></table>
        </div>
        <div class="card"><h4 style="margin-bottom:8px">Demo Infra Projects Pvt Ltd</h4><p style="font-size:12px;color:#6b7280">Payroll: Aug 2026</p>
            <table style="margin-top:8px"><tbody>
                <tr><td style="font-size:12px">Headcount</td><td style="text-align:right"><strong>11</strong></td></tr>
                <tr><td style="font-size:12px">Payroll cost</td><td style="text-align:right"><strong>₹0.00</strong></td></tr>
                <tr><td style="font-size:12px">PF / ESIC pending</td><td style="text-align:right">0 / 0</td></tr>
                <tr><td style="font-size:12px">Loans outstanding</td><td style="text-align:right">₹0.00</td></tr>
                <tr><td style="font-size:12px">Docs pending</td><td style="text-align:right">0</td></tr>
            </tbody></table>
        </div>
        <div class="card" style="background:#f0f9ff;border-color:#bae6fd"><h4 style="margin-bottom:8px">Group Total</h4><p style="font-size:12px;color:#6b7280">2 companies</p>
            <table style="margin-top:8px"><tbody>
                <tr><td style="font-size:12px">Headcount</td><td style="text-align:right"><strong>33</strong></td></tr>
                <tr><td style="font-size:12px">Payroll cost</td><td style="text-align:right"><strong>${formatCurrency(28254.60)}</strong></td></tr>
                <tr><td style="font-size:12px">PF / ESIC pending</td><td style="text-align:right">2 / 0</td></tr>
                <tr><td style="font-size:12px">Loans outstanding</td><td style="text-align:right">${formatCurrency(comp1Loans)}</td></tr>
            </tbody></table>
        </div>
    </div>
    <div class="table-container" style="margin-bottom:20px">
        <div class="table-toolbar"><strong>Statutory Calendar</strong><select style="margin-left:auto;padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;font-size:12px"><option>FY 2026-27</option></select></div>
        <table><thead><tr><th>Company</th><th>Kind</th><th>Period</th><th>Due Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
            <tr><td>Demo Constructions Pvt Ltd</td><td>PF</td><td>Jul 2026</td><td>15 Aug 2026</td><td>₹855.00</td><td>${getStatusBadge('Pending')}</td></tr>
            <tr><td>Demo Constructions Pvt Ltd</td><td>PF</td><td>Aug 2026</td><td>15 Sept 2026</td><td>₹4,175.00</td><td>${getStatusBadge('Pending')}</td></tr>
        </tbody></table>
    </div>
    <div class="card" style="padding:20px">
        <h4 style="margin-bottom:12px">Group Employee Search</h4>
        <div style="display:flex;gap:8px"><input type="text" placeholder="Name, code or Aadhaar last-4 (min 2 chars)..." style="flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px" id="group-search-input"><button class="btn btn-primary" onclick="groupSearch()">Search</button></div>
        <div id="group-search-results" style="margin-top:12px"></div>
    </div>`;
}
function groupSearch(){
    const q=document.getElementById('group-search-input').value.toLowerCase();
    if(q.length<2){toast('Type at least 2 characters','error');return;}
    const results=AppData.employees.filter(e=>e.name.toLowerCase().includes(q)||e.id.toLowerCase().includes(q));
    document.getElementById('group-search-results').innerHTML=results.length?`<table><thead><tr><th>Code</th><th>Name</th><th>Company</th><th>Project</th></tr></thead><tbody>${results.map(e=>`<tr><td>${e.id}</td><td>${e.name}</td><td>${e.company}</td><td>${e.project}</td></tr>`).join('')}</tbody></table>`:'<p style="color:#6b7280">No results found.</p>';
}

function renderReports(container){
    container.innerHTML=`
    <div class="page-header"><h1>Reports</h1></div>
    <div class="cards-grid">
        <div class="card card-clickable" onclick="showReport('attendance')"><div class="card-icon blue"><i class="fas fa-clipboard-check"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">Attendance Report</div></div>
        <div class="card card-clickable" onclick="showReport('payroll')"><div class="card-icon green"><i class="fas fa-money-check-alt"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">Payroll Report</div></div>
        <div class="card card-clickable" onclick="showReport('machinery')"><div class="card-icon yellow"><i class="fas fa-truck"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">Machinery Report</div></div>
        <div class="card card-clickable" onclick="showReport('fuel')"><div class="card-icon red"><i class="fas fa-gas-pump"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">Fuel Report</div></div>
        <div class="card card-clickable" onclick="showReport('project')"><div class="card-icon purple"><i class="fas fa-chart-line"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">Project Cost Report</div></div>
        <div class="card card-clickable" onclick="showReport('pnl')"><div class="card-icon cyan"><i class="fas fa-balance-scale"></i></div><div class="card-label" style="font-weight:600;margin-top:8px">P&L Report</div></div>
    </div>`;
}
function showReport(type){toast('Report exported (mocked)','info');}
