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
    `;
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

// Notifications Center
function getNotifications() {
    const d = AppData, notifs = [], today = new Date().toISOString().split('T')[0];
    const warn30 = new Date(Date.now() + 30*86400000).toISOString().split('T')[0];
    const warn7 = new Date(Date.now() + 7*86400000).toISOString().split('T')[0];
    // Document expiry
    d.assets.forEach(a => {
        (a.documents || []).forEach(doc => {
            if (!doc.expiry) return;
            const dtName = (d.equipmentDocTypes.find(t => t.code === doc.type) || {}).name || doc.type;
            if (doc.expiry < today) notifs.push({ icon: 'fa-file-circle-exclamation', color: '#dc2626', title: a.id + ' — ' + dtName + ' EXPIRED', detail: 'Expired on ' + doc.expiry, link: '#/machinery', cat: 'Document Expiry' });
            else if (doc.expiry <= warn30) notifs.push({ icon: 'fa-file-circle-exclamation', color: '#f59e0b', title: a.id + ' — ' + dtName + ' expiring soon', detail: 'Expires ' + doc.expiry, link: '#/machinery', cat: 'Document Expiry' });
        });
    });
    // Pending leave approvals
    d.leaves.filter(l => l.status === 'Pending').forEach(l => {
        notifs.push({ icon: 'fa-calendar-check', color: '#eab308', title: l.employee + ' — Leave pending approval', detail: l.type + ' (' + l.days + ' days) from ' + l.from, link: '#/hr/leave', cat: 'Leave Approval' });
    });
    // Maintenance due
    d.maintenanceJobs.filter(j => j.status === 'Open').forEach(j => {
        notifs.push({ icon: 'fa-wrench', color: '#f97316', title: j.machine + ' — Maintenance job open', detail: j.type + ': ' + j.problem + ' since ' + j.opened, link: '#/machinery/maintenance', cat: 'Maintenance' });
    });
    // Alerts (service due)
    d.alerts.forEach(a => {
        notifs.push({ icon: 'fa-bell', color: '#3b82f6', title: a.machine + ' — ' + a.desc, detail: a.detail + ' | ' + a.due, link: '#/machinery', cat: 'Service Alert' });
    });
    // Contractor compliance missing
    (d.contractorCompliance || []).filter(c => c.status === 'Missing').forEach(c => {
        notifs.push({ icon: 'fa-shield-halved', color: '#dc2626', title: c.contractor + ' — ' + c.month + ' compliance missing', detail: 'PF and ESIC not submitted', link: '#/contractors/compliance', cat: 'Compliance' });
    });
    return notifs;
}
function renderNotifications(container) {
    const notifs = getNotifications();
    // Update bell badge
    const badge = document.querySelector('.header-icon .badge');
    if (badge) badge.textContent = notifs.length;
    container.innerHTML = `
    <div class="page-header"><h1>Notifications</h1><span style="color:#6b7280;font-size:13px">${notifs.length} active</span></div>
    ${notifs.length ? `<div style="display:flex;flex-direction:column;gap:8px">
        ${notifs.map(n => `<div class="card" style="padding:14px 16px;display:flex;align-items:flex-start;gap:12px;cursor:pointer" onclick="navigateTo('${n.link}')">
            <div style="width:36px;height:36px;border-radius:8px;background:${n.color}15;color:${n.color};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${n.icon}"></i></div>
            <div style="flex:1"><div style="font-weight:600;font-size:14px">${n.title}</div><div style="font-size:12px;color:#6b7280;margin-top:2px">${n.detail}</div></div>
            <span class="badge-status badge-gray" style="font-size:11px;flex-shrink:0">${n.cat}</span>
        </div>`).join('')}
    </div>` : '<div style="text-align:center;padding:60px;color:#9ca3af"><i class="fas fa-check-circle" style="font-size:48px;margin-bottom:16px;display:block;color:#10b981"></i><h3>All clear!</h3><p>No pending notifications.</p></div>'}`;
}

// Activity Log
function logActivity(user, action, module, target, detail) {
    if (!AppData.activityLog) AppData.activityLog = [];
    AppData.activityLog.unshift({ id: generateId('AL'), timestamp: new Date().toISOString(), user: user, action: action, module: module, target: target, detail: detail });
    if (AppData.activityLog.length > 200) AppData.activityLog.length = 200;
}
function renderActivityLog(container) {
    const logs = AppData.activityLog || [];
    const modules = [...new Set(logs.map(l => l.module))];
    const modOpts = modules.map(m => `<option value="${m}">${m}</option>`).join('');
    container.innerHTML = `
    <div class="page-header"><h1>Activity Log</h1></div>
    <div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
        <select id="log-module-filter" onchange="filterActivityLog()"><option value="">All Modules</option>${modOpts}</select>
        <select id="log-time-filter" onchange="filterActivityLog()"><option value="">All Time</option><option value="1">Today</option><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option></select>
    </div>
    <div id="activity-log-list" style="display:flex;flex-direction:column;gap:6px">
        ${renderActivityRows(logs)}
    </div>`;
}
function renderActivityRows(logs) {
    if (!logs.length) return '<div style="text-align:center;padding:40px;color:#9ca3af">No activity recorded yet.</div>';
    const iconMap = { HR: 'fa-users', Payroll: 'fa-money-check-alt', Machinery: 'fa-truck', Projects: 'fa-project-diagram', Inventory: 'fa-boxes', Partners: 'fa-handshake', Settings: 'fa-cog' };
    const colorMap = { HR: '#3b82f6', Payroll: '#10b981', Machinery: '#f59e0b', Projects: '#8b5cf6', Inventory: '#06b6d4', Partners: '#ec4899', Settings: '#6b7280' };
    return logs.map(l => {
        const icon = iconMap[l.module] || 'fa-circle';
        const color = colorMap[l.module] || '#6b7280';
        const ts = new Date(l.timestamp);
        const timeStr = ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ', ' + ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
            <div style="width:32px;height:32px;border-radius:8px;background:${color}15;color:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px"><i class="fas ${icon}"></i></div>
            <div style="flex:1"><div style="font-size:13px"><strong>${l.user}</strong> ${l.action} <span style="color:#3b82f6">${l.target}</span></div><div style="font-size:12px;color:#6b7280">${l.detail}</div></div>
            <span style="font-size:11px;color:#9ca3af;white-space:nowrap">${timeStr}</span>
        </div>`;
    }).join('');
}
function filterActivityLog() {
    const mod = document.getElementById('log-module-filter').value;
    const days = document.getElementById('log-time-filter').value;
    let logs = AppData.activityLog || [];
    if (mod) logs = logs.filter(l => l.module === mod);
    if (days) {
        const cutoff = new Date(Date.now() - Number(days) * 86400000).toISOString();
        logs = logs.filter(l => l.timestamp >= cutoff);
    }
    document.getElementById('activity-log-list').innerHTML = renderActivityRows(logs);
}

// Site Dashboard
function renderSiteDashboard(container) {
    const d = AppData;
    const projOpts = d.projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    container.innerHTML = `
    <div class="page-header"><h1>Site Dashboard</h1></div>
    <div style="margin-bottom:16px"><select id="site-dash-select" onchange="renderSiteDetail()" style="padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;min-width:250px">${projOpts}</select></div>
    <div id="site-dash-detail"></div>`;
    renderSiteDetail();
}
function renderSiteDetail() {
    const d = AppData;
    const site = document.getElementById('site-dash-select').value;
    // KPIs
    const siteAttendance = d.attendance.filter(a => {
        const emp = d.employees.find(e => e.name === a.employee);
        return emp && emp.project === site;
    });
    const workersToday = siteAttendance.filter(a => a.status === 'Complete' || a.status === 'Half Day').length;
    const machineryAtSite = d.assets.filter(a => a.site === site);
    const fuelThisMonth = d.machineryFuel.filter(f => f.site === site).reduce((s, f) => s + f.quantity, 0);
    const siteStock = d.stock.filter(s => s.project === site);
    const stockValue = siteStock.reduce((s, item) => {
        const inStock = item.received + item.transferIn - item.issued - item.transferOut;
        const rate = d.stockRates[item.item] || 0;
        return s + (inStock * rate);
    }, 0);

    document.getElementById('site-dash-detail').innerHTML = `
    <div class="cards-grid" style="margin-bottom:20px">
        <div class="card"><div class="card-icon green"><i class="fas fa-hard-hat"></i></div><div class="card-value">${workersToday}</div><div class="card-label">Workers Today</div></div>
        <div class="card"><div class="card-icon cyan"><i class="fas fa-truck"></i></div><div class="card-value">${machineryAtSite.length}</div><div class="card-label">Machinery Deployed</div></div>
        <div class="card"><div class="card-icon orange"><i class="fas fa-gas-pump"></i></div><div class="card-value">${fuelThisMonth} L</div><div class="card-label">Fuel Consumed (Month)</div></div>
        <div class="card"><div class="card-icon blue"><i class="fas fa-boxes"></i></div><div class="card-value">${formatCurrency(stockValue)}</div><div class="card-label">Material Stock Value</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div class="card" style="padding:16px"><h3 style="margin-bottom:10px;font-size:14px"><i class="fas fa-user-check" style="color:#10b981"></i> Today's Attendance</h3>
        <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>Employee</th><th>Department</th><th>Status</th></tr></thead><tbody>
        ${siteAttendance.length ? siteAttendance.map(a => `<tr><td>${a.employee}</td><td>${a.department}</td><td>${getStatusBadge(a.status)}</td></tr>`).join('') : '<tr><td colspan="3" style="text-align:center;color:#9ca3af">No attendance data</td></tr>'}
        </tbody></table></div></div>
        <div class="card" style="padding:16px"><h3 style="margin-bottom:10px;font-size:14px"><i class="fas fa-truck" style="color:#06b6d4"></i> Machinery at Site</h3>
        <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>ID</th><th>Machine</th><th>Category</th><th>Reading</th><th>Utilization</th></tr></thead><tbody>
        ${machineryAtSite.length ? machineryAtSite.map(a => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.category}</td><td>${a.reading || '-'}</td><td><div class="progress-bar" style="width:60px;display:inline-block"><div class="progress-bar-fill ${a.utilization > 80 ? 'progress-green' : a.utilization > 60 ? 'progress-yellow' : 'progress-orange'}" style="width:${a.utilization}%"></div></div> ${a.utilization}%</td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:#9ca3af">No machinery</td></tr>'}
        </tbody></table></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div class="card" style="padding:16px"><h3 style="margin-bottom:10px;font-size:14px"><i class="fas fa-gas-pump" style="color:#f59e0b"></i> Recent Fuel Entries</h3>
        <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>Date</th><th>Machine</th><th>Qty (L)</th><th>Amount</th></tr></thead><tbody>
        ${d.machineryFuel.filter(f => f.site === site).slice(0, 10).map(f => `<tr><td>${f.date}</td><td>${f.machine}</td><td>${f.quantity}</td><td>${formatCurrency(f.amount)}</td></tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#9ca3af">No fuel entries</td></tr>'}
        </tbody></table></div></div>
        <div class="card" style="padding:16px"><h3 style="margin-bottom:10px;font-size:14px"><i class="fas fa-boxes" style="color:#3b82f6"></i> Material Stock</h3>
        <div class="table-container" style="max-height:200px;overflow-y:auto"><table><thead><tr><th>Item</th><th>Category</th><th>In Stock</th><th>Value</th></tr></thead><tbody>
        ${siteStock.length ? siteStock.map(s => { const inStock = s.received + s.transferIn - s.issued - s.transferOut; const rate = d.stockRates[s.item] || 0; return `<tr><td>${s.item}</td><td><span class="badge-status badge-gray">${s.category}</span></td><td>${inStock} ${s.unit}</td><td>${formatCurrency(inStock * rate)}</td></tr>`; }).join('') : '<tr><td colspan="4" style="text-align:center;color:#9ca3af">No stock</td></tr>'}
        </tbody></table></div></div>
    </div>
    <div class="card" style="padding:16px"><h3 style="margin-bottom:10px;font-size:14px"><i class="fas fa-receipt" style="color:#8b5cf6"></i> Recent Purchases</h3>
    <div class="table-container"><table><thead><tr><th>Date</th><th>Item</th><th>Vendor</th><th>Qty</th><th>Amount</th><th>Payment</th></tr></thead><tbody>
    ${d.purchases.filter(p => p.project === site).slice(0, 5).map(p => `<tr><td>${formatDate(p.date)}</td><td>${p.item}</td><td>${p.vendor}</td><td>${p.qty} ${p.unit}</td><td>${formatCurrency(p.amount)}</td><td>${getStatusBadge(p.payment)}</td></tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:#9ca3af">No purchases</td></tr>'}
    </tbody></table></div></div>`;
}

// Equipment Utilization Report
function renderUtilizationReport(container) {
    const assets = AppData.assets;
    const under = assets.filter(a => a.utilization < 60);
    const normal = assets.filter(a => a.utilization >= 60 && a.utilization < 80);
    const well = assets.filter(a => a.utilization >= 80 && a.utilization <= 95);
    const over = assets.filter(a => a.utilization > 95);
    const total = assets.length;
    const sorted = [...assets].sort((a, b) => a.utilization - b.utilization);

    container.innerHTML = `
    <div class="page-header"><h1>Equipment Utilization Report</h1></div>
    <div class="cards-grid" style="margin-bottom:20px">
        <div class="card"><div class="card-icon blue"><i class="fas fa-truck"></i></div><div class="card-value">${total}</div><div class="card-label">Total Machines</div></div>
        <div class="card"><div class="card-icon red"><i class="fas fa-arrow-down"></i></div><div class="card-value">${under.length}</div><div class="card-label">Underutilized (<60%)</div></div>
        <div class="card"><div class="card-icon green"><i class="fas fa-check-circle"></i></div><div class="card-value">${well.length}</div><div class="card-label">Well Utilized (80–95%)</div></div>
        <div class="card"><div class="card-icon orange"><i class="fas fa-exclamation-triangle"></i></div><div class="card-value">${over.length}</div><div class="card-label">Overutilized (>95%)</div></div>
    </div>
    <div style="margin-bottom:20px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px">
        <h3 style="margin-bottom:10px;font-size:14px">Utilization Distribution</h3>
        <div style="display:flex;height:36px;border-radius:6px;overflow:hidden;font-size:12px;font-weight:600;color:#fff">
            ${under.length ? `<div style="width:${(under.length/total*100).toFixed(1)}%;background:#ef4444;display:flex;align-items:center;justify-content:center">${under.length} Under</div>` : ''}
            ${normal.length ? `<div style="width:${(normal.length/total*100).toFixed(1)}%;background:#eab308;display:flex;align-items:center;justify-content:center">${normal.length} Normal</div>` : ''}
            ${well.length ? `<div style="width:${(well.length/total*100).toFixed(1)}%;background:#10b981;display:flex;align-items:center;justify-content:center">${well.length} Well</div>` : ''}
            ${over.length ? `<div style="width:${(over.length/total*100).toFixed(1)}%;background:#f97316;display:flex;align-items:center;justify-content:center">${over.length} Over</div>` : ''}
        </div>
        <div style="display:flex;gap:16px;margin-top:8px;font-size:12px">
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ef4444"></span> Underutilized (<60%)</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#eab308"></span> Normal (60–80%)</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#10b981"></span> Well Utilized (80–95%)</span>
            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#f97316"></span> Overutilized (>95%)</span>
        </div>
    </div>
    <div class="table-container"><table><thead><tr><th>Machine</th><th>Category</th><th>Site</th><th>Ownership</th><th>Utilization</th><th>Band</th><th>Recommendation</th></tr></thead><tbody>
    ${sorted.map(a => {
        let band, bandColor, rec;
        if (a.utilization < 60) { band = 'Underutilized'; bandColor = 'red'; rec = a.ownership === 'Hired' ? '<strong style="color:#dc2626">Release — hired & idle</strong>' : 'Consider redeploying'; }
        else if (a.utilization < 80) { band = 'Normal'; bandColor = 'yellow'; rec = 'OK'; }
        else if (a.utilization <= 95) { band = 'Well Utilized'; bandColor = 'green'; rec = 'Optimal'; }
        else { band = 'Overutilized'; bandColor = 'orange'; rec = '<strong style="color:#f97316">Hire backup</strong>'; }
        return `<tr><td><strong>${a.id}</strong> ${a.name}</td><td>${a.category}</td><td>${a.site || '-'}</td><td>${a.ownership}</td><td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px;display:inline-block"><div class="progress-bar-fill progress-${bandColor === 'red' ? 'orange' : bandColor}" style="width:${a.utilization}%"></div></div>${a.utilization}%</div></td><td><span class="badge-status badge-${bandColor}">${band}</span></td><td>${rec}</td></tr>`;
    }).join('')}
    </tbody></table></div>`;
}
