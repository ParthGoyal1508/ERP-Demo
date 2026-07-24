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
