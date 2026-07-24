// HR & Payroll Module

// ===== EMPLOYEES =====
function renderEmployees(container) {
    const data = AppData;
    container.innerHTML = `
        <div class="page-header">
            <h1>Employees</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="openAddEmployeeModal()"><i class="fas fa-plus"></i> Add Employee</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <input type="text" id="emp-search" placeholder="Search name, code, mobile..." oninput="filterEmployees()">
                    <select id="emp-dept-filter" onchange="filterEmployees()">
                        <option value="">All Departments</option>
                        ${[...new Set(data.employees.map(e=>e.department))].map(d => `<option value="${d}">${d}</option>`).join('')}
                    </select>
                    <select id="emp-status-filter" onchange="filterEmployees()">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <table>
                <thead><tr>
                    <th>Code</th><th>Name</th><th>Department</th><th>Designation</th><th>Mobile</th><th>Project</th><th>Documents</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody id="employees-tbody">
                    ${renderEmployeeRows(data.employees)}
                </tbody>
            </table>
            <div class="pagination">
                <div class="pagination-info">Showing ${data.employees.length} of ${data.employees.length} employees</div>
            </div>
        </div>
    `;
}

function renderEmployeeRows(employees) {
    return employees.map(e => `
        <tr>
            <td><strong>${e.id}</strong></td>
            <td>${e.name}</td>
            <td>${e.department}</td>
            <td>${e.designation}</td>
            <td>${e.mobile}</td>
            <td>${e.project}</td>
            <td><div style="display:flex;align-items:center">${getDocProgress(e.docs)}</div></td>
            <td>${getStatusBadge(e.status)}</td>
            <td class="actions">
                <button class="btn-view" onclick="viewEmployee('${e.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn-edit" onclick="editEmployee('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteEmployee('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterEmployees() {
    const search = document.getElementById('emp-search').value.toLowerCase();
    const dept = document.getElementById('emp-dept-filter').value;
    const status = document.getElementById('emp-status-filter').value;
    let filtered = AppData.employees.filter(e => {
        const matchSearch = !search || e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.mobile.includes(search);
        const matchDept = !dept || e.department === dept;
        const matchStatus = !status || e.status === status;
        return matchSearch && matchDept && matchStatus;
    });
    document.getElementById('employees-tbody').innerHTML = renderEmployeeRows(filtered);
}

function openAddEmployeeModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Employee Code</label><input type="text" id="emp-code" value="${generateId('EMP')}"></div>
            <div class="form-group"><label>Full Name</label><input type="text" id="emp-name" required></div>
            <div class="form-group"><label>Date of Birth</label><input type="date" id="emp-dob"></div>
            <div class="form-group"><label>Gender</label><select id="emp-gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div class="form-group"><label>Department</label><select id="emp-department">
                <option>Civil Engineering</option><option>Accounts & Finance</option><option>Site Operations & Maintenance</option>
                <option>Plant & Machinery</option><option>Quality Assurance & Control</option><option>Electrical & Mechanical</option>
                <option>Stores & Procurement</option><option>Health, Safety & Environment</option>
            </select></div>
            <div class="form-group"><label>Designation</label><input type="text" id="emp-designation"></div>
            <div class="form-group"><label>Employment Type</label><select id="emp-type"><option>Full Time</option><option>Contract</option><option>Daily Wage</option></select></div>
            <div class="form-group"><label>Date of Joining</label><input type="date" id="emp-joining"></div>
            <div class="form-group"><label>Project</label><select id="emp-project">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Mobile</label><input type="text" id="emp-mobile"></div>
            <div class="form-group"><label>Email</label><input type="email" id="emp-email"></div>
            <div class="form-group full-width"><label>Address</label><input type="text" id="emp-address"></div>
            <div class="form-group"><label>Basic Salary</label><input type="number" id="emp-basic" value="15000"></div>
            <div class="form-group"><label>HRA</label><input type="number" id="emp-hra" value="6000"></div>
            <div class="form-group"><label>Conveyance</label><input type="number" id="emp-conv" value="1600"></div>
            <div class="form-group"><label>Site Allowance</label><input type="number" id="emp-site" value="2400"></div>
            <div class="form-group"><label>Bank Name</label><input type="text" id="emp-bank"></div>
            <div class="form-group"><label>Account Number</label><input type="text" id="emp-account"></div>
            <div class="form-group"><label>IFSC Code</label><input type="text" id="emp-ifsc"></div>
            <div class="form-group"><label>UAN Number</label><input type="text" id="emp-uan"></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewEmployee()">Save Employee</button>`;
    openModal('Add Employee', body, footer);
}

function saveNewEmployee() {
    const name = document.getElementById('emp-name').value;
    if (!name) { toast('Name is required', 'error'); return; }
    const emp = {
        id: document.getElementById('emp-code').value,
        name: name,
        department: document.getElementById('emp-department').value,
        designation: document.getElementById('emp-designation').value,
        mobile: document.getElementById('emp-mobile').value,
        project: document.getElementById('emp-project').value,
        company: 'Demo Constructions Pvt Ltd',
        status: 'Active',
        dob: document.getElementById('emp-dob').value,
        gender: document.getElementById('emp-gender').value,
        email: document.getElementById('emp-email').value,
        address: document.getElementById('emp-address').value,
        joiningDate: document.getElementById('emp-joining').value,
        type: document.getElementById('emp-type').value,
        basicSalary: parseInt(document.getElementById('emp-basic').value) || 0,
        hra: parseInt(document.getElementById('emp-hra').value) || 0,
        conveyance: parseInt(document.getElementById('emp-conv').value) || 0,
        siteAllowance: parseInt(document.getElementById('emp-site').value) || 0,
        pfApplicable: true,
        esicApplicable: false,
        bankName: document.getElementById('emp-bank').value,
        accountNo: document.getElementById('emp-account').value,
        ifsc: document.getElementById('emp-ifsc').value,
        uan: document.getElementById('emp-uan').value,
        docs: 0
    };
    AppData.employees.push(emp);
    saveData(AppData);
    closeModal();
    toast('Employee added successfully', 'success');
    renderEmployees(document.getElementById('page-content'));
}

function viewEmployee(id) {
    const emp = AppData.employees.find(e => e.id === id);
    if (!emp) return;
    const gross = emp.basicSalary + emp.hra + emp.conveyance + emp.siteAllowance;
    const body = `
        <div style="display:flex;gap:20px;margin-bottom:16px">
            <div class="avatar" style="width:60px;height:60px;font-size:20px">${emp.name.split(' ').map(n=>n[0]).join('')}</div>
            <div>
                <h3 style="margin-bottom:4px">${emp.name}</h3>
                <p style="color:#6b7280;font-size:13px">${emp.id} • ${emp.designation}</p>
                <p style="color:#6b7280;font-size:13px">${emp.department} • ${emp.project}</p>
                ${getStatusBadge(emp.status)}
            </div>
        </div>
        <div class="tabs" id="emp-detail-tabs">
            <div class="tab active" onclick="showEmpTab('overview','${id}')">Overview</div>
            <div class="tab" onclick="showEmpTab('salary','${id}')">Salary</div>
            <div class="tab" onclick="showEmpTab('personal','${id}')">Personal</div>
        </div>
        <div id="emp-tab-content">
            <table>
                <tr><td><strong>Employee Code</strong></td><td>${emp.id}</td></tr>
                <tr><td><strong>Company</strong></td><td>${emp.company}</td></tr>
                <tr><td><strong>Department</strong></td><td>${emp.department}</td></tr>
                <tr><td><strong>Designation</strong></td><td>${emp.designation}</td></tr>
                <tr><td><strong>Project</strong></td><td>${emp.project}</td></tr>
                <tr><td><strong>Mobile</strong></td><td>${emp.mobile}</td></tr>
                <tr><td><strong>Email</strong></td><td>${emp.email || '-'}</td></tr>
                <tr><td><strong>Joining Date</strong></td><td>${formatDate(emp.joiningDate)}</td></tr>
                <tr><td><strong>Type</strong></td><td>${emp.type}</td></tr>
                <tr><td><strong>Gross Salary</strong></td><td>${formatCurrency(gross)}</td></tr>
            </table>
        </div>
    `;
    openModal('Employee Details', body);
}

function editEmployee(id) {
    const emp = AppData.employees.find(e => e.id === id);
    if (!emp) return;
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Full Name</label><input type="text" id="edit-emp-name" value="${emp.name}"></div>
            <div class="form-group"><label>Designation</label><input type="text" id="edit-emp-designation" value="${emp.designation}"></div>
            <div class="form-group"><label>Mobile</label><input type="text" id="edit-emp-mobile" value="${emp.mobile}"></div>
            <div class="form-group"><label>Project</label><select id="edit-emp-project">${AppData.projects.map(p=>`<option ${p.name===emp.project?'selected':''}>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Basic Salary</label><input type="number" id="edit-emp-basic" value="${emp.basicSalary}"></div>
            <div class="form-group"><label>Status</label><select id="edit-emp-status"><option ${emp.status==='Active'?'selected':''}>Active</option><option ${emp.status==='Inactive'?'selected':''}>Inactive</option></select></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveEditEmployee('${id}')">Save Changes</button>`;
    openModal('Edit Employee', body, footer);
}

function saveEditEmployee(id) {
    const emp = AppData.employees.find(e => e.id === id);
    emp.name = document.getElementById('edit-emp-name').value;
    emp.designation = document.getElementById('edit-emp-designation').value;
    emp.mobile = document.getElementById('edit-emp-mobile').value;
    emp.project = document.getElementById('edit-emp-project').value;
    emp.basicSalary = parseInt(document.getElementById('edit-emp-basic').value) || 0;
    emp.status = document.getElementById('edit-emp-status').value;
    saveData(AppData);
    closeModal();
    toast('Employee updated successfully', 'success');
    renderEmployees(document.getElementById('page-content'));
}

function deleteEmployee(id) {
    showConfirm('Delete Employee', 'Are you sure you want to delete this employee? This action cannot be undone.', function(result) {
        if (result) {
            AppData.employees = AppData.employees.filter(e => e.id !== id);
            saveData(AppData);
            toast('Employee deleted successfully', 'success');
            renderEmployees(document.getElementById('page-content'));
        }
    });
}

// ===== ATTENDANCE =====
function renderAttendance(container) {
    const today = new Date().toISOString().split('T')[0];
    container.innerHTML = `
        <div class="page-header">
            <h1>Attendance</h1>
            <div class="page-header-actions">
                <button class="btn btn-outline" onclick="showExceptions()"><i class="fas fa-exclamation-triangle"></i> Exceptions</button>
                <button class="btn btn-outline" onclick="showHolidays()"><i class="fas fa-calendar"></i> Holidays</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <input type="text" id="att-search" placeholder="Search name or code..." oninput="filterAttendance()">
                    <select id="att-project" onchange="filterAttendance()">
                        <option value="">All Sites</option>
                        ${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}
                    </select>
                    <input type="date" id="att-date" value="${today}" onchange="filterAttendance()">
                </div>
            </div>
            <table>
                <thead><tr>
                    <th>#</th><th>Emp Code</th><th>Employee</th><th>Project</th><th>Department</th><th>In</th><th>Out</th><th>OT</th><th>Worked</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody id="attendance-tbody">
                    ${renderAttendanceRows(AppData.attendance)}
                </tbody>
            </table>
        </div>
    `;
}

function renderAttendanceRows(records) {
    return records.map((a, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${a.empCode}</td>
            <td>${a.employee}</td>
            <td>${a.project}</td>
            <td>${a.department}</td>
            <td>${a.inTime}</td>
            <td>${a.outTime}</td>
            <td>${a.ot}</td>
            <td>${a.worked}</td>
            <td>${getStatusBadge(a.status)}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editAttendance('${a.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterAttendance() {
    const search = document.getElementById('att-search').value.toLowerCase();
    const project = document.getElementById('att-project').value;
    let filtered = AppData.attendance.filter(a => {
        const matchSearch = !search || a.employee.toLowerCase().includes(search) || a.empCode.toLowerCase().includes(search);
        const matchProject = !project || a.project === project;
        return matchSearch && matchProject;
    });
    document.getElementById('attendance-tbody').innerHTML = renderAttendanceRows(filtered);
}

function editAttendance(id) {
    const att = AppData.attendance.find(a => a.id === id);
    if (!att) return;
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Employee</label><input type="text" value="${att.employee}" disabled></div>
            <div class="form-group"><label>Date</label><input type="text" value="${att.date}" disabled></div>
            <div class="form-group"><label>In Time</label><input type="text" id="edit-att-in" value="${att.inTime}"></div>
            <div class="form-group"><label>Out Time</label><input type="text" id="edit-att-out" value="${att.outTime}"></div>
            <div class="form-group"><label>Status</label><select id="edit-att-status">
                <option ${att.status==='Complete'?'selected':''}>Complete</option>
                <option ${att.status==='Absent'?'selected':''}>Absent</option>
                <option ${att.status==='Half Day'?'selected':''}>Half Day</option>
                <option ${att.status==='On Leave'?'selected':''}>On Leave</option>
            </select></div>
            <div class="form-group"><label>Remarks</label><input type="text" id="edit-att-remarks"></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveAttendance('${id}')">Save</button>`;
    openModal('Edit Attendance', body, footer);
}

function saveAttendance(id) {
    const att = AppData.attendance.find(a => a.id === id);
    att.inTime = document.getElementById('edit-att-in').value;
    att.outTime = document.getElementById('edit-att-out').value;
    att.status = document.getElementById('edit-att-status').value;
    if (att.status === 'Absent' || att.status === 'On Leave') { att.inTime = '-'; att.outTime = '-'; att.worked = '-'; }
    saveData(AppData);
    closeModal();
    toast('Attendance updated', 'success');
    renderAttendance(document.getElementById('page-content'));
}

function showExceptions() {
    const body = `
        <p style="margin-bottom:12px;color:#6b7280">Punch exceptions for this month</p>
        <table>
            <thead><tr><th>Exception</th><th>Employee</th><th>Date</th><th>Location</th><th>Detail</th></tr></thead>
            <tbody>
                <tr><td><span class="badge-status badge-red">Outside geofence</span></td><td>Ramesh Kumar (EMP-0001)</td><td>17 Jul 2026</td><td>26.9124, 75.7873</td><td>Punch outside the site geofence</td></tr>
                <tr><td><span class="badge-status badge-red">Mock location</span></td><td>Ramesh Kumar (EMP-0001)</td><td>17 Jul 2026</td><td>26.9124, 75.7873</td><td>Mock/fake GPS detected — punch rejected</td></tr>
            </tbody>
        </table>
    `;
    openModal('Punch Exceptions', body);
}

function showHolidays() {
    const body = `
        <table>
            <thead><tr><th>Date</th><th>Day</th><th>Holiday</th><th>Type</th></tr></thead>
            <tbody>
                <tr><td>26 Jan 2026</td><td>Monday</td><td>Republic Day</td><td><span class="badge-status badge-blue">National</span></td></tr>
                <tr><td>14 Apr 2026</td><td>Tuesday</td><td>Dr. Ambedkar Jayanti</td><td><span class="badge-status badge-blue">National</span></td></tr>
                <tr><td>01 May 2026</td><td>Friday</td><td>May Day</td><td><span class="badge-status badge-gray">Optional</span></td></tr>
                <tr><td>15 Aug 2026</td><td>Saturday</td><td>Independence Day</td><td><span class="badge-status badge-blue">National</span></td></tr>
                <tr><td>02 Oct 2026</td><td>Friday</td><td>Gandhi Jayanti</td><td><span class="badge-status badge-blue">National</span></td></tr>
                <tr><td>20 Oct 2026</td><td>Tuesday</td><td>Dussehra</td><td><span class="badge-status badge-yellow">State</span></td></tr>
                <tr><td>14 Nov 2026</td><td>Saturday</td><td>Diwali</td><td><span class="badge-status badge-yellow">State</span></td></tr>
                <tr><td>25 Dec 2026</td><td>Friday</td><td>Christmas</td><td><span class="badge-status badge-gray">Optional</span></td></tr>
            </tbody>
        </table>
    `;
    openModal('Holidays 2026', body);
}

// ===== LEAVE =====
function renderLeave(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Leave Summary</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="openNewLeaveModal()"><i class="fas fa-plus"></i> New Leave Request</button>
            </div>
        </div>
        <div class="table-container" style="margin-bottom:20px">
            <div class="table-toolbar"><strong>Leave Balances (Ramesh Kumar - EMP-0001)</strong></div>
            <table>
                <thead><tr><th>Leave Type</th><th>Opening</th><th>Accrued</th><th>Used</th><th>Balance</th></tr></thead>
                <tbody>
                    <tr><td>Earned Leave</td><td>0</td><td>6</td><td>2</td><td><strong>4</strong></td></tr>
                    <tr><td>Casual Leave</td><td>0</td><td>2.33</td><td>0</td><td><strong>2.33</strong></td></tr>
                    <tr><td>Sick Leave</td><td>0</td><td>2.33</td><td>0</td><td><strong>2.33</strong></td></tr>
                    <tr><td>Leave Without Pay</td><td>0</td><td>0</td><td>0</td><td><strong>0</strong></td></tr>
                </tbody>
            </table>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <strong>All Leave Applications</strong>
                <div class="table-filters">
                    <select id="leave-status-filter" onchange="filterLeaves()">
                        <option value="">All Statuses</option>
                        <option>Pending</option><option>Approved</option><option>Rejected</option><option>Cancelled</option>
                    </select>
                </div>
            </div>
            <table>
                <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="leaves-tbody">
                    ${renderLeaveRows(AppData.leaves)}
                </tbody>
            </table>
        </div>
    `;
}

function renderLeaveRows(leaves) {
    return leaves.map(l => `
        <tr>
            <td>${l.employee}</td>
            <td>${l.type}</td>
            <td>${formatDate(l.from)} — ${formatDate(l.to)}</td>
            <td>${l.days}</td>
            <td>${l.reason}</td>
            <td>${getStatusBadge(l.status)}</td>
            <td class="actions">
                ${l.status === 'Pending' ? `
                    <button class="btn btn-sm btn-success" onclick="approveLeave('${l.id}')">Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectLeave('${l.id}')">Reject</button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function filterLeaves() {
    const status = document.getElementById('leave-status-filter').value;
    let filtered = AppData.leaves;
    if (status) filtered = filtered.filter(l => l.status === status);
    document.getElementById('leaves-tbody').innerHTML = renderLeaveRows(filtered);
}

function approveLeave(id) {
    showConfirm('Approve Leave', 'Are you sure you want to approve this leave request?', function(result) {
        if (result) {
            const leave = AppData.leaves.find(l => l.id === id);
            leave.status = 'Approved';
            saveData(AppData);
            toast('Leave approved', 'success');
            renderLeave(document.getElementById('page-content'));
        }
    });
}

function rejectLeave(id) {
    const leave = AppData.leaves.find(l => l.id === id);
    leave.status = 'Rejected';
    leave.remarks = 'Insufficient leave balance';
    saveData(AppData);
    toast('Leave rejected', 'success');
    renderLeave(document.getElementById('page-content'));
}

function openNewLeaveModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Employee</label><select id="leave-emp">${AppData.employees.map(e=>`<option value="${e.id}">${e.name} (${e.id})</option>`).join('')}</select></div>
            <div class="form-group"><label>Leave Type</label><select id="leave-type"><option>Earned Leave</option><option>Casual Leave</option><option>Sick Leave</option><option>Leave Without Pay</option></select></div>
            <div class="form-group"><label>From Date</label><input type="date" id="leave-from"></div>
            <div class="form-group"><label>To Date</label><input type="date" id="leave-to"></div>
            <div class="form-group full-width"><label>Reason</label><textarea id="leave-reason"></textarea></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewLeave()">Submit Request</button>`;
    openModal('New Leave Request', body, footer);
}

function saveNewLeave() {
    const empId = document.getElementById('leave-emp').value;
    const emp = AppData.employees.find(e => e.id === empId);
    const from = document.getElementById('leave-from').value;
    const to = document.getElementById('leave-to').value;
    if (!from || !to) { toast('Please select dates', 'error'); return; }
    const days = Math.ceil((new Date(to) - new Date(from)) / (1000*60*60*24)) + 1;
    AppData.leaves.unshift({
        id: generateId('LV'),
        employeeId: empId,
        employee: emp.name,
        type: document.getElementById('leave-type').value,
        from, to, days,
        reason: document.getElementById('leave-reason').value,
        status: 'Pending',
        remarks: ''
    });
    saveData(AppData);
    closeModal();
    toast('Leave request submitted', 'success');
    renderLeave(document.getElementById('page-content'));
}

// ===== PAYROLL =====
function renderPayroll(container) {
    if (AppData.payrollRuns.length === 0) generatePayrollData();
    container.innerHTML = `
        <div class="page-header">
            <h1>Payroll Runs</h1>
            <div class="page-header-actions">
                <button class="btn btn-outline" onclick="showBankSheet()"><i class="fas fa-university"></i> Bank Sheet</button>
                <button class="btn btn-primary" onclick="runPayroll()"><i class="fas fa-play"></i> Run Payroll</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <strong>July 2026</strong>
            </div>
            <table>
                <thead><tr><th>Emp Code</th><th>Employee</th><th>Department</th><th>Days</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    ${AppData.payrollRuns.map(p => `
                        <tr>
                            <td>${p.empCode}</td>
                            <td>${p.employee}</td>
                            <td>${p.department}</td>
                            <td>${p.days}</td>
                            <td>${formatCurrency(p.basic)}</td>
                            <td>${formatCurrency(p.allowances)}</td>
                            <td>${formatCurrency(p.deductions)}</td>
                            <td><strong>${formatCurrency(p.netPay)}</strong></td>
                            <td>${getStatusBadge(p.status)}</td>
                            <td class="actions"><button class="btn-view" onclick="viewSalarySlip('${p.empCode}')" title="View Slip"><i class="fas fa-file-alt"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generatePayrollData() {
    AppData.payrollRuns = AppData.employees.map(emp => {
        const allowances = emp.hra + emp.conveyance + emp.siteAllowance;
        const pfDeduction = emp.pfApplicable ? Math.round(emp.basicSalary * 0.12) : 0;
        const loan = AppData.loans.find(l => l.employeeId === emp.id && l.status === 'Active');
        const loanEmi = loan ? loan.emi : 0;
        const deductions = pfDeduction + loanEmi;
        const gross = emp.basicSalary + allowances;
        const netPay = gross - deductions;
        return {
            empCode: emp.id,
            employee: emp.name,
            department: emp.department,
            days: 31,
            basic: emp.basicSalary,
            allowances,
            deductions,
            netPay,
            status: 'Processed'
        };
    });
    saveData(AppData);
}

function runPayroll() {
    showConfirm('Run Payroll', 'Run payroll for July 2026 for all active employees?', function(result) {
        if (result) {
            generatePayrollData();
            AppData.payrollRuns.forEach(p => p.status = 'Processed');
            saveData(AppData);
            toast('Payroll processed successfully', 'success');
            renderPayroll(document.getElementById('page-content'));
        }
    });
}

function viewSalarySlip(empCode) {
    const emp = AppData.employees.find(e => e.id === empCode);
    if (!emp) return;
    const allowances = emp.hra + emp.conveyance + emp.siteAllowance;
    const gross = emp.basicSalary + allowances;
    const pfEmp = emp.pfApplicable ? Math.round(emp.basicSalary * 0.12) : 0;
    const loan = AppData.loans.find(l => l.employeeId === emp.id && l.status === 'Active');
    const loanEmi = loan ? loan.emi : 0;
    const totalDeductions = pfEmp + loanEmi;
    const netPay = gross - totalDeductions;
    const pfEmployer = Math.round(emp.basicSalary * 0.0367);
    const eps = Math.round(emp.basicSalary * 0.0833);
    const edli = 75;
    const pfAdmin = 75;
    const gratuity = Math.round(emp.basicSalary * 0.0481);
    const bonus = Math.round(emp.basicSalary * 0.0389);

    const body = `
        <div class="slip-header">
            <p><strong>Emp Code:</strong> ${emp.id}</p>
            <p><strong>Name:</strong> ${emp.name}</p>
            <p><strong>Designation:</strong> ${emp.designation}</p>
            <p><strong>Department:</strong> ${emp.department}</p>
            <p><strong>Project:</strong> ${emp.project}</p>
            <p><strong>Joining:</strong> ${formatDate(emp.joiningDate)}</p>
            <p><strong>UAN:</strong> ${emp.uan}</p>
            <p><strong>Bank:</strong> ${emp.bankName}</p>
            <p><strong>A/C:</strong> XXXXXX${emp.accountNo.slice(-4)}</p>
            <p><strong>Payment Mode:</strong> BANK</p>
        </div>
        <div class="slip-summary">
            <div class="slip-summary-box"><div class="value">31</div><div class="label">Month Days</div></div>
            <div class="slip-summary-box"><div class="value">31</div><div class="label">Payable Days</div></div>
            <div class="slip-summary-box"><div class="value">0</div><div class="label">LOP Days</div></div>
            <div class="slip-summary-box"><div class="value">0</div><div class="label">OT Hours</div></div>
        </div>
        <table class="slip-table"><thead><tr><th>Earnings</th><th style="text-align:right">Amount</th></tr></thead><tbody>
            <tr><td>Basic</td><td style="text-align:right">${formatCurrency(emp.basicSalary)}</td></tr>
            <tr><td>House Rent Allowance</td><td style="text-align:right">${formatCurrency(emp.hra)}</td></tr>
            <tr><td>Conveyance Allowance</td><td style="text-align:right">${formatCurrency(emp.conveyance)}</td></tr>
            <tr><td>Site Allowance</td><td style="text-align:right">${formatCurrency(emp.siteAllowance)}</td></tr>
        </tbody></table>
        <table class="slip-table"><thead><tr><th>Deductions</th><th style="text-align:right">Amount</th></tr></thead><tbody>
            ${pfEmp ? `<tr><td>PF (Employee 12%)</td><td style="text-align:right">${formatCurrency(pfEmp)}</td></tr>` : ''}
            ${loanEmi ? `<tr><td>Advance Recovery</td><td style="text-align:right">${formatCurrency(loanEmi)}</td></tr>` : ''}
        </tbody></table>
        <div class="slip-employer">
            <p><strong>Employer Contributions</strong> (not deducted from salary)</p>
            <p>PF (Employer): ${formatCurrency(pfEmployer)} • EPS: ${formatCurrency(eps)} • EDLI: ${formatCurrency(edli)}</p>
            <p>PF Admin: ${formatCurrency(pfAdmin)} • Gratuity: ${formatCurrency(gratuity)} • Bonus: ${formatCurrency(bonus)}</p>
        </div>
        <div class="slip-net">
            <div>Gross: ${formatCurrency(gross)} | Deductions: −${formatCurrency(totalDeductions)}</div>
            <div class="amount">${formatCurrency(netPay)}</div>
            <div class="words">Net Pay</div>
        </div>
    `;
    const footer = `<button class="btn btn-primary" onclick="toast('Downloading salary slip...','info');closeModal()"><i class="fas fa-download"></i> Download</button>`;
    openModal('Salary Slip — ' + emp.name, body, footer);
}

function showBankSheet() {
    const body = `
        <table>
            <thead><tr><th>Employee</th><th>Bank</th><th>Account No</th><th>IFSC</th><th>Net Pay</th></tr></thead>
            <tbody>
                ${AppData.employees.map(emp => {
                    const pr = AppData.payrollRuns.find(p => p.empCode === emp.id);
                    return `<tr><td>${emp.name}</td><td>${emp.bankName}</td><td>${emp.accountNo}</td><td>${emp.ifsc}</td><td>${formatCurrency(pr ? pr.netPay : 0)}</td></tr>`;
                }).join('')}
            </tbody>
        </table>
    `;
    const footer = `<button class="btn btn-primary" onclick="toast('Bank file exported (mocked)','info');closeModal()"><i class="fas fa-download"></i> Export to Bank</button>`;
    openModal('Bank Salary Sheet — July 2026', body, footer);
}

// ===== CHALLANS =====
function renderChallans(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Challans</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="toast('ECR file downloaded (mocked)','info')"><i class="fas fa-download"></i> Generate Challan</button>
            </div>
        </div>
        <div class="tabs">
            <div class="tab active" onclick="showChallanTab('pf')">PF Challan</div>
            <div class="tab" onclick="showChallanTab('esic')">ESIC Challan</div>
        </div>
        <div class="table-container" id="challan-content">
            <table>
                <thead><tr><th>Emp Code</th><th>Employee</th><th>UAN</th><th>PF Wages</th><th>Employee PF (12%)</th><th>Employer PF (3.67%)</th><th>EPS (8.33%)</th><th>EDLI</th><th>Total</th></tr></thead>
                <tbody>
                    ${AppData.employees.filter(e=>e.pfApplicable).map(emp => {
                        const empPf = Math.round(emp.basicSalary * 0.12);
                        const erPf = Math.round(emp.basicSalary * 0.0367);
                        const eps = Math.round(emp.basicSalary * 0.0833);
                        const edli = 75;
                        const total = empPf + erPf + eps + edli + 75;
                        return `<tr><td>${emp.id}</td><td>${emp.name}</td><td>${emp.uan}</td><td>${formatCurrency(emp.basicSalary)}</td><td>${formatCurrency(empPf)}</td><td>${formatCurrency(erPf)}</td><td>${formatCurrency(eps)}</td><td>${formatCurrency(edli)}</td><td><strong>${formatCurrency(total)}</strong></td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showChallanTab(tab) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('challan-content');
    if (tab === 'esic') {
        content.innerHTML = `<table>
            <thead><tr><th>Emp Code</th><th>Employee</th><th>ESIC Wages</th><th>Employee ESIC (0.75%)</th><th>Employer ESIC (3.25%)</th><th>Total</th></tr></thead>
            <tbody>
                ${AppData.employees.filter(e=>e.esicApplicable).map(emp => {
                    const gross = emp.basicSalary + emp.hra + emp.conveyance + emp.siteAllowance;
                    const empEsic = Math.round(gross * 0.0075);
                    const erEsic = Math.round(gross * 0.0325);
                    return `<tr><td>${emp.id}</td><td>${emp.name}</td><td>${formatCurrency(gross)}</td><td>${formatCurrency(empEsic)}</td><td>${formatCurrency(erEsic)}</td><td><strong>${formatCurrency(empEsic+erEsic)}</strong></td></tr>`;
                }).join('')}
            </tbody>
        </table>`;
    } else {
        renderChallans(document.getElementById('page-content'));
    }
}

// ===== LOANS =====
function renderLoans(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Loans</h1>
            <div class="page-header-actions">
                <button class="btn btn-primary" onclick="openNewLoanModal()"><i class="fas fa-plus"></i> New Loan</button>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead><tr><th>Loan ID</th><th>Employee</th><th>Amount</th><th>EMI</th><th>Disbursed</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    ${AppData.loans.map(l => `
                        <tr>
                            <td><strong>${l.id}</strong></td>
                            <td>${l.employee}</td>
                            <td>${formatCurrency(l.amount)}</td>
                            <td>${formatCurrency(l.emi)}</td>
                            <td>${formatDate(l.disbursedOn)}</td>
                            <td>${formatCurrency(l.paid)}</td>
                            <td>${formatCurrency(l.balance)}</td>
                            <td>${getStatusBadge(l.status)}</td>
                            <td class="actions">
                                <button class="btn-view" onclick="viewLoan('${l.id}')"><i class="fas fa-eye"></i></button>
                                <button class="btn-delete" onclick="deleteLoan('${l.id}')"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function openNewLoanModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group"><label>Employee</label><select id="loan-emp">${AppData.employees.map(e=>`<option value="${e.id}">${e.name} (${e.id})</option>`).join('')}</select></div>
            <div class="form-group"><label>Loan Amount</label><input type="number" id="loan-amount"></div>
            <div class="form-group"><label>EMI per Month</label><input type="number" id="loan-emi"></div>
            <div class="form-group"><label>Disbursement Date</label><input type="date" id="loan-date"></div>
            <div class="form-group full-width"><label>Reason</label><input type="text" id="loan-reason"></div>
        </div>
    `;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveNewLoan()">Save Loan</button>`;
    openModal('New Loan', body, footer);
}

function saveNewLoan() {
    const empId = document.getElementById('loan-emp').value;
    const emp = AppData.employees.find(e => e.id === empId);
    const amount = parseInt(document.getElementById('loan-amount').value) || 0;
    if (!amount) { toast('Amount is required', 'error'); return; }
    AppData.loans.push({
        id: generateId('LOAN'),
        employeeId: empId,
        employee: emp.name,
        amount,
        emi: parseInt(document.getElementById('loan-emi').value) || 0,
        disbursedOn: document.getElementById('loan-date').value,
        paid: 0,
        balance: amount,
        status: 'Active',
        reason: document.getElementById('loan-reason').value
    });
    saveData(AppData);
    closeModal();
    toast('Loan created successfully', 'success');
    renderLoans(document.getElementById('page-content'));
}

function viewLoan(id) {
    const loan = AppData.loans.find(l => l.id === id);
    const months = Math.ceil(loan.amount / loan.emi);
    let schedule = '';
    let bal = loan.amount;
    for (let i = 1; i <= months; i++) {
        const paid = i <= Math.floor(loan.paid / loan.emi);
        bal -= loan.emi;
        if (bal < 0) bal = 0;
        schedule += `<tr><td>Month ${i}</td><td>${formatCurrency(loan.emi)}</td><td>${formatCurrency(Math.max(bal, 0))}</td><td>${paid ? '<span class="badge-status badge-green">Paid</span>' : '<span class="badge-status badge-yellow">Pending</span>'}</td></tr>`;
    }
    const body = `
        <p><strong>${loan.employee}</strong> — ${loan.reason}</p>
        <p style="margin:8px 0;color:#6b7280">Total: ${formatCurrency(loan.amount)} | EMI: ${formatCurrency(loan.emi)} | Paid: ${formatCurrency(loan.paid)}</p>
        <table><thead><tr><th>Month</th><th>EMI</th><th>Balance</th><th>Status</th></tr></thead><tbody>${schedule}</tbody></table>
    `;
    openModal('Loan Details — ' + loan.id, body);
}

function deleteLoan(id) {
    showConfirm('Delete Loan', 'Are you sure?', function(result) {
        if (result) {
            AppData.loans = AppData.loans.filter(l => l.id !== id);
            saveData(AppData);
            toast('Loan deleted', 'success');
            renderLoans(document.getElementById('page-content'));
        }
    });
}
