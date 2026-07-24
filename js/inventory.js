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

function openNewPurchaseModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Project Store</label><select id="pur-project">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Item</label><select id="pur-item"><option>Cement OPC 53 Grade</option><option>Aggregate 20mm</option><option>TMT Steel 12mm</option></select></div>
            <div class="form-group"><label>Vendor</label><select id="pur-vendor">${AppData.vendors.map(v=>`<option>${v}</option>`).join('')}</select></div>
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
            <div class="form-group"><label>Item</label><select id="iss-item"><option>Cement OPC 53 Grade</option><option>Aggregate 20mm</option><option>TMT Steel 12mm</option></select></div>
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
            <div class="form-group"><label>Item</label><select id="trf-item"><option>Cement OPC 53 Grade</option><option>Aggregate 20mm</option><option>TMT Steel 12mm</option></select></div>
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
    const body = `
        <div class="tabs"><div class="tab active">Categories</div><div class="tab">Vendors</div></div>
        <table><thead><tr><th>Category</th></tr></thead><tbody>
            ${AppData.categories.map(c => `<tr><td>${c}</td></tr>`).join('')}
        </tbody></table>
        <h4 style="margin-top:16px">Vendors</h4>
        <table><thead><tr><th>Vendor Name</th></tr></thead><tbody>
            ${AppData.vendors.map(v => `<tr><td>${v}</td></tr>`).join('')}
        </tbody></table>
    `;
    openModal('Masters', body);
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
                    <select id="pur-filter-vendor" onchange="filterPurchases()"><option value="">All Vendors</option>${AppData.vendors.map(v=>`<option>${v}</option>`).join('')}</select>
                    <select id="pur-filter-status" onchange="filterPurchases()"><option value="">Any Status</option><option>Paid</option><option>Unpaid</option><option>Part Paid</option></select>
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
    let filtered = AppData.purchases.filter(p => (!project || p.project === project) && (!vendor || p.vendor === vendor) && (!status || p.payment === status));
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
        <div class="table-container">
            <table>
                <thead><tr><th>Date</th><th>Project</th><th>Item</th><th>Issued To</th><th>Qty</th><th>Unit</th><th>Remarks</th><th>Actions</th></tr></thead>
                <tbody>${AppData.issues.map(i => `
                    <tr><td>${formatDate(i.date)}</td><td>${i.project}</td><td>${i.item}</td><td>${i.issuedTo}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.remarks}</td>
                    <td class="actions"><button class="btn-delete" onclick="deleteIssue('${i.id}')"><i class="fas fa-trash"></i></button></td></tr>
                `).join('')}</tbody>
            </table>
        </div>
    `;
}

function deleteIssue(id) {
    showConfirm('Delete Issue', 'Are you sure?', function(r) { if (r) { AppData.issues = AppData.issues.filter(i => i.id !== id); saveData(AppData); toast('Issue deleted','success'); renderIssues(document.getElementById('page-content')); } });
}

// ===== TRANSFERS =====
function renderTransfers(container) {
    container.innerHTML = `
        <div class="page-header"><h1>Transfers</h1><div class="page-header-actions"><button class="btn btn-primary" onclick="openNewTransferModal()"><i class="fas fa-plus"></i> New Transfer</button></div></div>
        <div class="table-container">
            <table>
                <thead><tr><th>Date</th><th>From Project</th><th>To Project</th><th>Item</th><th>Qty</th><th>Unit</th><th>Remarks</th><th>Actions</th></tr></thead>
                <tbody>${AppData.transfers.map(t => `
                    <tr><td>${formatDate(t.date)}</td><td>${t.fromProject}</td><td>${t.toProject}</td><td>${t.item}</td><td>${t.qty}</td><td>${t.unit}</td><td>${t.remarks}</td>
                    <td class="actions"><button class="btn-delete" onclick="deleteTransfer('${t.id}')"><i class="fas fa-trash"></i></button></td></tr>
                `).join('')}</tbody>
            </table>
        </div>
    `;
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
                    <select id="pay-vendor" onchange="filterPayments()"><option value="">All Vendors</option>${AppData.vendors.map(v=>`<option>${v}</option>`).join('')}</select>
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
    let filtered = AppData.payments;
    if (vendor) filtered = filtered.filter(p => p.vendor === vendor);
    document.getElementById('payments-tbody').innerHTML = renderPaymentRows(filtered);
}

function openNewPaymentModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Vendor</label><select id="newpay-vendor">${AppData.vendors.map(v=>`<option>${v}</option>`).join('')}</select></div>
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
