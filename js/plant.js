function renderAssetRegister(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Asset Register</h1><button class="btn btn-primary" onclick="addAsset()"><i class="fas fa-plus"></i> Add Asset</button></div>
    <div class="table-toolbar">
        <div class="search-box"><i class="fas fa-search"></i><input type="text" placeholder="Search assets..." onkeyup="filterAssets(this.value)"></div>
        <select id="filter-asset-status" onchange="filterAssets('')"><option value="">All Status</option><option value="Active">Active</option><option value="Under Maintenance">Under Maintenance</option><option value="Inactive">Inactive</option></select>
        <select id="filter-asset-class" onchange="filterAssets('')"><option value="">All Classes</option><option value="Plant">Plant</option><option value="Equipment">Equipment</option><option value="Vehicle">Vehicle</option></select>
    </div>
    <div class="table-container"><table id="assets-table"><thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Category</th><th>Ownership</th><th>Status</th><th>Site</th><th>Reading</th><th>Utilization</th><th>Flags</th></tr></thead><tbody>
    ${d.assets.map(a=>`<tr><td>${a.id}</td><td>${a.name}</td><td>${a.class}</td><td>${a.category}</td><td>${a.ownership}</td><td>${getStatusBadge(a.status)}</td><td>${a.site||'-'}</td><td>${a.reading||'-'}</td><td><div class="progress-bar" style="width:80px;display:inline-block"><div class="progress-bar-fill ${a.utilization>80?'progress-green':a.utilization>60?'progress-yellow':'progress-orange'}" style="width:${a.utilization}%"></div></div> <span style="font-size:11px">${a.utilization}%</span></td><td>${a.flags?`<span class="badge-status badge-red">${a.flags}</span>`:'-'}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function filterAssets(q){
    const s=document.getElementById('filter-asset-status').value,c=document.getElementById('filter-asset-class').value;
    let rows=AppData.assets;
    if(s)rows=rows.filter(a=>a.status===s);
    if(c)rows=rows.filter(a=>a.class===c);
    if(q)rows=rows.filter(a=>(a.id+a.name+a.category).toLowerCase().includes(q.toLowerCase()));
    document.querySelector('#assets-table tbody').innerHTML=rows.map(a=>`<tr><td>${a.id}</td><td>${a.name}</td><td>${a.class}</td><td>${a.category}</td><td>${a.ownership}</td><td>${getStatusBadge(a.status)}</td><td>${a.site||'-'}</td><td>${a.reading||'-'}</td><td><div class="progress-bar" style="width:80px;display:inline-block"><div class="progress-bar-fill ${a.utilization>80?'progress-green':a.utilization>60?'progress-yellow':'progress-orange'}" style="width:${a.utilization}%"></div></div> <span style="font-size:11px">${a.utilization}%</span></td><td>${a.flags?`<span class="badge-status badge-red">${a.flags}</span>`:'-'}</td></tr>`).join('');
}
function addAsset(){
    const cats=AppData.equipmentCategories.map(c=>`<option value="${c.category}">${c.category}</option>`).join('');
    openModal('Add Asset',`<form id="asset-form"><div class="form-grid"><div class="form-group"><label>ID</label><input name="id" required></div><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Class</label><select name="class"><option>Plant</option><option>Equipment</option><option>Vehicle</option></select></div><div class="form-group"><label>Category</label><select name="category">${cats}</select></div><div class="form-group"><label>Ownership</label><select name="ownership"><option>Owned</option><option>Hired</option></select></div><div class="form-group"><label>Site</label><input name="site"></div></div></form>`,`<button class="btn btn-primary" onclick="saveAsset()">Save</button>`);
}
function saveAsset(){const f=document.getElementById('asset-form'),fd=new FormData(f);const a={id:fd.get('id'),name:fd.get('name'),class:fd.get('class'),category:fd.get('category'),ownership:fd.get('ownership'),status:'Active',site:fd.get('site'),reading:'',utilization:0,flags:0};AppData.assets.push(a);saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Asset added');}

function renderLogbook(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Logbook</h1><button class="btn btn-primary" onclick="addLogEntry()"><i class="fas fa-plus"></i> Add Entry</button></div>
    <div class="table-container"><table><thead><tr><th>Date</th><th>Machine</th><th>Site</th><th>Operator</th><th>Opening</th><th>Closing</th><th>Total Hrs</th><th>Fuel (L)</th><th>Remarks</th></tr></thead><tbody>
    ${d.logbook.map(l=>`<tr><td>${l.date}</td><td>${l.machine}</td><td>${l.site}</td><td>${l.operator||'-'}</td><td>${l.opening}</td><td>${l.closing}</td><td>${l.totalHrs}</td><td>${l.fuel}</td><td>${l.remarks||'-'}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addLogEntry(){
    const mOpts=AppData.assets.map(a=>`<option value="${a.id}">${a.id} ${a.name}</option>`).join('');
    openModal('Add Logbook Entry',`<form id="log-form"><div class="form-grid"><div class="form-group"><label>Date</label><input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></div><div class="form-group"><label>Machine</label><select name="machine">${mOpts}</select></div><div class="form-group"><label>Site</label><input name="site" value="NH-48 O&M"></div><div class="form-group"><label>Operator</label><input name="operator"></div><div class="form-group"><label>Opening</label><input type="number" name="opening" required></div><div class="form-group"><label>Closing</label><input type="number" name="closing" required></div><div class="form-group"><label>Fuel (L)</label><input type="number" name="fuel"></div><div class="form-group"><label>Remarks</label><input name="remarks"></div></div></form>`,`<button class="btn btn-primary" onclick="saveLogEntry()">Save</button>`);
}
function saveLogEntry(){const f=document.getElementById('log-form'),fd=new FormData(f);const m=AppData.assets.find(a=>a.id===fd.get('machine'));const e={id:generateId('LB'),date:fd.get('date'),machineId:fd.get('machine'),machine:fd.get('machine')+' '+(m?m.name:''),site:fd.get('site'),operator:fd.get('operator'),opening:Number(fd.get('opening')),closing:Number(fd.get('closing')),totalHrs:Number(fd.get('closing'))-Number(fd.get('opening')),fuel:Number(fd.get('fuel')),remarks:fd.get('remarks')};AppData.logbook.unshift(e);saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Logbook entry added');}

function renderMachineryFuel(container){
    const d=AppData,totalQty=d.machineryFuel.reduce((s,f)=>s+f.quantity,0),totalAmt=d.machineryFuel.reduce((s,f)=>s+f.amount,0);
    container.innerHTML=`
    <div class="page-header"><h1>Fuel Entries</h1><button class="btn btn-primary" onclick="addFuelEntry()"><i class="fas fa-plus"></i> Add Entry</button></div>
    <div class="cards-grid" style="margin-bottom:16px"><div class="card" style="padding:12px;text-align:center"><div class="card-value">${totalQty} L</div><div class="card-label">Total Fuel</div></div><div class="card" style="padding:12px;text-align:center"><div class="card-value">${formatCurrency(totalAmt)}</div><div class="card-label">Total Cost</div></div></div>
    <div class="table-container"><table><thead><tr><th>Date</th><th>Machine</th><th>Site</th><th>Qty (L)</th><th>Rate</th><th>Amount</th><th>Reading</th><th>Vendor</th></tr></thead><tbody>
    ${d.machineryFuel.map(f=>`<tr><td>${f.date}</td><td>${f.machine}</td><td>${f.site}</td><td>${f.quantity}</td><td>₹${f.rate}</td><td>${formatCurrency(f.amount)}</td><td>${f.reading}</td><td>${f.vendor}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addFuelEntry(){
    const mOpts=AppData.assets.map(a=>`<option value="${a.id}">${a.id} ${a.name}</option>`).join('');
    openModal('Add Fuel Entry',`<form id="fuel-form"><div class="form-grid"><div class="form-group"><label>Date</label><input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></div><div class="form-group"><label>Machine</label><select name="machine">${mOpts}</select></div><div class="form-group"><label>Site</label><input name="site" value="NH-48 O&M"></div><div class="form-group"><label>Quantity (L)</label><input type="number" name="quantity" required></div><div class="form-group"><label>Rate</label><input type="number" name="rate" value="90" required></div><div class="form-group"><label>Reading</label><input type="number" name="reading"></div><div class="form-group"><label>Vendor</label><input name="vendor" value="Shree Shyam Fuel Station"></div></div></form>`,`<button class="btn btn-primary" onclick="saveFuelEntry()">Save</button>`);
}
function saveFuelEntry(){const f=document.getElementById('fuel-form'),fd=new FormData(f);const m=AppData.assets.find(a=>a.id===fd.get('machine'));const e={id:generateId('MF'),date:fd.get('date'),machineId:fd.get('machine'),machine:fd.get('machine')+' '+(m?m.name:''),site:fd.get('site'),quantity:Number(fd.get('quantity')),rate:Number(fd.get('rate')),amount:Number(fd.get('quantity'))*Number(fd.get('rate')),reading:Number(fd.get('reading')),vendor:fd.get('vendor')};AppData.machineryFuel.unshift(e);saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Fuel entry added');}

function renderMaintenance(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Maintenance</h1><button class="btn btn-primary" onclick="addMaintenanceJob()"><i class="fas fa-plus"></i> New Job</button></div>
    <div style="margin-bottom:20px"><h3 style="font-size:14px;margin-bottom:8px"><i class="fas fa-exclamation-triangle" style="color:#f59e0b"></i> Due Services</h3>
    <div class="table-container"><table><thead><tr><th>Machine</th><th>Service</th><th>Detail</th><th>Due</th></tr></thead><tbody>
    ${d.alerts.filter(a=>a.desc.includes('oil')||a.desc.includes('filter')).map(a=>`<tr><td>${a.machine}</td><td>${a.desc}</td><td>${a.detail}</td><td>${a.due}</td></tr>`).join('')}
    </tbody></table></div></div>
    <h3 style="font-size:14px;margin-bottom:8px"><i class="fas fa-wrench" style="color:#3b82f6"></i> Maintenance Jobs</h3>
    <div class="table-container"><table><thead><tr><th>ID</th><th>Machine</th><th>Opened</th><th>Type</th><th>Problem</th><th>Cost</th><th>Status</th></tr></thead><tbody>
    ${d.maintenanceJobs.map(j=>`<tr><td>${j.id}</td><td>${j.machine}</td><td>${j.opened}</td><td>${j.type}</td><td>${j.problem}</td><td>${formatCurrency(j.totalCost)}</td><td>${getStatusBadge(j.status)}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addMaintenanceJob(){
    const mOpts=AppData.assets.map(a=>`<option value="${a.id}">${a.id} ${a.name}</option>`).join('');
    openModal('New Maintenance Job',`<form id="maint-form"><div class="form-grid"><div class="form-group"><label>Machine</label><select name="machine">${mOpts}</select></div><div class="form-group"><label>Type</label><select name="type"><option>Breakdown</option><option>Scheduled</option><option>Preventive</option></select></div><div class="form-group"><label>Problem</label><input name="problem" required></div><div class="form-group"><label>Estimated Cost</label><input type="number" name="cost" value="0"></div></div></form>`,`<button class="btn btn-primary" onclick="saveMaintenanceJob()">Save</button>`);
}
function saveMaintenanceJob(){const f=document.getElementById('maint-form'),fd=new FormData(f);const m=AppData.assets.find(a=>a.id===fd.get('machine'));const j={id:generateId('MJ'),machineId:fd.get('machine'),machine:fd.get('machine')+' '+(m?m.name:''),opened:new Date().toISOString().split('T')[0],type:fd.get('type'),problem:fd.get('problem'),totalCost:Number(fd.get('cost')),status:'Open'};AppData.maintenanceJobs.unshift(j);saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Job created');}

function renderHireBills(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Hire Bills</h1><button class="btn btn-primary" onclick="addHireBill()"><i class="fas fa-plus"></i> Add Bill</button></div>
    <div class="table-container"><table><thead><tr><th>Bill#</th><th>Vendor</th><th>Machine</th><th>Period</th><th>Billed Hrs</th><th>Logbook Hrs</th><th>Variance</th><th>Amount</th><th>TDS</th><th>Net Payable</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    ${d.hireBills.map(h=>`<tr><td>${h.bill}</td><td>${h.vendor}</td><td>${h.machine}</td><td>${h.period}</td><td>${h.billedHrs}</td><td>${h.logbookHrs}</td><td style="color:${h.variance>0?'#ef4444':'#10b981'}">${h.variance}</td><td>${formatCurrency(h.amount)}</td><td>${formatCurrency(h.tds)}</td><td>${formatCurrency(h.netPayable)}</td><td>${getStatusBadge(h.status)}</td><td>${h.status==='Pending Verification'?`<button class="btn btn-sm" onclick="verifyHireBill('${h.id}')">Verify</button>`:'-'}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function verifyHireBill(id){const h=AppData.hireBills.find(b=>b.id===id);if(h){h.status='Verified';saveData(AppData);handleRoute();toast('Bill verified');}}
function addHireBill(){openModal('Add Hire Bill',`<form id="hire-form"><div class="form-grid"><div class="form-group"><label>Bill#</label><input name="bill" required></div><div class="form-group"><label>Vendor</label><input name="vendor" required></div><div class="form-group"><label>Machine ID</label><input name="machine" required></div><div class="form-group"><label>Period</label><input name="period" required></div><div class="form-group"><label>Billed Hrs</label><input type="number" name="billedHrs" step="0.01" required></div><div class="form-group"><label>Logbook Hrs</label><input type="number" name="logbookHrs" step="0.01" required></div><div class="form-group"><label>Amount</label><input type="number" name="amount" step="0.01" required></div></div></form>`,`<button class="btn btn-primary" onclick="saveHireBill()">Save</button>`);}
function saveHireBill(){const f=document.getElementById('hire-form'),fd=new FormData(f);const bh=Number(fd.get('billedHrs')),lh=Number(fd.get('logbookHrs')),amt=Number(fd.get('amount')),tds=amt*0.02;const h={id:generateId('HB'),bill:fd.get('bill'),vendor:fd.get('vendor'),machineId:fd.get('machine'),machine:fd.get('machine'),period:fd.get('period'),billedHrs:bh,logbookHrs:lh,variance:+(bh-lh).toFixed(2),amount:amt,tds:+tds.toFixed(2),netPayable:+(amt-tds).toFixed(2),status:'Pending Verification'};AppData.hireBills.unshift(h);saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Hire bill added');}

function renderEquipmentCategories(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Equipment Categories</h1><button class="btn btn-primary" onclick="addEqCategory()"><i class="fas fa-plus"></i> Add Category</button></div>
    <div style="margin-bottom:12px;font-size:13px"><strong>Fuel Variance Threshold:</strong> ${d.fuelVarianceThreshold}% <button class="btn btn-sm" onclick="editFuelThreshold()"><i class="fas fa-edit"></i></button></div>
    <div class="table-container"><table><thead><tr><th>Sort</th><th>Category</th><th>Class</th><th>Meter</th><th>Fuel Benchmark</th></tr></thead><tbody>
    ${d.equipmentCategories.sort((a,b)=>a.sort-b.sort).map(c=>`<tr><td>${c.sort}</td><td>${c.category}</td><td>${c.class}</td><td>${c.meter}</td><td>${c.fuelBenchmark}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addEqCategory(){openModal('Add Equipment Category',`<form id="eqcat-form"><div class="form-grid"><div class="form-group"><label>Category</label><input name="category" required></div><div class="form-group"><label>Class</label><select name="class"><option>Plant</option><option>Equipment</option><option>Vehicle</option></select></div><div class="form-group"><label>Meter</label><select name="meter"><option>hrs</option><option>km</option></select></div><div class="form-group"><label>Fuel Benchmark</label><input name="fuelBenchmark" required></div><div class="form-group"><label>Sort Order</label><input type="number" name="sort" value="100"></div></div></form>`,`<button class="btn btn-primary" onclick="saveEqCategory()">Save</button>`);}
function saveEqCategory(){const f=document.getElementById('eqcat-form'),fd=new FormData(f);AppData.equipmentCategories.push({id:generateId('EC'),category:fd.get('category'),class:fd.get('class'),meter:fd.get('meter'),fuelBenchmark:fd.get('fuelBenchmark'),sort:Number(fd.get('sort'))});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Category added');}
function editFuelThreshold(){openModal('Fuel Variance Threshold',`<form id="thresh-form"><div class="form-group"><label>Threshold (%)</label><input type="number" name="threshold" value="${AppData.fuelVarianceThreshold}"></div></form>`,`<button class="btn btn-primary" onclick="saveFuelThreshold()">Save</button>`);}
function saveFuelThreshold(){const v=Number(new FormData(document.getElementById('thresh-form')).get('threshold'));AppData.fuelVarianceThreshold=v;saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Threshold updated');}

function renderEquipmentDocTypes(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Equipment Document Types</h1><button class="btn btn-primary" onclick="addDocType()"><i class="fas fa-plus"></i> Add Type</button></div>
    <div class="table-container"><table><thead><tr><th>Sort</th><th>Code</th><th>Name</th><th>Fields</th><th>Remind (days)</th></tr></thead><tbody>
    ${d.equipmentDocTypes.sort((a,b)=>a.sort-b.sort).map(dt=>`<tr><td>${dt.sort}</td><td>${dt.code}</td><td>${dt.name}</td><td>${dt.flags}</td><td>${dt.remind||'-'}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addDocType(){openModal('Add Document Type',`<form id="doctype-form"><div class="form-grid"><div class="form-group"><label>Code</label><input name="code" required></div><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-group"><label>Fields</label><select name="flags"><option>Number</option><option>Expiry</option><option>ExpiryNumber</option></select></div><div class="form-group"><label>Remind Before (days)</label><input type="number" name="remind" value="30"></div><div class="form-group"><label>Sort Order</label><input type="number" name="sort" value="100"></div></div></form>`,`<button class="btn btn-primary" onclick="saveDocType()">Save</button>`);}
function saveDocType(){const f=document.getElementById('doctype-form'),fd=new FormData(f);AppData.equipmentDocTypes.push({id:generateId('EDT'),code:fd.get('code'),name:fd.get('name'),flags:fd.get('flags'),remind:Number(fd.get('remind')),sort:Number(fd.get('sort'))});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Doc type added');}

function renderHireRates(container){
    const d=AppData;
    container.innerHTML=`
    <div class="page-header"><h1>Hire Rates</h1><button class="btn btn-primary" onclick="addHireRate()"><i class="fas fa-plus"></i> Add Rate</button></div>
    <div class="table-container"><table><thead><tr><th>Applies To</th><th>Rate (₹/hr)</th><th>Effective From</th><th>Effective To</th></tr></thead><tbody>
    ${d.hireRates.map(r=>`<tr><td>${r.appliesTo}</td><td>${formatCurrency(r.rate)}</td><td>${r.effectiveFrom}</td><td>${r.effectiveTo}</td></tr>`).join('')}
    </tbody></table></div>`;
}
function addHireRate(){openModal('Add Hire Rate',`<form id="rate-form"><div class="form-grid"><div class="form-group"><label>Applies To</label><input name="appliesTo" required></div><div class="form-group"><label>Rate (₹/hr)</label><input type="number" name="rate" required></div><div class="form-group"><label>Effective From</label><input type="date" name="effectiveFrom" required></div><div class="form-group"><label>Effective To</label><input name="effectiveTo" value="Current"></div></div></form>`,`<button class="btn btn-primary" onclick="saveHireRate()">Save</button>`);}
function saveHireRate(){const f=document.getElementById('rate-form'),fd=new FormData(f);AppData.hireRates.push({id:generateId('HR'),appliesTo:fd.get('appliesTo'),rate:Number(fd.get('rate')),effectiveFrom:fd.get('effectiveFrom'),effectiveTo:fd.get('effectiveTo')});saveData(AppData);closeModal({target:document.getElementById('modal-overlay')});handleRoute();toast('Rate added');}
