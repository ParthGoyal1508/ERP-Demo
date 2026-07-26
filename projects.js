function renderPortfolio(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Project Portfolio</h1><button class="btn btn-primary" onclick="addProject()"><i class="fas fa-plus"></i> Add Project</button></div>
    <div class="table-container"><table><thead><tr><th>Code</th><th>Name</th><th>Client</th><th>Location</th><th>Manager</th><th>Contract Value</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    ${d.projects.map(p=>`<tr><td><strong>${p.code}</strong></td><td>${p.name}</td><td>${p.client}</td><td>${p.location}</td><td>${p.manager}</td><td>${formatCurrency(p.contractValue)}</td><td>${getStatusBadge(p.status)}</td><td><button class="btn btn-sm" onclick="editProject('${p.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}
    </tbody></table></div>
    <div style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:8px;font-size:13px"><strong>Total Contract Value:</strong> ${formatCurrency(d.projects.reduce((s,p)=>s+p.contractValue,0))}</div>`;
}
function addProject(){
    const cOpts=AppData.clients.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
    openModal('Add Project',`<form id="proj-form"><div class="form-grid"><div class="form-group"><label>Code</label><input name="code" required placeholder="e.g. NH48"></div><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Client</label><select name="client">${cOpts}</select></div><div class="form-group"><label>Location</label><input name="location"></div><div class="form-group"><label>Manager</label><input name="manager"></div><div class="form-group"><label>Contract Value (₹)</label><input type="number" name="contractValue" required></div><div class="form-group"><label>Start Date</label><input type="date" name="startDate"></div><div class="form-group"><label>End Date</label><input type="date" name="endDate"></div><div class="form-group"><label>Status</label><select name="status"><option>Ongoing</option><option>Planning</option><option>On Hold</option><option>Complete</option></select></div></div></form>`,`<button class="btn btn-primary" onclick="saveProject()">Save</button>`);
}
function saveProject(){const f=document.getElementById('proj-form'),fd=new FormData(f);AppData.projects.push({id:generateId('PRJ'),code:fd.get('code'),name:fd.get('name'),client:fd.get('client'),location:fd.get('location'),manager:fd.get('manager'),contractValue:Number(fd.get('contractValue')),status:fd.get('status'),startDate:fd.get('startDate'),endDate:fd.get('endDate')});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Project added');}
function editProject(id){const p=AppData.projects.find(x=>x.id===id);if(!p)return;const cOpts=AppData.clients.map(c=>`<option value="${c.name}" ${c.name===p.client?'selected':''}>${c.name}</option>`).join('');openModal('Edit Project',`<form id="proj-form"><div class="form-grid"><div class="form-group"><label>Code</label><input name="code" value="${p.code}" required></div><div class="form-group"><label>Name</label><input name="name" value="${p.name}" required></div><div class="form-group"><label>Client</label><select name="client">${cOpts}</select></div><div class="form-group"><label>Location</label><input name="location" value="${p.location||''}"></div><div class="form-group"><label>Manager</label><input name="manager" value="${p.manager||''}"></div><div class="form-group"><label>Contract Value (₹)</label><input type="number" name="contractValue" value="${p.contractValue}" required></div><div class="form-group"><label>Status</label><select name="status"><option ${p.status==='Ongoing'?'selected':''}>Ongoing</option><option ${p.status==='Planning'?'selected':''}>Planning</option><option ${p.status==='On Hold'?'selected':''}>On Hold</option><option ${p.status==='Complete'?'selected':''}>Complete</option></select></div></div></form>`,`<button class="btn btn-primary" onclick="updateProject('${id}')">Update</button>`);
}
function updateProject(id){const p=AppData.projects.find(x=>x.id===id);if(!p)return;const fd=new FormData(document.getElementById('proj-form'));p.code=fd.get('code');p.name=fd.get('name');p.client=fd.get('client');p.location=fd.get('location');p.manager=fd.get('manager');p.contractValue=Number(fd.get('contractValue'));p.status=fd.get('status');saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Project updated');}

function renderClients(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Clients</h1><button class="btn btn-primary" onclick="addClient()"><i class="fas fa-plus"></i> Add Client</button></div>
    <div class="table-container"><table><thead><tr><th>Name</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>Projects</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    ${d.clients.map(c=>`<tr><td><strong>${c.name}</strong></td><td>${c.contactPerson}</td><td>${c.phone}</td><td>${c.email}</td><td>${c.projects}</td><td>${getStatusBadge(c.status)}</td><td><button class="btn btn-sm" onclick="editClient('${c.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-danger" onclick="deleteClient('${c.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
    </tbody></table></div>`;
}
function addClient(){openModal('Add Client',`<form id="client-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Contact Person</label><input name="contactPerson"></div><div class="form-group"><label>Phone</label><input name="phone"></div><div class="form-group"><label>Email</label><input name="email"></div><div class="form-group"><label>Address</label><input name="address"></div></div></form>`,`<button class="btn btn-primary" onclick="saveClient()">Save</button>`);}
function saveClient(){const fd=new FormData(document.getElementById('client-form'));AppData.clients.push({id:generateId('CLT'),name:fd.get('name'),contactPerson:fd.get('contactPerson'),phone:fd.get('phone'),email:fd.get('email'),address:fd.get('address'),projects:0,status:'Active'});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Client added');}
function editClient(id){const c=AppData.clients.find(x=>x.id===id);if(!c)return;openModal('Edit Client',`<form id="client-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" value="${c.name}" required></div><div class="form-group"><label>Contact Person</label><input name="contactPerson" value="${c.contactPerson||''}"></div><div class="form-group"><label>Phone</label><input name="phone" value="${c.phone||''}"></div><div class="form-group"><label>Email</label><input name="email" value="${c.email||''}"></div><div class="form-group"><label>Address</label><input name="address" value="${c.address||''}"></div></div></form>`,`<button class="btn btn-primary" onclick="updateClient('${id}')">Update</button>`);}
function updateClient(id){const c=AppData.clients.find(x=>x.id===id);if(!c)return;const fd=new FormData(document.getElementById('client-form'));c.name=fd.get('name');c.contactPerson=fd.get('contactPerson');c.phone=fd.get('phone');c.email=fd.get('email');c.address=fd.get('address');saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Client updated');}
function deleteClient(id){showConfirm('Delete Client','Are you sure?',r=>{if(r){AppData.clients=AppData.clients.filter(c=>c.id!==id);saveData(AppData);handleRoute();toast('Client deleted');}});}

function renderSites(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Sites</h1><button class="btn btn-primary" onclick="addSite()"><i class="fas fa-plus"></i> Add Site</button></div>
    <div class="table-container"><table><thead><tr><th>Name</th><th>Project</th><th>Location</th><th>Lat</th><th>Lng</th><th>Geofence (m)</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    ${d.sites.map(s=>`<tr><td><strong>${s.name}</strong></td><td>${s.project}</td><td>${s.location||'-'}</td><td>${s.lat}</td><td>${s.lng}</td><td>${s.geofenceRadius}</td><td>${getStatusBadge(s.status)}</td><td><button class="btn btn-sm" onclick="editSite('${s.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}
    </tbody></table></div>`;
}
function addSite(){const pOpts=AppData.projects.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');openModal('Add Site',`<form id="site-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Project</label><select name="project">${pOpts}</select></div><div class="form-group"><label>Location</label><input name="location"></div><div class="form-group"><label>Latitude</label><input type="number" name="lat" step="0.0001" required></div><div class="form-group"><label>Longitude</label><input type="number" name="lng" step="0.0001" required></div><div class="form-group"><label>Geofence Radius (m)</label><input type="number" name="geofenceRadius" value="500" required></div></div></form>`,`<button class="btn btn-primary" onclick="saveSite()">Save</button>`);}
function saveSite(){const fd=new FormData(document.getElementById('site-form'));AppData.sites.push({id:generateId('SITE'),name:fd.get('name'),project:fd.get('project'),location:fd.get('location'),lat:Number(fd.get('lat')),lng:Number(fd.get('lng')),geofenceRadius:Number(fd.get('geofenceRadius')),status:'Active'});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Site added');}
function editSite(id){const s=AppData.sites.find(x=>x.id===id);if(!s)return;const pOpts=AppData.projects.map(p=>`<option value="${p.name}" ${p.name===s.project?'selected':''}>${p.name}</option>`).join('');openModal('Edit Site',`<form id="site-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" value="${s.name}" required></div><div class="form-group"><label>Project</label><select name="project">${pOpts}</select></div><div class="form-group"><label>Location</label><input name="location" value="${s.location||''}"></div><div class="form-group"><label>Latitude</label><input type="number" name="lat" step="0.0001" value="${s.lat}" required></div><div class="form-group"><label>Longitude</label><input type="number" name="lng" step="0.0001" value="${s.lng}" required></div><div class="form-group"><label>Geofence Radius (m)</label><input type="number" name="geofenceRadius" value="${s.geofenceRadius}" required></div></div></form>`,`<button class="btn btn-primary" onclick="updateSite('${id}')">Update</button>`);}
function updateSite(id){const s=AppData.sites.find(x=>x.id===id);if(!s)return;const fd=new FormData(document.getElementById('site-form'));s.name=fd.get('name');s.project=fd.get('project');s.location=fd.get('location');s.lat=Number(fd.get('lat'));s.lng=Number(fd.get('lng'));s.geofenceRadius=Number(fd.get('geofenceRadius'));saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Site updated');}

// Daily Work Reports
function renderDWR(container){
    const d=AppData;
    const projOpts=d.projects.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');
    const filtered=d.dailyWorkReports||[];
    container.innerHTML=`
    <div class="page-header"><h1>Daily Work Reports</h1><button class="btn btn-primary" onclick="addDWR()"><i class="fas fa-plus"></i> Add DWR</button></div>
    <div class="filters" style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
        <select id="dwr-proj-filter" onchange="filterDWR()"><option value="">All Projects</option>${projOpts}</select>
        <select id="dwr-status-filter" onchange="filterDWR()"><option value="">All Status</option><option>Draft</option><option>Submitted</option><option>Approved</option></select>
        <input type="date" id="dwr-date-filter" onchange="filterDWR()">
    </div>
    <div class="table-container"><table><thead><tr><th>ID</th><th>Date</th><th>Project</th><th>Supervisor</th><th>Workers</th><th>Machinery</th><th>Progress %</th><th>Weather</th><th>Status</th><th>Actions</th></tr></thead><tbody id="dwr-tbody">
    ${filtered.map(r=>`<tr><td><strong>${r.id}</strong></td><td>${r.date}</td><td>${r.project}</td><td>${r.supervisor}</td><td>${r.workers}</td><td>${r.machinery}</td><td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;background:#e5e7eb;border-radius:4px;height:8px"><div style="width:${r.progress}%;background:#3b82f6;border-radius:4px;height:8px"></div></div><span style="font-size:12px">${r.progress}%</span></div></td><td>${r.weather}</td><td>${getStatusBadge(r.status==='Approved'?'Active':r.status==='Submitted'?'Pending':r.status)}</td><td><button class="btn btn-sm" onclick="viewDWR('${r.id}')"><i class="fas fa-eye"></i></button> ${r.status==='Draft'?`<button class="btn btn-sm" onclick="editDWR('${r.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-primary" onclick="submitDWR('${r.id}')"><i class="fas fa-paper-plane"></i></button>`:r.status==='Submitted'?`<button class="btn btn-sm btn-success" onclick="approveDWR('${r.id}')"><i class="fas fa-check"></i></button>`:''}</td></tr>`).join('')}
    </tbody></table></div>
    <div style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:8px;font-size:13px"><strong>Total Reports:</strong> ${filtered.length} | <strong>Approved:</strong> ${filtered.filter(r=>r.status==='Approved').length} | <strong>Pending:</strong> ${filtered.filter(r=>r.status==='Submitted').length} | <strong>Drafts:</strong> ${filtered.filter(r=>r.status==='Draft').length}</div>`;
}
function filterDWR(){
    const proj=document.getElementById('dwr-proj-filter').value;
    const stat=document.getElementById('dwr-status-filter').value;
    const dt=document.getElementById('dwr-date-filter').value;
    let rows=AppData.dailyWorkReports||[];
    if(proj)rows=rows.filter(r=>r.project===proj);
    if(stat)rows=rows.filter(r=>r.status===stat);
    if(dt)rows=rows.filter(r=>r.date===dt);
    document.getElementById('dwr-tbody').innerHTML=rows.map(r=>`<tr><td><strong>${r.id}</strong></td><td>${r.date}</td><td>${r.project}</td><td>${r.supervisor}</td><td>${r.workers}</td><td>${r.machinery}</td><td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;background:#e5e7eb;border-radius:4px;height:8px"><div style="width:${r.progress}%;background:#3b82f6;border-radius:4px;height:8px"></div></div><span style="font-size:12px">${r.progress}%</span></div></td><td>${r.weather}</td><td>${getStatusBadge(r.status==='Approved'?'Active':r.status==='Submitted'?'Pending':r.status)}</td><td><button class="btn btn-sm" onclick="viewDWR('${r.id}')"><i class="fas fa-eye"></i></button> ${r.status==='Draft'?`<button class="btn btn-sm" onclick="editDWR('${r.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-primary" onclick="submitDWR('${r.id}')"><i class="fas fa-paper-plane"></i></button>`:r.status==='Submitted'?`<button class="btn btn-sm btn-success" onclick="approveDWR('${r.id}')"><i class="fas fa-check"></i></button>`:''}</td></tr>`).join('');
}
function addDWR(){
    const projOpts=AppData.projects.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');
    openModal('New Daily Work Report',`<form id="dwr-form"><div class="form-grid">
        <div class="form-group"><label>Date</label><input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></div>
        <div class="form-group"><label>Project</label><select name="project" required>${projOpts}</select></div>
        <div class="form-group"><label>Supervisor</label><input name="supervisor" required></div>
        <div class="form-group"><label>No. of Workers</label><input type="number" name="workers" required></div>
        <div class="form-group"><label>No. of Machinery</label><input type="number" name="machinery" required></div>
        <div class="form-group"><label>Progress %</label><input type="number" name="progress" min="0" max="100" required></div>
        <div class="form-group"><label>Weather</label><select name="weather"><option>Clear</option><option>Rainy</option><option>Overcast</option><option>Hot</option></select></div>
    </div>
    <div class="form-group" style="margin-top:10px"><label>Work Description</label><textarea name="description" rows="3" style="width:100%" required></textarea></div>
    <div class="form-group"><label>Materials Used</label><textarea name="materials" rows="2" style="width:100%"></textarea></div>
    <div class="form-group"><label>Issues / Delays</label><textarea name="issues" rows="2" style="width:100%"></textarea></div></form>`,
    `<button class="btn" onclick="saveDWR('Draft')">Save as Draft</button> <button class="btn btn-primary" onclick="saveDWR('Submitted')">Submit</button>`);
}
function saveDWR(status){
    const fd=new FormData(document.getElementById('dwr-form'));
    if(!AppData.dailyWorkReports)AppData.dailyWorkReports=[];
    AppData.dailyWorkReports.push({id:generateId('DWR'),date:fd.get('date'),project:fd.get('project'),supervisor:fd.get('supervisor'),workers:Number(fd.get('workers')),machinery:Number(fd.get('machinery')),progress:Number(fd.get('progress')),weather:fd.get('weather'),description:fd.get('description'),materials:fd.get('materials'),issues:fd.get('issues'),status:status});
    saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('DWR saved');
}
function editDWR(id){
    const r=(AppData.dailyWorkReports||[]).find(x=>x.id===id);if(!r)return;
    const projOpts=AppData.projects.map(p=>`<option value="${p.name}" ${p.name===r.project?'selected':''}>${p.name}</option>`).join('');
    openModal('Edit DWR — '+r.id,`<form id="dwr-form"><div class="form-grid">
        <div class="form-group"><label>Date</label><input type="date" name="date" value="${r.date}" required></div>
        <div class="form-group"><label>Project</label><select name="project" required>${projOpts}</select></div>
        <div class="form-group"><label>Supervisor</label><input name="supervisor" value="${r.supervisor}" required></div>
        <div class="form-group"><label>No. of Workers</label><input type="number" name="workers" value="${r.workers}" required></div>
        <div class="form-group"><label>No. of Machinery</label><input type="number" name="machinery" value="${r.machinery}" required></div>
        <div class="form-group"><label>Progress %</label><input type="number" name="progress" min="0" max="100" value="${r.progress}" required></div>
        <div class="form-group"><label>Weather</label><select name="weather"><option ${r.weather==='Clear'?'selected':''}>Clear</option><option ${r.weather==='Rainy'?'selected':''}>Rainy</option><option ${r.weather==='Overcast'?'selected':''}>Overcast</option><option ${r.weather==='Hot'?'selected':''}>Hot</option></select></div>
    </div>
    <div class="form-group" style="margin-top:10px"><label>Work Description</label><textarea name="description" rows="3" style="width:100%" required>${r.description}</textarea></div>
    <div class="form-group"><label>Materials Used</label><textarea name="materials" rows="2" style="width:100%">${r.materials||''}</textarea></div>
    <div class="form-group"><label>Issues / Delays</label><textarea name="issues" rows="2" style="width:100%">${r.issues||''}</textarea></div></form>`,
    `<button class="btn btn-primary" onclick="updateDWR('${id}')">Update</button>`);
}
function updateDWR(id){
    const r=(AppData.dailyWorkReports||[]).find(x=>x.id===id);if(!r)return;
    const fd=new FormData(document.getElementById('dwr-form'));
    r.date=fd.get('date');r.project=fd.get('project');r.supervisor=fd.get('supervisor');r.workers=Number(fd.get('workers'));r.machinery=Number(fd.get('machinery'));r.progress=Number(fd.get('progress'));r.weather=fd.get('weather');r.description=fd.get('description');r.materials=fd.get('materials');r.issues=fd.get('issues');
    saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('DWR updated');
}
function viewDWR(id){
    const r=(AppData.dailyWorkReports||[]).find(x=>x.id===id);if(!r)return;
    openModal('DWR — '+r.id+' ('+r.date+')',`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div><strong>Project:</strong> ${r.project}</div><div><strong>Supervisor:</strong> ${r.supervisor}</div>
        <div><strong>Weather:</strong> ${r.weather}</div><div><strong>Status:</strong> ${r.status}</div>
        <div><strong>Workers:</strong> ${r.workers}</div><div><strong>Machinery:</strong> ${r.machinery}</div>
        <div><strong>Progress:</strong> ${r.progress}%</div>
    </div>
    <div style="margin-bottom:12px"><strong>Work Description:</strong><p style="margin:4px 0;padding:8px;background:#f9fafb;border-radius:6px">${r.description}</p></div>
    ${r.materials?`<div style="margin-bottom:12px"><strong>Materials Used:</strong><p style="margin:4px 0;padding:8px;background:#f9fafb;border-radius:6px">${r.materials}</p></div>`:''}
    ${r.issues?`<div style="margin-bottom:12px"><strong>Issues / Delays:</strong><p style="margin:4px 0;padding:8px;background:#fef2f2;border-radius:6px;color:#dc2626">${r.issues}</p></div>`:''}`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Close</button>`);
}
function submitDWR(id){const r=(AppData.dailyWorkReports||[]).find(x=>x.id===id);if(!r)return;r.status='Submitted';saveData(AppData);handleRoute();toast('DWR submitted for approval');}
function approveDWR(id){showConfirm('Approve DWR','Mark this report as approved?',ok=>{if(ok){const r=(AppData.dailyWorkReports||[]).find(x=>x.id===id);if(r){r.status='Approved';saveData(AppData);handleRoute();toast('DWR approved');}}});}

// Project P&L
function renderProjectPnL(container){
    const d=AppData;
    const pnlData=d.projectPnL||{};
    const projNames=Object.keys(pnlData);
    const selected=projNames[0]||'';
    const projOpts=projNames.map(p=>`<option value="${p}">${p}</option>`).join('');
    container.innerHTML=`
    <div class="page-header"><h1>Project P&L</h1></div>
    <div style="margin-bottom:16px"><select id="pnl-proj-select" onchange="renderPnLDetail()" style="padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:14px">${projOpts}</select></div>
    <div id="pnl-detail"></div>`;
    if(selected)renderPnLDetail();
}
function renderPnLDetail(){
    const projName=document.getElementById('pnl-proj-select').value;
    const pnl=(AppData.projectPnL||{})[projName];
    if(!pnl){document.getElementById('pnl-detail').innerHTML='<p>No data available</p>';return;}
    const totalBudget=Object.values(pnl.budget).reduce((s,v)=>s+v,0);
    const totalActual=Object.values(pnl.actual).reduce((s,v)=>s+v,0);
    const totalRevenue=pnl.revenue.reduce((s,r)=>s+r.amount,0);
    const receivedRevenue=pnl.revenue.filter(r=>r.status==='Received').reduce((s,r)=>s+r.amount,0);
    const profit=totalRevenue-totalActual;
    const margin=totalRevenue>0?((profit/totalRevenue)*100).toFixed(1):0;
    const budgetUtil=totalBudget>0?((totalActual/totalBudget)*100).toFixed(1):0;
    document.getElementById('pnl-detail').innerHTML=`
    <div class="cards-grid" style="margin-bottom:20px">
        <div class="card"><div class="card-icon blue"><i class="fas fa-file-invoice-dollar"></i></div><div class="card-value">${formatCurrency(totalBudget)}</div><div class="card-label">Total Budget</div></div>
        <div class="card"><div class="card-icon orange"><i class="fas fa-money-bill-trend-up"></i></div><div class="card-value">${formatCurrency(totalActual)}</div><div class="card-label">Actual Spend</div></div>
        <div class="card"><div class="card-icon green"><i class="fas fa-receipt"></i></div><div class="card-value">${formatCurrency(totalRevenue)}</div><div class="card-label">Total Revenue</div></div>
        <div class="card"><div class="card-icon ${profit>=0?'green':'red'}"><i class="fas fa-${profit>=0?'arrow-trend-up':'arrow-trend-down'}"></i></div><div class="card-value" style="color:${profit>=0?'#16a34a':'#dc2626'}">${formatCurrency(profit)}</div><div class="card-label">Profit / Loss</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="table-container"><h3 style="margin-bottom:10px">Cost Breakdown</h3><table><thead><tr><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th></tr></thead><tbody>
        ${['labour','materials','machinery','subcontractors','overheads'].map(cat=>{const b=pnl.budget[cat]||0;const a=pnl.actual[cat]||0;const v=b-a;return `<tr><td style="text-transform:capitalize">${cat}</td><td>${formatCurrency(b)}</td><td>${formatCurrency(a)}</td><td style="color:${v>=0?'#16a34a':'#dc2626'}">${formatCurrency(v)}</td></tr>`;}).join('')}
        <tr style="font-weight:bold;border-top:2px solid #e5e7eb"><td>Total</td><td>${formatCurrency(totalBudget)}</td><td>${formatCurrency(totalActual)}</td><td style="color:${totalBudget-totalActual>=0?'#16a34a':'#dc2626'}">${formatCurrency(totalBudget-totalActual)}</td></tr>
        </tbody></table></div>
        <div class="table-container"><h3 style="margin-bottom:10px">Revenue (RA Bills)</h3><table><thead><tr><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>
        ${pnl.revenue.map(r=>`<tr><td>${r.description}</td><td>${formatCurrency(r.amount)}</td><td>${r.date}</td><td>${getStatusBadge(r.status==='Received'?'Active':'Pending')}</td></tr>`).join('')}
        <tr style="font-weight:bold;border-top:2px solid #e5e7eb"><td>Total</td><td>${formatCurrency(totalRevenue)}</td><td></td><td></td></tr>
        </tbody></table></div>
    </div>
    <div style="margin-top:20px;padding:16px;background:#f0f9ff;border-radius:8px">
        <h3 style="margin-bottom:10px">P&L Summary</h3>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:14px">
            <div><strong>Budget Utilisation:</strong><br>${budgetUtil}%</div>
            <div><strong>Revenue Received:</strong><br>${formatCurrency(receivedRevenue)}</div>
            <div><strong>Net Margin:</strong><br><span style="color:${margin>=0?'#16a34a':'#dc2626'}">${margin}%</span></div>
            <div><strong>Pending Bills:</strong><br>${formatCurrency(totalRevenue-receivedRevenue)}</div>
        </div>
    </div>`;
}
