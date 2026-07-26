function renderVendors(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Vendors</h1><button class="btn btn-primary" onclick="addVendor()"><i class="fas fa-plus"></i> Add Vendor</button></div>
    <div class="table-container"><table><thead><tr><th>Name</th><th>City</th><th>Deals In</th><th>Type</th><th>GSTIN</th><th>TDS</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    ${d.vendors.map(v=>`<tr><td><strong>${v.name}</strong></td><td>${v.city||'-'}</td><td>${v.dealsIn}</td><td>${v.type}</td><td style="font-size:11px">${v.gstin||'-'}</td><td>${v.tds||'-'}</td><td>${getStatusBadge(v.active?'Active':'Inactive')}</td><td><button class="btn btn-sm" onclick="editVendor('${v.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}
    </tbody></table></div>`;
}
function addVendor(){openModal('Add Vendor',`<form id="vendor-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>City</label><input name="city"></div><div class="form-group"><label>Deals In</label><input name="dealsIn" required></div><div class="form-group"><label>Type</label><select name="type"><option>Material</option><option>Fuel</option><option>Hire</option><option>Service</option><option>Transport</option></select></div><div class="form-group"><label>GSTIN</label><input name="gstin"></div><div class="form-group"><label>TDS</label><input name="tds" placeholder="e.g. 2% (194C)"></div></div></form>`,`<button class="btn btn-primary" onclick="saveVendor()">Save</button>`);}
function saveVendor(){const fd=new FormData(document.getElementById('vendor-form'));AppData.vendors.push({id:generateId('VEN'),name:fd.get('name'),city:fd.get('city'),dealsIn:fd.get('dealsIn'),type:fd.get('type'),gstin:fd.get('gstin'),tds:fd.get('tds'),active:true});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Vendor added');}
function editVendor(id){const v=AppData.vendors.find(x=>x.id===id);if(!v)return;openModal('Edit Vendor',`<form id="vendor-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" value="${v.name}" required></div><div class="form-group"><label>City</label><input name="city" value="${v.city||''}"></div><div class="form-group"><label>Deals In</label><input name="dealsIn" value="${v.dealsIn}" required></div><div class="form-group"><label>Type</label><select name="type"><option ${v.type==='Material'?'selected':''}>Material</option><option ${v.type==='Fuel'?'selected':''}>Fuel</option><option ${v.type==='Hire'?'selected':''}>Hire</option><option ${v.type==='Service'?'selected':''}>Service</option><option ${v.type==='Transport'?'selected':''}>Transport</option></select></div><div class="form-group"><label>GSTIN</label><input name="gstin" value="${v.gstin||''}"></div><div class="form-group"><label>TDS</label><input name="tds" value="${v.tds||''}"></div></div></form>`,`<button class="btn btn-primary" onclick="updateVendor('${id}')">Update</button>`);}
function updateVendor(id){const v=AppData.vendors.find(x=>x.id===id);if(!v)return;const fd=new FormData(document.getElementById('vendor-form'));v.name=fd.get('name');v.city=fd.get('city');v.dealsIn=fd.get('dealsIn');v.type=fd.get('type');v.gstin=fd.get('gstin');v.tds=fd.get('tds');saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Vendor updated');}

function renderContractors(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Contractor Vault</h1><button class="btn btn-primary" onclick="addContractor()"><i class="fas fa-plus"></i> Add Contractor</button></div>
    <div class="table-container"><table><thead><tr><th>Name</th><th>Contact</th><th>License No</th><th>PF Reg</th><th>ESIC Reg</th><th>Insurance</th><th>BOCW Reg</th><th>Compliance</th></tr></thead><tbody>
    ${d.contractors.map(c=>`<tr><td><strong>${c.name}</strong></td><td>${c.contact}</td><td>${c.licenseNo}</td><td>${c.pfReg}</td><td>${c.esicReg}</td><td>${getStatusBadge(c.insurance)}</td><td>${c.bocwReg}</td><td>${getStatusBadge(c.complianceStatus)}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addContractor(){openModal('Add Contractor',`<form id="con-form"><div class="form-grid"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Contact</label><input name="contact"></div><div class="form-group"><label>License No</label><input name="licenseNo"></div><div class="form-group"><label>PF Reg</label><input name="pfReg"></div><div class="form-group"><label>ESIC Reg</label><input name="esicReg"></div><div class="form-group"><label>Insurance</label><select name="insurance"><option>Valid</option><option>Expired</option><option>Pending</option></select></div><div class="form-group"><label>BOCW Reg</label><input name="bocwReg"></div></div></form>`,`<button class="btn btn-primary" onclick="saveContractor()">Save</button>`);}
function saveContractor(){const fd=new FormData(document.getElementById('con-form'));AppData.contractors.push({id:generateId('CON'),name:fd.get('name'),contact:fd.get('contact'),licenseNo:fd.get('licenseNo'),pfReg:fd.get('pfReg'),esicReg:fd.get('esicReg'),insurance:fd.get('insurance'),bocwReg:fd.get('bocwReg'),complianceStatus:'Pending'});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Contractor added');}

function renderRAGMatrix(container){
    const d=AppData;
    const months=['Apr 2026','May 2026','Jun 2026','Jul 2026'];
    const colorMap={red:'#ef4444',yellow:'#f59e0b',green:'#10b981'};
    container.innerHTML=`
    <div class="page-header"><h1>RAG Matrix</h1></div>
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px">Monthly compliance status for each contractor. <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10b981"></span> Compliant <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b"></span> Partial <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444"></span> Non-compliant</p>
    <div class="table-container"><table><thead><tr><th>Contractor</th>${months.map(m=>`<th style="text-align:center">${m}</th>`).join('')}</tr></thead><tbody>
    ${d.ragMatrix.map(r=>`<tr><td><strong>${r.contractor}</strong></td>${months.map(m=>`<td style="text-align:center"><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${colorMap[r.months[m]]||'#d1d5db'}"></span></td>`).join('')}</tr>`).join('')}
    </tbody></table></div>`;
}

function renderBOCW(container){
    const d=AppData;
    const totalLiab=d.bocwCess.reduce((s,b)=>s+b.cessLiability,0),totalPaid=d.bocwCess.reduce((s,b)=>s+b.paid,0);
    container.innerHTML=`
    <div class="page-header"><h1>BOCW Cess</h1></div>
    <div class="cards-grid" style="margin-bottom:16px">
        <div class="card" style="padding:12px;text-align:center"><div class="card-value">${formatCurrency(totalLiab)}</div><div class="card-label">Total Liability (1%)</div></div>
        <div class="card" style="padding:12px;text-align:center"><div class="card-value" style="color:#10b981">${formatCurrency(totalPaid)}</div><div class="card-label">Paid</div></div>
        <div class="card" style="padding:12px;text-align:center"><div class="card-value" style="color:#ef4444">${formatCurrency(totalLiab-totalPaid)}</div><div class="card-label">Balance</div></div>
    </div>
    <div class="table-container"><table><thead><tr><th>Project</th><th>Contract Value</th><th>Cess Rate</th><th>Cess Liability</th><th>Paid</th><th>Balance</th><th>Last Payment</th><th>Status</th></tr></thead><tbody>
    ${d.bocwCess.map(b=>`<tr><td>${b.project}</td><td>${formatCurrency(b.contractValue)}</td><td>${b.cessRate}%</td><td>${formatCurrency(b.cessLiability)}</td><td>${formatCurrency(b.paid)}</td><td>${formatCurrency(b.balance)}</td><td>${b.lastPayment||'-'}</td><td>${getStatusBadge(b.status)}</td></tr>`).join('')}
    </tbody></table></div>`;
}

// Vendor Categories
function renderVendorCategories(container) {
    const cats = AppData.vendorCategories || [];
    container.innerHTML = `
    <div class="page-header"><h1>Vendor Categories</h1><button class="btn btn-primary" onclick="addVendorCategory()"><i class="fas fa-plus"></i> Add Category</button></div>
    <div class="table-container"><table><thead><tr><th>#</th><th>Category</th><th>Description</th><th>Vendors</th><th>Actions</th></tr></thead><tbody>
    ${cats.map((c, i) => {
        const count = (AppData.vendors || []).filter(v => v.type === c.name).length;
        return `<tr><td>${i + 1}</td><td><strong>${c.name}</strong></td><td>${c.description || '-'}</td><td>${count}</td><td><button class="btn btn-sm" onclick="editVendorCategory('${c.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-danger" onclick="deleteVendorCategory('${c.id}')"><i class="fas fa-trash"></i></button></td></tr>`;
    }).join('')}
    </tbody></table></div>
    <div style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:8px;font-size:13px">
        <strong>Usage:</strong> Vendor categories populate the "Type" dropdown when adding/editing vendors. Each vendor is assigned one primary category.
    </div>`;
}
function addVendorCategory() {
    openModal('Add Vendor Category', `<form id="vcat-form"><div class="form-grid">
        <div class="form-group"><label>Name</label><input name="name" required placeholder="e.g. Transport"></div>
        <div class="form-group"><label>Description</label><input name="description" placeholder="Brief description"></div>
    </div></form>`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-primary" onclick="saveVendorCategory()">Save</button>`);
}
function saveVendorCategory() {
    const fd = new FormData(document.getElementById('vcat-form'));
    const name = fd.get('name').trim();
    if (!name) { toast('Name is required', 'error'); return; }
    if (!AppData.vendorCategories) AppData.vendorCategories = [];
    AppData.vendorCategories.push({ id: generateId('VC'), name: name, description: fd.get('description') });
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); handleRoute(); toast('Category added');
}
function editVendorCategory(id) {
    const c = (AppData.vendorCategories || []).find(x => x.id === id);
    if (!c) return;
    openModal('Edit Vendor Category', `<form id="vcat-form"><div class="form-grid">
        <div class="form-group"><label>Name</label><input name="name" value="${c.name}" required></div>
        <div class="form-group"><label>Description</label><input name="description" value="${c.description || ''}"></div>
    </div></form>`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-primary" onclick="updateVendorCategory('${id}')">Update</button>`);
}
function updateVendorCategory(id) {
    const c = (AppData.vendorCategories || []).find(x => x.id === id);
    if (!c) return;
    const fd = new FormData(document.getElementById('vcat-form'));
    c.name = fd.get('name').trim();
    c.description = fd.get('description');
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); handleRoute(); toast('Category updated');
}
function deleteVendorCategory(id) {
    showConfirm('Delete Category', 'Are you sure? This will not affect existing vendors.', function(r) {
        if (r) { AppData.vendorCategories = (AppData.vendorCategories || []).filter(c => c.id !== id); saveData(AppData); handleRoute(); toast('Category deleted'); }
    });
}

// Contractor Monthly Compliance
function renderContractorCompliance(container) {
    const comps = AppData.contractorCompliance || [];
    const conOpts = AppData.contractors.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    container.innerHTML = `
    <div class="page-header"><h1>Monthly Compliance Submissions</h1><button class="btn btn-primary" onclick="addComplianceSubmission()"><i class="fas fa-plus"></i> Record Submission</button></div>
    <div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
        <select id="comp-contractor-filter" onchange="filterCompliance()"><option value="">All Contractors</option>${conOpts}</select>
        <select id="comp-status-filter" onchange="filterCompliance()"><option value="">All Status</option><option>Verified</option><option>Partial</option><option>Missing</option></select>
        <input type="month" id="comp-month-filter" onchange="filterCompliance()" title="Filter by month">
    </div>
    <div class="table-container"><table><thead><tr><th>Contractor</th><th>Month</th><th>PF Challan</th><th>PF Amount</th><th>PF Date</th><th>ESIC Challan</th><th>ESIC Amount</th><th>ESIC Date</th><th>Status</th><th>Actions</th></tr></thead><tbody id="compliance-tbody">
    ${comps.map(c => renderComplianceRow(c)).join('')}
    </tbody></table></div>`;
}
function renderComplianceRow(c) {
    const statusColor = c.status === 'Verified' ? 'Active' : c.status === 'Missing' ? 'Inactive' : 'Pending';
    return `<tr><td><strong>${c.contractor}</strong></td><td>${c.month}</td><td>${c.pfChallan || '<span style="color:#dc2626">Not submitted</span>'}</td><td>${c.pfAmount ? formatCurrency(c.pfAmount) : '-'}</td><td>${c.pfDate || '-'}</td><td>${c.esicChallan || '<span style="color:#dc2626">Not submitted</span>'}</td><td>${c.esicAmount ? formatCurrency(c.esicAmount) : '-'}</td><td>${c.esicDate || '-'}</td><td>${getStatusBadge(statusColor)}</td><td><button class="btn btn-sm" onclick="editComplianceSubmission('${c.id}')"><i class="fas fa-edit"></i></button> ${c.status !== 'Verified' ? `<button class="btn btn-sm btn-success" onclick="verifyCompliance('${c.id}')"><i class="fas fa-check"></i> Verify</button>` : ''}</td></tr>`;
}
function filterCompliance() {
    const con = document.getElementById('comp-contractor-filter').value;
    const stat = document.getElementById('comp-status-filter').value;
    const month = document.getElementById('comp-month-filter').value;
    let rows = AppData.contractorCompliance || [];
    if (con) rows = rows.filter(c => c.contractorId === con);
    if (stat) rows = rows.filter(c => c.status === stat);
    if (month) {
        const [y, m] = month.split('-');
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const label = monthNames[parseInt(m)-1] + ' ' + y;
        rows = rows.filter(c => c.month === label);
    }
    document.getElementById('compliance-tbody').innerHTML = rows.map(c => renderComplianceRow(c)).join('');
}
function addComplianceSubmission() {
    const conOpts = AppData.contractors.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const months = ['Apr 2026','May 2026','Jun 2026','Jul 2026','Aug 2026','Sep 2026','Oct 2026','Nov 2026','Dec 2026','Jan 2027','Feb 2027','Mar 2027'];
    const mOpts = months.map(m => `<option value="${m}">${m}</option>`).join('');
    openModal('Record Compliance Submission', `<form id="comp-form"><div class="form-grid">
        <div class="form-group"><label>Contractor</label><select name="contractorId" required>${conOpts}</select></div>
        <div class="form-group"><label>Month</label><select name="month" required>${mOpts}</select></div>
        <div class="form-group"><label>PF Challan No.</label><input name="pfChallan"></div>
        <div class="form-group"><label>PF Amount (₹)</label><input type="number" name="pfAmount"></div>
        <div class="form-group"><label>PF Payment Date</label><input type="date" name="pfDate"></div>
        <div class="form-group"><label>ESIC Challan No.</label><input name="esicChallan"></div>
        <div class="form-group"><label>ESIC Amount (₹)</label><input type="number" name="esicAmount"></div>
        <div class="form-group"><label>ESIC Payment Date</label><input type="date" name="esicDate"></div>
    </div></form>`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-primary" onclick="saveComplianceSubmission()">Save</button>`);
}
function saveComplianceSubmission() {
    const fd = new FormData(document.getElementById('comp-form'));
    const conId = fd.get('contractorId');
    const con = AppData.contractors.find(c => c.id === conId);
    if (!AppData.contractorCompliance) AppData.contractorCompliance = [];
    const pfOk = fd.get('pfChallan') && fd.get('pfDate');
    const esicOk = fd.get('esicChallan') && fd.get('esicDate');
    const status = (pfOk && esicOk) ? 'Submitted' : (pfOk || esicOk) ? 'Partial' : 'Missing';
    AppData.contractorCompliance.push({
        id: generateId('CC'), contractorId: conId, contractor: con ? con.name : conId,
        month: fd.get('month'), pfChallan: fd.get('pfChallan'), pfAmount: Number(fd.get('pfAmount')) || 0,
        pfDate: fd.get('pfDate'), esicChallan: fd.get('esicChallan'), esicAmount: Number(fd.get('esicAmount')) || 0,
        esicDate: fd.get('esicDate'), status: status, verifiedBy: '', verifiedOn: ''
    });
    updateRAGFromCompliance(conId, fd.get('month'), status);
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); handleRoute(); toast('Submission recorded');
}
function editComplianceSubmission(id) {
    const c = (AppData.contractorCompliance || []).find(x => x.id === id);
    if (!c) return;
    const conOpts = AppData.contractors.map(con => `<option value="${con.id}" ${con.id === c.contractorId ? 'selected' : ''}>${con.name}</option>`).join('');
    openModal('Edit Compliance — ' + c.month, `<form id="comp-form"><div class="form-grid">
        <div class="form-group"><label>Contractor</label><select name="contractorId" required>${conOpts}</select></div>
        <div class="form-group"><label>Month</label><input name="month" value="${c.month}" readonly></div>
        <div class="form-group"><label>PF Challan No.</label><input name="pfChallan" value="${c.pfChallan || ''}"></div>
        <div class="form-group"><label>PF Amount (₹)</label><input type="number" name="pfAmount" value="${c.pfAmount || ''}"></div>
        <div class="form-group"><label>PF Payment Date</label><input type="date" name="pfDate" value="${c.pfDate || ''}"></div>
        <div class="form-group"><label>ESIC Challan No.</label><input name="esicChallan" value="${c.esicChallan || ''}"></div>
        <div class="form-group"><label>ESIC Amount (₹)</label><input type="number" name="esicAmount" value="${c.esicAmount || ''}"></div>
        <div class="form-group"><label>ESIC Payment Date</label><input type="date" name="esicDate" value="${c.esicDate || ''}"></div>
    </div></form>`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-primary" onclick="updateComplianceSubmission('${id}')">Update</button>`);
}
function updateComplianceSubmission(id) {
    const c = (AppData.contractorCompliance || []).find(x => x.id === id);
    if (!c) return;
    const fd = new FormData(document.getElementById('comp-form'));
    c.contractorId = fd.get('contractorId');
    const con = AppData.contractors.find(x => x.id === c.contractorId);
    c.contractor = con ? con.name : c.contractorId;
    c.pfChallan = fd.get('pfChallan'); c.pfAmount = Number(fd.get('pfAmount')) || 0; c.pfDate = fd.get('pfDate');
    c.esicChallan = fd.get('esicChallan'); c.esicAmount = Number(fd.get('esicAmount')) || 0; c.esicDate = fd.get('esicDate');
    const pfOk = c.pfChallan && c.pfDate;
    const esicOk = c.esicChallan && c.esicDate;
    if (c.status !== 'Verified') c.status = (pfOk && esicOk) ? 'Submitted' : (pfOk || esicOk) ? 'Partial' : 'Missing';
    updateRAGFromCompliance(c.contractorId, c.month, c.status);
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); handleRoute(); toast('Submission updated');
}
function verifyCompliance(id) {
    showConfirm('Verify Submission', 'Mark this compliance submission as verified?', function(r) {
        if (r) {
            const c = (AppData.contractorCompliance || []).find(x => x.id === id);
            if (c) {
                c.status = 'Verified'; c.verifiedBy = 'Admin'; c.verifiedOn = new Date().toISOString().split('T')[0];
                updateRAGFromCompliance(c.contractorId, c.month, 'Verified');
                saveData(AppData); handleRoute(); toast('Submission verified');
            }
        }
    });
}
function updateRAGFromCompliance(contractorId, month, status) {
    let rag = AppData.ragMatrix.find(r => r.contractorId === contractorId);
    if (!rag) {
        const con = AppData.contractors.find(c => c.id === contractorId);
        rag = { contractorId: contractorId, contractor: con ? con.name : contractorId, months: {} };
        AppData.ragMatrix.push(rag);
    }
    if (status === 'Verified') rag.months[month] = 'green';
    else if (status === 'Submitted' || status === 'Partial') rag.months[month] = 'yellow';
    else rag.months[month] = 'red';
}