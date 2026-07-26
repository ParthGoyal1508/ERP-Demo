// Inventory Module

// ===== STOCK =====
function renderStock(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Stock</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="openNewPurchaseModal()"><i class="fas fa-plus"></i> New Purchase</button>
                <button class="btn btn-outline" onclick="openNewIssueModal()">New Issue</button>
                <button class="btn btn-outline" onclick="openNewTransferModal()">New Transfer</button>
                <button class="btn btn-outline" onclick="showMasters()">Masters</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <input type="text" id="stock-search" placeholder="Search item code, name..." oninput="filterStock()">
                    <select id="stock-project" onchange="filterStock()"><option value="">All Projects</option>${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
                    <select id="stock-category" onchange="filterStock()"><option value="">All Categories</option>${AppData.categories.map(c=>`<option>${c}</option>`).join('')}</select>
                </div>
            </div>
            <table>
                <thead><tr><th>Item</th><th>Project</th><th>Category</th><th>Unit</th><th>Received</th><th>Issued</th><th>Transfer In</th><th>Transfer Out</th><th>In Stock</th><th>Avg Rate</th><th>Stock Value</th></tr></thead>
                <tbody id="stock-tbody">${renderStockRows(AppData.stock)}</tbody>
            </table>
        </div>
    `;
}

function renderStockRows(stockItems) {
    return stockItems.map(s => {
        const inStock = s.received + s.transferIn - s.issued - s.transferOut;
        const rate = AppData.stockRates[s.item] || 0;
        const value = inStock * rate;
        return `<tr>
            <td><strong>${s.item}</strong></td><td>${s.project}</td><td><span class="badge-status badge-gray">${s.category}</span></td>
            <td>${s.unit}</td><td>${s.received}</td><td>${s.issued}</td><td>${s.transferIn}</td><td>${s.transferOut}</td>
            <td><strong>${inStock} ${s.unit}</strong></td><td>${formatCurrency(rate)}</td><td>${formatCurrency(value)}</td>
        </tr>`;
    }).join('');
}

function filterStock() {
    const search = document.getElementById('stock-search').value.toLowerCase();
    const project = document.getElementById('stock-project').value;
    const category = document.getElementById('stock-category').value;
    let filtered = AppData.stock.filter(s => {
        return (!search || s.item.toLowerCase().includes(search)) && (!project || s.project === project) && (!category || s.category === category);
    });
    document.getElementById('stock-tbody').innerHTML = renderStockRows(filtered);
}

function getItemOptions() {
    const masters = AppData.itemMasters || [];
    if (masters.length) return masters.map(im => `<option value="${im.name}">${im.name} (${im.unit})</option>`).join('');
    return '<option>Cement OPC 53 Grade</option><option>Aggregate 20mm</option><option>TMT Steel 12mm</option>';
}

function openNewPurchaseModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Project Store</label><select id="pur-project">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Item</label><select id="pur-item">${getItemOptions()}</select></div>
            <div class="form-group"><label>Vendor</label><select id="pur-vendor">${AppData.vendors.map(v=>`<option>${v.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Date</label><input type="date" id="pur-date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label>Rate (₹/unit)</label><input type="number" id="pur-rate"></div>
            <div class="form-group"><label>Quantity</label><input type="number" id="pur-qty"></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewPurchase()">Record Purchase</button>`;
    openModal('New Purchase', body, footer);
}

function saveNewPurchase() {
    const project = document.getElementById('pur-project').value;
    const item = document.getElementById('pur-item').value;
    const vendor = document.getElementById('pur-vendor').value;
    const date = document.getElementById('pur-date').value;
    const rate = parseInt(document.getElementById('pur-rate').value) || 0;
    const qty = parseInt(document.getElementById('pur-qty').value) || 0;
    if (!qty) { toast('Quantity is required', 'error'); return; }

    AppData.purchases.unshift({
        id: generateId('PUR'), date, project, item, vendor, qty,
        unit: item.includes('Steel') ? 'KG' : item.includes('Aggregate') ? 'CUM' : 'BAG',
        rate, amount: qty * rate, bill: 'INV-' + Date.now().toString().slice(-6), payment: 'Unpaid'
    });

    // Update stock
    const stockItem = AppData.stock.find(s => s.item === item && s.project === project);
    if (stockItem) { stockItem.received += qty; }
    else { AppData.stock.push({ id: generateId('STK'), item, project, category: item.includes('Steel') ? 'STEEL' : item.includes('Aggregate') ? 'AGGREGATE' : 'CEMENT', unit: item.includes('Steel') ? 'KG' : item.includes('Aggregate') ? 'CUM' : 'BAG', received: qty, issued: 0, transferIn: 0, transferOut: 0 }); }

    saveData(AppData);
    closeModal();
    toast('Purchase recorded successfully', 'success');
    renderStock(document.getElementById('page-content'));
}

function openNewIssueModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Project Store</label><select id="iss-project">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Item</label><select id="iss-item">${getItemOptions()}</select></div>
            <div class="form-group"><label>Issued To</label><input type="text" id="iss-to"></div>
            <div class="form-group"><label>Date</label><input type="date" id="iss-date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label>Quantity</label><input type="number" id="iss-qty"></div>
            <div class="form-group full-width"><label>Remarks</label><textarea id="iss-remarks"></textarea></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewIssue()">Record Issue</button>`;
    openModal('New Issue', body, footer);
}

function saveNewIssue() {
    const project = document.getElementById('iss-project').value;
    const item = document.getElementById('iss-item').value;
    const qty = parseInt(document.getElementById('iss-qty').value) || 0;
    if (!qty) { toast('Quantity is required', 'error'); return; }

    AppData.issues.unshift({
        id: generateId('ISS'), date: document.getElementById('iss-date').value, project, item,
        issuedTo: document.getElementById('iss-to').value, qty,
        unit: item.includes('Steel') ? 'KG' : item.includes('Aggregate') ? 'CUM' : 'BAG',
        remarks: document.getElementById('iss-remarks').value
    });

    const stockItem = AppData.stock.find(s => s.item === item && s.project === project);
    if (stockItem) stockItem.issued += qty;

    saveData(AppData);
    closeModal();
    toast('Issue recorded successfully', 'success');
    renderStock(document.getElementById('page-content'));
}

function openNewTransferModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>From Project</label><select id="trf-from">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>To Project</label><select id="trf-to">${AppData.projects.map((p,i)=>`<option ${i===1?'selected':''}>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Item</label><select id="trf-item">${getItemOptions()}</select></div>
            <div class="form-group"><label>Date</label><input type="date" id="trf-date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label>Quantity</label><input type="number" id="trf-qty"></div>
            <div class="form-group full-width"><label>Remarks</label><textarea id="trf-remarks"></textarea></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewTransfer()">Record Transfer</button>`;
    openModal('New Transfer', body, footer);
}

function saveNewTransfer() {
    const fromProject = document.getElementById('trf-from').value;
    const toProject = document.getElementById('trf-to').value;
    const item = document.getElementById('trf-item').value;
    const qty = parseInt(document.getElementById('trf-qty').value) || 0;
    if (!qty) { toast('Quantity is required', 'error'); return; }

    AppData.transfers.unshift({
        id: generateId('TRF'), date: document.getElementById('trf-date').value,
        fromProject, toProject, item, qty,
        unit: item.includes('Steel') ? 'KG' : item.includes('Aggregate') ? 'CUM' : 'BAG',
        remarks: document.getElementById('trf-remarks').value
    });

    const from = AppData.stock.find(s => s.item === item && s.project === fromProject);
    if (from) from.transferOut += qty;
    const to = AppData.stock.find(s => s.item === item && s.project === toProject);
    if (to) to.transferIn += qty;
    else AppData.stock.push({ id: generateId('STK'), item, project: toProject, category: 'CEMENT', unit: 'BAG', received: 0, issued: 0, transferIn: qty, transferOut: 0 });

    saveData(AppData);
    closeModal();
    toast('Transfer recorded successfully', 'success');
    renderStock(document.getElementById('page-content'));
}

function showMasters() {
    renderMastersContent('items');
}
function renderMastersContent(tab) {
    const items = AppData.itemMasters || [];
    const cats = AppData.categories || [];
    const isItems = tab === 'items';
    const body = `
        <div style="display:flex;gap:8px;margin-bottom:16px">
            <button class="btn ${isItems ? 'btn-primary' : 'btn-outline'}" onclick="renderMastersContent('items')" style="font-size:13px">Item Masters</button>
            <button class="btn ${!isItems ? 'btn-primary' : 'btn-outline'}" onclick="renderMastersContent('categories')" style="font-size:13px">Category Masters</button>
        </div>
        ${isItems ? `
        <div style="margin-bottom:10px"><button class="btn btn-sm btn-primary" onclick="addItemMaster()"><i class="fas fa-plus"></i> Add Item</button></div>
        <table><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Unit</th><th>Description</th><th>Actions</th></tr></thead><tbody>
        ${items.map(im => `<tr><td style="font-size:11px">${im.id}</td><td><strong>${im.name}</strong></td><td><span class="badge-status badge-gray">${im.category}</span></td><td>${im.unit}</td><td style="font-size:12px;color:#6b7280">${im.description || '-'}</td><td><button class="btn btn-sm" onclick="editItemMaster('${im.id}')"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-danger" onclick="deleteItemMaster('${im.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
        </tbody></table>` : `
        <div style="margin-bottom:10px"><button class="btn btn-sm btn-primary" onclick="addCategoryMaster()"><i class="fas fa-plus"></i> Add Category</button></div>
        <table><thead><tr><th>#</th><th>Category</th><th>Items</th><th>Actions</th></tr></thead><tbody>
        ${cats.map((c, i) => `<tr><td>${i + 1}</td><td><strong>${c}</strong></td><td>${items.filter(im => im.category === c).length}</td><td><button class="btn btn-sm btn-danger" onclick="deleteCategoryMaster(${i})"><i class="fas fa-trash"></i></button></td></tr>`).join('')}
        </tbody></table>`}`;
    openModal('Inventory Masters', body);
}
function addItemMaster() {
    closeModal({target:document.getElementById('modal-overlay')});
    const catOpts = (AppData.categories || []).map(c => `<option value="${c}">${c}</option>`).join('');
    openModal('Add Item Master', `<form id="im-form"><div class="form-grid">
        <div class="form-group"><label>Item Name</label><input name="name" required placeholder="e.g. Cement PPC"></div>
        <div class="form-group"><label>Category</label><select name="category" required>${catOpts}</select></div>
        <div class="form-group"><label>Unit</label><select name="unit"><option>BAG</option><option>CUM</option><option>KG</option><option>MT</option><option>NOS</option><option>LTR</option><option>SQM</option><option>RMT</option></select></div>
        <div class="form-group"><label>Description</label><input name="description"></div>
    </div></form>`,
    `<button class="btn" onclick="showMasters()">Cancel</button> <button class="btn btn-primary" onclick="saveItemMaster()">Save</button>`);
}
function saveItemMaster() {
    const fd = new FormData(document.getElementById('im-form'));
    if (!AppData.itemMasters) AppData.itemMasters = [];
    AppData.itemMasters.push({ id: generateId('IM'), name: fd.get('name').trim(), category: fd.get('category'), unit: fd.get('unit'), description: fd.get('description') });
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); toast('Item added'); showMasters();
}
function editItemMaster(id) {
    closeModal({target:document.getElementById('modal-overlay')});
    const im = (AppData.itemMasters || []).find(x => x.id === id);
    if (!im) return;
    const catOpts = (AppData.categories || []).map(c => `<option value="${c}" ${c === im.category ? 'selected' : ''}>${c}</option>`).join('');
    openModal('Edit Item', `<form id="im-form"><div class="form-grid">
        <div class="form-group"><label>Item Name</label><input name="name" value="${im.name}" required></div>
        <div class="form-group"><label>Category</label><select name="category" required>${catOpts}</select></div>
        <div class="form-group"><label>Unit</label><select name="unit"><option ${im.unit==='BAG'?'selected':''}>BAG</option><option ${im.unit==='CUM'?'selected':''}>CUM</option><option ${im.unit==='KG'?'selected':''}>KG</option><option ${im.unit==='MT'?'selected':''}>MT</option><option ${im.unit==='NOS'?'selected':''}>NOS</option><option ${im.unit==='LTR'?'selected':''}>LTR</option><option ${im.unit==='SQM'?'selected':''}>SQM</option><option ${im.unit==='RMT'?'selected':''}>RMT</option></select></div>
        <div class="form-group"><label>Description</label><input name="description" value="${im.description || ''}"></div>
    </div></form>`,
    `<button class="btn" onclick="showMasters()">Cancel</button> <button class="btn btn-primary" onclick="updateItemMaster('${id}')">Update</button>`);
}
function updateItemMaster(id) {
    const im = (AppData.itemMasters || []).find(x => x.id === id);
    if (!im) return;
    const fd = new FormData(document.getElementById('im-form'));
    im.name = fd.get('name').trim(); im.category = fd.get('category'); im.unit = fd.get('unit'); im.description = fd.get('description');
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); toast('Item updated'); showMasters();
}
function deleteItemMaster(id) {
    showConfirm('Delete Item', 'Remove this item master?', function(r) {
        if (r) { AppData.itemMasters = (AppData.itemMasters || []).filter(x => x.id !== id); saveData(AppData); toast('Item removed'); closeModal({target:document.getElementById('modal-overlay')}); showMasters(); }
    });
}
function addCategoryMaster() {
    closeModal({target:document.getElementById('modal-overlay')});
    openModal('Add Category', `<form id="catm-form"><div class="form-group"><label>Category Name</label><input name="name" required placeholder="e.g. TIMBER"></div></form>`,
    `<button class="btn" onclick="showMasters()">Cancel</button> <button class="btn btn-primary" onclick="saveCategoryMaster()">Save</button>`);
}
function saveCategoryMaster() {
    const name = new FormData(document.getElementById('catm-form')).get('name').trim().toUpperCase();
    if (!name) { toast('Name is required', 'error'); return; }
    if (AppData.categories.includes(name)) { toast('Category already exists', 'error'); return; }
    AppData.categories.push(name);
    saveData(AppData); closeModal({target:document.getElementById('modal-overlay')}); toast('Category added'); showMasters();
}
function deleteCategoryMaster(idx) {
    const name = AppData.categories[idx];
    showConfirm('Delete Category', 'Remove "' + name + '"? Items in this category will not be affected.', function(r) {
        if (r) { AppData.categories.splice(idx, 1); saveData(AppData); toast('Category removed'); closeModal({target:document.getElementById('modal-overlay')}); showMasters(); }
    });
}

// ===== PURCHASES =====
function renderPurchases(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Purchases</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="openNewPurchaseModal()"><i class="fas fa-plus"></i> New Purchase</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <select id="pur-filter-project" onchange="filterPurchases()"><option value="">All Projects</option>${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
                    <select id="pur-filter-vendor" onchange="filterPurchases()"><option value="">All Vendors</option>${AppData.vendors.map(v=>`<option>${v.name}</option>`).join('')}</select>
                    <select id="pur-filter-status" onchange="filterPurchases()"><option value="">Any Status</option><option>Paid</option><option>Unpaid</option><option>Part Paid</option></select>
                    <input type="date" id="pur-filter-from" onchange="filterPurchases()" title="From date">
                    <input type="date" id="pur-filter-to" onchange="filterPurchases()" title="To date">
                </div>
            </div>
            <table>
                <thead><tr><th>Date</th><th>Project</th><th>Item</th><th>Vendor</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>Bill</th><th>Payment</th><th>Actions</th></tr></thead>
                <tbody id="purchases-tbody">${renderPurchaseRows(AppData.purchases)}</tbody>
            </table>
        </div>
    `;
}

function renderPurchaseRows(purchases) {
    return purchases.map(p => `
        <tr>
            <td>${formatDate(p.date)}</td><td>${p.project}</td><td>${p.item}</td><td>${p.vendor}</td>
            <td>${p.qty}</td><td>${p.unit}</td><td>${formatCurrency(p.rate)}</td><td>${formatCurrency(p.amount)}</td>
            <td>${p.bill}</td><td>${getStatusBadge(p.payment)}</td>
            <td class="actions"><button class="btn-delete" onclick="deletePurchase('${p.id}')"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

function filterPurchases() {
    const project = document.getElementById('pur-filter-project').value;
    const vendor = document.getElementById('pur-filter-vendor').value;
    const status = document.getElementById('pur-filter-status').value;
    const from = document.getElementById('pur-filter-from').value;
    const to = document.getElementById('pur-filter-to').value;
    let filtered = AppData.purchases.filter(p => (!project || p.project === project) && (!vendor || p.vendor === vendor) && (!status || p.payment === status) && (!from || p.date >= from) && (!to || p.date <= to));
    document.getElementById('purchases-tbody').innerHTML = renderPurchaseRows(filtered);
}

function deletePurchase(id) {
    showConfirm('Delete Purchase', 'Are you sure?', function(r) {
        if (r) { AppData.purchases = AppData.purchases.filter(p => p.id !== id); saveData(AppData); toast('Purchase deleted','success'); renderPurchases(document.getElementById('page-content')); }
    });
}

// ===== ISSUES =====
function renderIssues(container) {
    container.innerHTML = `
        <div class="page-header"><h1>Issues</h1><div class="page-header-actions"><button class="btn btn-primary" onclick="openNewIssueModal()"><i class="fas fa-plus"></i> New Issue</button></div></div>
        <div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap">
            <input type="date" id="iss-filter-from" onchange="filterIssues()" title="From date">
            <input type="date" id="iss-filter-to" onchange="filterIssues()" title="To date">
            <select id="iss-filter-project" onchange="filterIssues()"><option value="">All Projects</option>${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
        </div>
        <div class="table-container">
            <table>
                <thead><tr><th>Date</th><th>Project</th><th>Item</th><th>Issued To</th><th>Qty</th><th>Unit</th><th>Remarks</th><th>Actions</th></tr></thead>
                <tbody id="issues-tbody">${renderIssueRows(AppData.issues)}</tbody>
            </table>
        </div>
    `;
}
function renderIssueRows(issues) {
    return issues.map(i => `<tr><td>${formatDate(i.date)}</td><td>${i.project}</td><td>${i.item}</td><td>${i.issuedTo}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.remarks}</td><td class="actions"><button class="btn-delete" onclick="deleteIssue('${i.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('');
}
function filterIssues() {
    const from = document.getElementById('iss-filter-from').value;
    const to = document.getElementById('iss-filter-to').value;
    const project = document.getElementById('iss-filter-project').value;
    let filtered = AppData.issues.filter(i => (!from || i.date >= from) && (!to || i.date <= to) && (!project || i.project === project));
    document.getElementById('issues-tbody').innerHTML = renderIssueRows(filtered);
}

function deleteIssue(id) {
    showConfirm('Delete Issue', 'Are you sure?', function(r) { if (r) { AppData.issues = AppData.issues.filter(i => i.id !== id); saveData(AppData); toast('Issue deleted','success'); renderIssues(document.getElementById('page-content')); } });
}

// ===== TRANSFERS =====
function renderTransfers(container) {
    container.innerHTML = `
        <div class="page-header"><h1>Transfers</h1><div class="page-header-actions"><button class="btn btn-primary" onclick="openNewTransferModal()"><i class="fas fa-plus"></i> New Transfer</button></div></div>
        <div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap">
            <input type="date" id="trf-filter-from" onchange="filterTransfers()" title="From date">
            <input type="date" id="trf-filter-to" onchange="filterTransfers()" title="To date">
            <select id="trf-filter-project" onchange="filterTransfers()"><option value="">All Projects</option>${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select>
        </div>
        <div class="table-container">
            <table>
                <thead><tr><th>Date</th><th>From Project</th><th>To Project</th><th>Item</th><th>Qty</th><th>Unit</th><th>Remarks</th><th>Actions</th></tr></thead>
                <tbody id="transfers-tbody">${renderTransferRows(AppData.transfers)}</tbody>
            </table>
        </div>
    `;
}
function renderTransferRows(transfers) {
    return transfers.map(t => `<tr><td>${formatDate(t.date)}</td><td>${t.fromProject}</td><td>${t.toProject}</td><td>${t.item}</td><td>${t.qty}</td><td>${t.unit}</td><td>${t.remarks}</td><td class="actions"><button class="btn-delete" onclick="deleteTransfer('${t.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('');
}
function filterTransfers() {
    const from = document.getElementById('trf-filter-from').value;
    const to = document.getElementById('trf-filter-to').value;
    const project = document.getElementById('trf-filter-project').value;
    let filtered = AppData.transfers.filter(t => (!from || t.date >= from) && (!to || t.date <= to) && (!project || t.fromProject === project || t.toProject === project));
    document.getElementById('transfers-tbody').innerHTML = renderTransferRows(filtered);
}

function deleteTransfer(id) {
    showConfirm('Delete Transfer', 'Are you sure?', function(r) { if (r) { AppData.transfers = AppData.transfers.filter(t => t.id !== id); saveData(AppData); toast('Transfer deleted','success'); renderTransfers(document.getElementById('page-content')); } });
}

// ===== PAYMENTS =====
function renderPayments(container) {
    container.innerHTML = `
        <div class="page-header"><h1>Payments</h1><div class="page-header-actions"><button class="btn btn-primary" onclick="openNewPaymentModal()"><i class="fas fa-plus"></i> New Payment</button></div></div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <select id="pay-vendor" onchange="filterPayments()"><option value="">All Vendors</option>${AppData.vendors.map(v=>`<option>${v.name}</option>`).join('')}</select>
                    <input type="date" id="pay-from" onchange="filterPayments()" title="From date">
                    <input type="date" id="pay-to" onchange="filterPayments()" title="To date">
                </div>
            </div>
            <table>
                <thead><tr><th>Date</th><th>Vendor</th><th>Amount</th><th>Mode</th><th>Reference</th><th>Allocated Bills</th></tr></thead>
                <tbody id="payments-tbody">${renderPaymentRows(AppData.payments)}</tbody>
            </table>
        </div>
    `;
}

function renderPaymentRows(payments) {
    return payments.map(p => `
        <tr><td>${formatDate(p.date)}</td><td>${p.vendor}</td><td>${formatCurrency(p.amount)}</td><td><span class="badge-status badge-blue">${p.mode}</span></td><td style="font-size:11px">${p.ref}</td><td>${p.allocatedBills}</td></tr>
    `).join('');
}

function filterPayments() {
    const vendor = document.getElementById('pay-vendor').value;
    const from = document.getElementById('pay-from').value;
    const to = document.getElementById('pay-to').value;
    let filtered = AppData.payments;
    if (vendor) filtered = filtered.filter(p => p.vendor === vendor);
    if (from) filtered = filtered.filter(p => p.date >= from);
    if (to) filtered = filtered.filter(p => p.date <= to);
    document.getElementById('payments-tbody').innerHTML = renderPaymentRows(filtered);
}

function openNewPaymentModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Vendor</label><select id="newpay-vendor">${AppData.vendors.map(v=>`<option>${v.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Amount (₹)</label><input type="number" id="newpay-amount"></div>
            <div class="form-group"><label>Date</label><input type="date" id="newpay-date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label>Mode</label><select id="newpay-mode"><option>BANK</option><option>UPI</option><option>CASH</option></select></div>
            <div class="form-group"><label>Reference</label><input type="text" id="newpay-ref"></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewPayment()">Record Payment</button>`;
    openModal('New Payment', body, footer);
}

function saveNewPayment() {
    const amount = parseInt(document.getElementById('newpay-amount').value) || 0;
    if (!amount) { toast('Amount is required', 'error'); return; }
    AppData.payments.unshift({
        id: generateId('PAY'),
        date: document.getElementById('newpay-date').value,
        vendor: document.getElementById('newpay-vendor').value,
        amount,
        mode: document.getElementById('newpay-mode').value,
        ref: document.getElementById('newpay-ref').value || 'UTR' + Date.now().toString().slice(-10),
        allocatedBills: 1
    });
    saveData(AppData);
    closeModal();
    toast('Payment recorded', 'success');
    renderPayments(document.getElementById('page-content'));
}
