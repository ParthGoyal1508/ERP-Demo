function renderMyPunch(container) {
    const data = loadData();
    const now = new Date();
    let viewMonth = now.getMonth();
    let viewYear = now.getFullYear();

    function render() {
        const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        const punches = getPunchesForMonth(data, viewYear, viewMonth);

        container.innerHTML = `
            <div class="page-header"><h1>My Punch</h1><button class="btn btn-primary" onclick="openPunchModal()"><i class="fas fa-fingerprint"></i> Punch In</button></div>
            <div class="card">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                    <span><i class="fas fa-calendar"></i> Monthly History</span>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <button class="btn btn-sm" id="punch-prev"><i class="fas fa-chevron-left"></i></button>
                        <strong id="punch-month-label">${monthName}</strong>
                        <button class="btn btn-sm" id="punch-next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>Date</th><th>Day</th><th>In</th><th>Out</th><th>OT</th><th>Status</th></tr></thead>
                        <tbody>${punches.map(p => `<tr>
                            <td>${formatDate(p.date)}</td>
                            <td>${p.day}</td>
                            <td>${p.inTime || '-'}</td>
                            <td>${p.outTime || '-'}</td>
                            <td>${p.ot || '-'}</td>
                            <td>${getStatusBadge(p.status)}</td>
                        </tr>`).join('')}</tbody>
                    </table>
                </div>
            </div>`;

        document.getElementById('punch-prev').addEventListener('click', () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); });
        document.getElementById('punch-next').addEventListener('click', () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); });
    }
    render();
}

function getPunchesForMonth(data, year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const punches = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d);
        if (dt > today) break;
        const day = dt.getDay();
        const dateStr = dt.toISOString().split('T')[0];
        const dayName = dt.toLocaleDateString('en-IN', { weekday: 'long' });
        const existing = (data.punches || []).find(p => p.date === dateStr);
        if (existing) { punches.push(existing); }
        else if (day === 0) { punches.push({ date: dateStr, day: dayName, inTime: '', outTime: '', ot: '', status: 'Weekly Off' }); }
        else if (dt.toDateString() === today.toDateString()) { punches.push({ date: dateStr, day: dayName, inTime: '', outTime: '', ot: '', status: 'Today' }); }
        else { const ot = d % 5 === 0 ? '2' : '0'; punches.push({ date: dateStr, day: dayName, inTime: '09:00 am', outTime: ot === '2' ? '08:00 pm' : '06:00 pm', ot, status: 'Present' }); }
    }
    return punches;
}

function openPunchModal() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const body = `
        <div style="text-align:center;padding:20px;">
            <span class="badge-status badge-green" style="font-size:14px;padding:8px 16px;">Ready to Punch In</span>
            <div style="font-size:48px;font-weight:bold;margin:20px 0;" id="punch-clock">${timeStr}</div>
            <p style="color:#666;margin-bottom:20px;">${dateStr}</p>
            <div style="display:flex;gap:20px;justify-content:center;margin:20px 0;">
                <div class="card" style="padding:15px;min-width:100px;"><small>IN TIME</small><br><strong>—</strong></div>
                <div class="card" style="padding:15px;min-width:100px;"><small>OUT TIME</small><br><strong>—</strong></div>
                <div class="card" style="padding:15px;min-width:100px;"><small>WORKED</small><br><strong>00:00:00</strong></div>
            </div>
            <button class="btn btn-primary" style="background:#27ae60;padding:12px 40px;font-size:16px;" onclick="doPunchIn()"><i class="fas fa-fingerprint"></i> Punch In</button>
            <p style="color:#888;margin-top:15px;font-size:12px;"><i class="fas fa-camera"></i> Opens the camera — a photo is recorded with your punch.</p>
            <p style="color:#e74c3c;margin-top:10px;font-size:12px;"><i class="fas fa-exclamation-triangle"></i> User denied Geolocation</p>
        </div>`;
    openModal('Punch In', body, '');
}

function doPunchIn() {
    const data = loadData();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dayName = now.toLocaleDateString('en-IN', { weekday: 'long' });

    if (!data.punches) data.punches = [];
    const existing = data.punches.find(p => p.date === dateStr);
    if (existing) {
        existing.outTime = timeStr;
        existing.status = 'Present';
        toast('Punched out successfully!', 'success');
    } else {
        data.punches.push({ date: dateStr, day: dayName, inTime: timeStr, outTime: '', ot: '0', status: 'Present' });
        toast('Punched in successfully!', 'success');
    }
    saveData(data);
    closeModal({ target: document.getElementById('modal-overlay') });
    renderMyPunch(document.getElementById('page-content'));
}

function renderMyLeave(container) {
    const data = loadData();
    const leaves = data.leaves || [];
    const empLeaves = leaves.filter(l => l.employeeId === 'EMP-0001');

    const earnedUsed = empLeaves.filter(l => l.type === 'Earned Leave' && (l.status === 'Approved' || l.status === 'Pending')).reduce((s, l) => s + l.days, 0);
    const casualUsed = empLeaves.filter(l => l.type === 'Casual Leave' && (l.status === 'Approved' || l.status === 'Pending')).reduce((s, l) => s + l.days, 0);
    const sickUsed = empLeaves.filter(l => l.type === 'Sick Leave' && (l.status === 'Approved' || l.status === 'Pending')).reduce((s, l) => s + l.days, 0);

    container.innerHTML = `
        <div class="page-header"><h1>My Leave</h1>
            <div style="display:flex;gap:10px;align-items:center;">
                <select class="form-control" style="width:auto;"><option>FY 2026-27</option><option>FY 2025-26</option></select>
                <button class="btn btn-primary" onclick="openApplyLeaveModal()"><i class="fas fa-plus"></i> Apply Leave</button>
            </div>
        </div>
        <div class="card" style="margin-bottom:20px;">
            <div class="card-header">Leave Balance</div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Leave Type</th><th>Opening</th><th>Accrued</th><th>Used</th><th>Balance</th></tr></thead>
                    <tbody>
                        <tr><td>Earned Leave</td><td>0</td><td>6</td><td>${earnedUsed}</td><td><strong>${6 - earnedUsed}</strong></td></tr>
                        <tr><td>Casual Leave</td><td>0</td><td>2.33</td><td>${casualUsed}</td><td><strong>${(2.33 - casualUsed).toFixed(2)}</strong></td></tr>
                        <tr><td>Sick Leave</td><td>0</td><td>2.33</td><td>${sickUsed}</td><td><strong>${(2.33 - sickUsed).toFixed(2)}</strong></td></tr>
                        <tr><td>Leave Without Pay</td><td>Unpaid</td><td>—</td><td>—</td><td>—</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header">My Applications</div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Remarks</th><th>Action</th></tr></thead>
                    <tbody>${empLeaves.map(l => `<tr>
                        <td>${l.type}</td>
                        <td>${formatDate(l.from)} – ${formatDate(l.to)}</td>
                        <td>${l.days} day${l.days > 1 ? 's' : ''}</td>
                        <td>${l.reason}</td>
                        <td>${getStatusBadge(l.status)}</td>
                        <td>${l.remarks || '—'}</td>
                        <td>${(l.status === 'Pending' || l.status === 'Approved') ? `<button class="btn btn-sm btn-danger" onclick="cancelMyLeave('${l.id}')"><i class="fas fa-times"></i> Cancel</button>` : '—'}</td>
                    </tr>`).join('')}</tbody>
                </table>
            </div>
        </div>`;
}

function openApplyLeaveModal() {
    const body = `
        <form id="apply-leave-form">
            <div class="form-group"><label>Leave Type</label>
                <select class="form-control" id="leave-type" required>
                    <option value="">Select type</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Leave Without Pay">Leave Without Pay</option>
                </select>
            </div>
            <div class="form-group"><label>From Date</label><input type="date" class="form-control" id="leave-from" required></div>
            <div class="form-group"><label>To Date</label><input type="date" class="form-control" id="leave-to" required></div>
            <div class="form-group"><label>Reason</label><textarea class="form-control" id="leave-reason" rows="3" required></textarea></div>
        </form>`;
    const footer = `<button class="btn btn-primary" onclick="submitLeaveApplication()">Submit</button>`;
    openModal('Apply Leave', body, footer);
}

function submitLeaveApplication() {
    const type = document.getElementById('leave-type').value;
    const from = document.getElementById('leave-from').value;
    const to = document.getElementById('leave-to').value;
    const reason = document.getElementById('leave-reason').value;
    if (!type || !from || !to || !reason) { toast('Please fill all fields', 'error'); return; }

    const days = Math.ceil((new Date(to) - new Date(from)) / 86400000) + 1;
    const data = loadData();
    if (!data.leaves) data.leaves = [];
    data.leaves.push({ id: generateId('LV'), employeeId: 'EMP-0001', employee: 'Ramesh Kumar', type, from, to, days, reason, status: 'Pending', remarks: '' });
    saveData(data);
    closeModal({ target: document.getElementById('modal-overlay') });
    toast('Leave applied successfully', 'success');
    renderMyLeave(document.getElementById('page-content'));
}

function cancelMyLeave(id) {
    showConfirm('Cancel Leave', 'Are you sure you want to cancel this leave application?', function(confirmed) {
        if (confirmed) {
            const data = loadData();
            const leave = data.leaves.find(l => l.id === id);
            if (leave) { leave.status = 'Cancelled'; saveData(data); toast('Leave cancelled', 'info'); renderMyLeave(document.getElementById('page-content')); }
        }
    });
}

function renderMySalary(container) {
    const data = loadData();
    const emp = data.employees[0]; // First employee = logged-in user (Ramesh Kumar)
    const basic = emp.basicSalary || 15000;
    const hra = emp.hra || 6000;
    const conv = emp.conveyance || 1600;
    const siteAllow = emp.siteAllowance || 2400;
    const gross = basic + hra + conv + siteAllow;
    const pfEmp = Math.round(basic * 0.12);
    const advanceRecovery = 5000;
    const totalDeductions = pfEmp + advanceRecovery;
    const netPay = gross - totalDeductions;

    const pfEmployer = 550;
    const epsEmployer = 1250;
    const edli = 75;
    const pfAdmin = 75;
    const gratuity = 721.50;
    const bonusProv = 583.10;
    const totalEmployer = pfEmployer + epsEmployer + edli + pfAdmin + gratuity + bonusProv;

    container.innerHTML = `
        <div class="page-header"><h1>My Salary Summary</h1>
            <div style="display:flex;gap:10px;align-items:center;">
                <select class="form-control" style="width:auto;" id="salary-month">
                    <option>July 2026</option><option>June 2026</option><option>May 2026</option><option>April 2026</option>
                </select>
                <button class="btn btn-primary" onclick="toast('Downloading salary slip...','info')"><i class="fas fa-download"></i> Download</button>
            </div>
        </div>
        <div class="card">
            <div class="card-header">Salary Slip — July 2026</div>
            <div style="padding:20px;">
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;font-size:13px;">
                    <div><small style="color:#666;">Emp Code</small><br><strong>${emp.id}</strong></div>
                    <div><small style="color:#666;">Name</small><br><strong>${emp.name}</strong></div>
                    <div><small style="color:#666;">Designation</small><br><strong>${emp.designation}</strong></div>
                    <div><small style="color:#666;">Department</small><br><strong>${emp.department}</strong></div>
                    <div><small style="color:#666;">Site/Project</small><br><strong>${emp.project}</strong></div>
                    <div><small style="color:#666;">Date of Joining</small><br><strong>${formatDate(emp.joiningDate)}</strong></div>
                    <div><small style="color:#666;">UAN</small><br><strong>${emp.uan || '—'}</strong></div>
                    <div><small style="color:#666;">Bank A/C</small><br><strong>XXXXXX${(emp.accountNo || '').slice(-4)}</strong></div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                    <div class="card" style="padding:12px;text-align:center;"><small>Month Days</small><br><strong>31</strong></div>
                    <div class="card" style="padding:12px;text-align:center;"><small>Payable Days</small><br><strong>31</strong></div>
                    <div class="card" style="padding:12px;text-align:center;"><small>LOP Days</small><br><strong>0</strong></div>
                    <div class="card" style="padding:12px;text-align:center;"><small>OT Hours</small><br><strong>0</strong></div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
                    <div>
                        <h4 style="color:#27ae60;margin-bottom:10px;">Earnings</h4>
                        <table class="data-table">
                            <tbody>
                                <tr><td>Basic</td><td style="text-align:right;">${formatCurrency(basic)}</td></tr>
                                <tr><td>House Rent Allowance</td><td style="text-align:right;">${formatCurrency(hra)}</td></tr>
                                <tr><td>Conveyance Allowance</td><td style="text-align:right;">${formatCurrency(conv)}</td></tr>
                                <tr><td>Site Allowance</td><td style="text-align:right;">${formatCurrency(siteAllow)}</td></tr>
                                <tr style="font-weight:bold;border-top:2px solid #ddd;"><td>Gross Earnings</td><td style="text-align:right;">${formatCurrency(gross)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4 style="color:#e74c3c;margin-bottom:10px;">Deductions</h4>
                        <table class="data-table">
                            <tbody>
                                <tr><td>PF (Employee)</td><td style="text-align:right;">${formatCurrency(pfEmp)}</td></tr>
                                <tr><td>Advance Recovery</td><td style="text-align:right;">${formatCurrency(advanceRecovery)}</td></tr>
                                <tr style="font-weight:bold;border-top:2px solid #ddd;"><td>Total Deductions</td><td style="text-align:right;">${formatCurrency(totalDeductions)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">
                    <h4 style="color:#666;margin-bottom:10px;"><i class="fas fa-building"></i> Employer Contributions</h4>
                    <p style="font-size:12px;color:#888;margin-bottom:10px;">Paid by the company — not deducted from salary. Shown for the full cost-to-company picture.</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:13px;">
                        <div>PF (Employer): ${formatCurrency(pfEmployer)}</div>
                        <div>EPS (Employer): ${formatCurrency(epsEmployer)}</div>
                        <div>EDLI: ${formatCurrency(edli)}</div>
                        <div>PF Admin Charges: ${formatCurrency(pfAdmin)}</div>
                        <div>Gratuity Provision: ${formatCurrency(gratuity)}</div>
                        <div>Bonus Provision: ${formatCurrency(bonusProv)}</div>
                    </div>
                    <p style="margin-top:10px;font-weight:bold;">Total employer cost: ${formatCurrency(totalEmployer)}</p>
                </div>

                <div style="background:#eafaf1;padding:20px;border-radius:8px;text-align:center;">
                    <div style="display:flex;justify-content:space-around;margin-bottom:15px;">
                        <div><small>Gross Earnings</small><br><strong style="color:#27ae60;font-size:18px;">${formatCurrency(gross)}</strong></div>
                        <div><small>Total Deductions</small><br><strong style="color:#e74c3c;font-size:18px;">-${formatCurrency(totalDeductions)}</strong></div>
                    </div>
                    <div style="font-size:28px;font-weight:bold;color:#2c3e50;">Net Pay: ${formatCurrency(netPay)}</div>
                    <p style="margin-top:10px;color:#666;">Rupees ${numberToWords(netPay)} Only</p>
                    <p style="margin-top:8px;font-size:11px;color:#888;">PF wages ${formatCurrency(basic)} · EPS wages ${formatCurrency(basic)} · ESIC wages ₹0 · Bonus wages ${formatCurrency(basic)}</p>
                </div>
                <p style="text-align:center;margin-top:15px;font-size:11px;color:#999;">Computer-generated payslip — no signature required</p>
            </div>
        </div>`;
}

function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    let str = '';
    if (num >= 100000) { str += ones[Math.floor(num / 100000)] + ' Lakh '; num %= 100000; }
    if (num >= 1000) { str += ones[Math.floor(num / 1000)] + ' Thousand '; num %= 1000; }
    if (num >= 100) { str += ones[Math.floor(num / 100)] + ' Hundred '; num %= 100; }
    if (num >= 20) { str += tens[Math.floor(num / 10)] + ' '; num %= 10; }
    if (num > 0) { str += ones[num] + ' '; }
    return str.trim();
}
