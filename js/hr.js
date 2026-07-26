// HR & Payroll Module

// ===== EMPLOYEES =====
let empPageSize = 15;
let empShowCount = 15;

function renderEmployees(container) {
    const data = AppData;
    empShowCount = empPageSize;
    container.innerHTML = `
        <div class="page-header">
            <h1>Employees</h1>
            <div class="page-header-actions">
                <button class="btn btn-secondary" onclick="openTransferModal()"><i class="fas fa-exchange-alt"></i> Transfers</button>
                <button class="btn btn-secondary" onclick="openSetupModal()"><i class="fas fa-cog"></i> Setup</button>
                <button class="btn btn-primary" onclick="openAddEmployeeModal()"><i class="fas fa-plus"></i> Add Employee</button>
            </div>
        </div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-filters">
                    <input type="text" id="emp-search" placeholder="Search name, code, mobile, company..." oninput="filterEmployees()">
                    <select id="emp-company-filter" onchange="filterEmployees()">
                        <option value="">All Companies</option>
                        ${[...new Set(data.employees.map(e=>e.company))].map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <select id="emp-status-filter" onchange="filterEmployees()">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <select id="emp-type-filter" onchange="filterEmployees()">
                        <option value="">All Types</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Daily Wage">Daily Wage</option>
                    </select>
                    <select id="emp-project-filter" onchange="filterEmployees()">
                        <option value="">All Projects</option>
                        ${[...new Set(data.employees.map(e=>e.project))].map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                </div>
            </div>
            <table>
                <thead><tr>
                    <th>Code</th><th>Name</th><th>Department</th><th>Designation</th><th>Mobile</th><th>Company</th><th>Project</th><th>Documents</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody id="employees-tbody">
                    ${renderEmployeeRows(data.employees.slice(0, empShowCount))}
                </tbody>
            </table>
            <div class="pagination" id="emp-pagination">
                <div class="pagination-info">Showing ${Math.min(empShowCount, data.employees.length)} of ${data.employees.length} employees</div>
                ${data.employees.length > empShowCount ? '<button class="btn btn-secondary" onclick="loadMoreEmployees()">Load more</button>' : ''}
            </div>
        </div>
    `;
}

function loadMoreEmployees() {
    empShowCount += empPageSize;
    const filtered = getFilteredEmployees();
    document.getElementById('employees-tbody').innerHTML = renderEmployeeRows(filtered.slice(0, empShowCount));
    document.getElementById('emp-pagination').innerHTML = `
        <div class="pagination-info">Showing ${Math.min(empShowCount, filtered.length)} of ${filtered.length} employees</div>
        ${filtered.length > empShowCount ? '<button class="btn btn-secondary" onclick="loadMoreEmployees()">Load more</button>' : ''}
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
            <td>${e.company}</td>
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

function getFilteredEmployees() {
    const search = (document.getElementById('emp-search')?.value || '').toLowerCase();
    const company = document.getElementById('emp-company-filter')?.value || '';
    const status = document.getElementById('emp-status-filter')?.value || '';
    const type = document.getElementById('emp-type-filter')?.value || '';
    const project = document.getElementById('emp-project-filter')?.value || '';
    return AppData.employees.filter(e => {
        const matchSearch = !search || e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.mobile.includes(search) || (e.company||'').toLowerCase().includes(search);
        const matchCompany = !company || e.company === company;
        const matchStatus = !status || e.status === status;
        const matchType = !type || e.type === type;
        const matchProject = !project || e.project === project;
        return matchSearch && matchCompany && matchStatus && matchType && matchProject;
    });
}

function filterEmployees() {
    empShowCount = empPageSize;
    const filtered = getFilteredEmployees();
    document.getElementById('employees-tbody').innerHTML = renderEmployeeRows(filtered.slice(0, empShowCount));
    document.getElementById('emp-pagination').innerHTML = `
        <div class="pagination-info">Showing ${Math.min(empShowCount, filtered.length)} of ${filtered.length} employees</div>
        ${filtered.length > empShowCount ? '<button class="btn btn-secondary" onclick="loadMoreEmployees()">Load more</button>' : ''}
    `;
}

function openAddEmployeeModal() {
    let currentTab = 0;
    const tabs = ['Identity','Employment','Statutory','Pay & Bank','Contact','Documents','Letters','Onboarding'];

    function getTabContent(idx) {
        switch(idx) {
            case 0: return `<div class="form-grid">
                <div class="form-group"><label>Company</label><select id="emp-company">${AppData.companies.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>Code Series</label><select id="emp-series"><option value="EMP">EMP</option><option value="DEMO">DEMO</option><option value="CONT">CONT</option></select></div>
                <div class="form-group"><label>Employee Code</label><input type="text" id="emp-code" value="${generateId('EMP')}"></div>
                <div class="form-group"><label>First Name</label><input type="text" id="emp-fname" required></div>
                <div class="form-group"><label>Last Name</label><input type="text" id="emp-lname"></div>
                <div class="form-group"><label>Date of Birth</label><input type="date" id="emp-dob"></div>
                <div class="form-group"><label>Gender</label><select id="emp-gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div class="form-group"><label>Marital Status</label><select id="emp-marital"><option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option></select></div>
            </div>`;
            case 1: return `<div class="form-grid">
                <div class="form-group"><label>Department</label><select id="emp-department">
                    <option>Civil Engineering</option><option>Accounts & Finance</option><option>Site Operations & Maintenance</option>
                    <option>Plant & Machinery</option><option>Quality Assurance & Control</option><option>Electrical & Mechanical</option>
                    <option>Stores & Procurement</option><option>Health, Safety & Environment</option>
                </select></div>
                <div class="form-group"><label>Designation</label><input type="text" id="emp-designation"></div>
                <div class="form-group"><label>Employment Type</label><select id="emp-type"><option>Full Time</option><option>Contract</option><option>Daily Wage</option></select></div>
                <div class="form-group"><label>Date of Joining</label><input type="date" id="emp-joining"></div>
                <div class="form-group"><label>Probation End Date</label><input type="date" id="emp-probation"></div>
                <div class="form-group"><label>Project / Site</label><select id="emp-project">${AppData.projects.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>Reporting To</label><select id="emp-reporting"><option value="">-- Select --</option>${AppData.employees.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select></div>
                <div class="form-group"><label>Shift</label><select id="emp-shift"><option>General</option><option>Morning</option><option>Night</option></select></div>
                <div class="form-group"><label>Confirmation Date</label><input type="date" id="emp-confirm-date"></div>
            </div>`;
            case 2: return `<div class="form-grid">
                <div class="form-group"><label>PF Applicable</label><select id="emp-pf"><option value="true">Yes</option><option value="false">No</option></select></div>
                <div class="form-group"><label>UAN Number</label><input type="text" id="emp-uan" placeholder="100XXXXXXXXX"></div>
                <div class="form-group"><label>PF Number</label><input type="text" id="emp-pfno" placeholder="RJ/JAI/XXXXX/XXX"></div>
                <div class="form-group"><label>ESIC Applicable</label><select id="emp-esic"><option value="false">No</option><option value="true">Yes</option></select></div>
                <div class="form-group"><label>ESIC Number</label><input type="text" id="emp-esicno"></div>
                <div class="form-group"><label>Aadhar Number</label><input type="text" id="emp-aadhar" placeholder="XXXX XXXX XXXX" maxlength="14"></div>
                <div class="form-group"><label>PAN Number</label><input type="text" id="emp-pan" placeholder="ABCDE1234F" maxlength="10"></div>
            </div>`;
            case 3: return `<div class="form-grid">
                <div class="form-group"><label>Basic Salary</label><input type="number" id="emp-basic" value="15000"></div>
                <div class="form-group"><label>HRA</label><input type="number" id="emp-hra" value="6000"></div>
                <div class="form-group"><label>Conveyance Allowance</label><input type="number" id="emp-conv" value="1600"></div>
                <div class="form-group"><label>Site Allowance</label><input type="number" id="emp-site" value="2400"></div>
                <div class="form-group"><label>Special Allowance</label><input type="number" id="emp-special" value="0"></div>
                <div class="form-group"><label>Payment Mode</label><select id="emp-paymode"><option>Bank</option><option>Cash</option><option>Cheque</option></select></div>
                <div class="form-group"><label>Bank Name</label><input type="text" id="emp-bank"></div>
                <div class="form-group"><label>Account Number</label><input type="text" id="emp-account"></div>
                <div class="form-group"><label>IFSC Code</label><input type="text" id="emp-ifsc"></div>
                <div class="form-group"><label>Branch</label><input type="text" id="emp-branch"></div>
            </div>`;
            case 4: return `<div class="form-grid">
                <div class="form-group"><label>Mobile</label><input type="text" id="emp-mobile" maxlength="10"></div>
                <div class="form-group"><label>Alternate Mobile</label><input type="text" id="emp-altmobile" maxlength="10"></div>
                <div class="form-group"><label>Email</label><input type="email" id="emp-email"></div>
                <div class="form-group full-width"><label>Permanent Address</label><textarea id="emp-address" rows="2"></textarea></div>
                <div class="form-group full-width"><label>Current Address</label><textarea id="emp-curaddress" rows="2"></textarea></div>
                <div class="form-group"><label>Emergency Contact Name</label><input type="text" id="emp-emgname"></div>
                <div class="form-group"><label>Emergency Contact Number</label><input type="text" id="emp-emgphone"></div>
                <div class="form-group"><label>Relationship</label><select id="emp-emgrel"><option>Father</option><option>Mother</option><option>Spouse</option><option>Sibling</option><option>Other</option></select></div>
            </div>`;
            case 5: return `<div class="form-grid">
                <div class="form-group"><label>Aadhar Card</label><input type="file" id="emp-doc-aadhar" accept=".pdf,.jpg,.jpeg,.png"><div class="doc-status" id="ds-aadhar"></div></div>
                <div class="form-group"><label>PAN Card</label><input type="file" id="emp-doc-pan" accept=".pdf,.jpg,.jpeg,.png"><div class="doc-status" id="ds-pan"></div></div>
                <div class="form-group"><label>Photo</label><input type="file" id="emp-doc-photo" accept=".jpg,.jpeg,.png"><div class="doc-status" id="ds-photo"></div></div>
                <div class="form-group"><label>Bank Passbook / Cancelled Cheque</label><input type="file" id="emp-doc-bank" accept=".pdf,.jpg,.jpeg,.png"><div class="doc-status" id="ds-bank"></div></div>
                <div class="form-group"><label>Education Certificates</label><input type="file" id="emp-doc-edu" accept=".pdf" multiple><div class="doc-status" id="ds-edu"></div></div>
                <div class="form-group"><label>Experience Letters</label><input type="file" id="emp-doc-exp" accept=".pdf" multiple><div class="doc-status" id="ds-exp"></div></div>
            </div>
            <p style="margin-top:12px;font-size:12px;color:#888;"><i class="fas fa-info-circle"></i> Accepted formats: PDF, JPG, PNG. Max 5 MB per file.</p>`;
            case 6: return `<div class="form-grid">
                <div class="form-group"><label>Offer Letter Issued</label><select id="emp-offer"><option value="false">No</option><option value="true">Yes</option></select></div>
                <div class="form-group"><label>Offer Letter Date</label><input type="date" id="emp-offer-date"></div>
                <div class="form-group"><label>Appointment Letter Issued</label><select id="emp-appt"><option value="false">No</option><option value="true">Yes</option></select></div>
                <div class="form-group"><label>Appointment Letter Date</label><input type="date" id="emp-appt-date"></div>
                <div class="form-group"><label>NDA Signed</label><select id="emp-nda"><option value="false">No</option><option value="true">Yes</option></select></div>
            </div>
            <p style="margin-top:12px;font-size:12px;color:#888;"><i class="fas fa-info-circle"></i> Letters can be generated from Templates after saving the employee.</p>`;
            case 7: return `
                <div style="margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <span style="font-size:13px;font-weight:600;">Onboarding Progress:</span>
                        <div class="progress-bar" style="flex:1;"><div class="progress-bar-fill progress-green" id="onboard-bar" style="width:0%"></div></div>
                        <span id="onboard-count" style="font-size:12px;">0/7</span>
                    </div>
                </div>
                <div class="onboarding-checklist">
                    ${['ID Card Issued','Uniform Issued','Safety Induction Done','Tools / Equipment Issued','Bank Account Verified','Biometric Enrolled','Site Access Granted'].map((item,i)=>`
                        <label style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;cursor:pointer;">
                            <input type="checkbox" class="onboard-check" data-idx="${i}" onchange="updateOnboardProgress()">
                            <span>${item}</span>
                        </label>`).join('')}
                </div>
                <p style="margin-top:12px;font-size:12px;color:#888;"><i class="fas fa-info-circle"></i> Complete all items to mark employee as fully onboarded.</p>`;
        }
    }

    function renderModal() {
        const body = `
            <div class="emp-modal-tabs">
                ${tabs.map((t,i)=>`<button class="emp-tab-btn ${i===currentTab?'active':''}" onclick="switchEmpTab(${i})">${t}</button>`).join('')}
            </div>
            <div class="emp-tab-content">${getTabContent(currentTab)}</div>
        `;
        const stepText = `<span style="color:#6b7280;font-size:13px;">Step ${currentTab+1} of ${tabs.length}</span>`;
        const prevBtn = currentTab > 0 ? `<button class="btn btn-secondary" onclick="switchEmpTab(${currentTab-1})"><i class="fas fa-arrow-left"></i> Previous</button>` : '';
        const nextBtn = currentTab < tabs.length-1 ? `<button class="btn btn-primary" onclick="switchEmpTab(${currentTab+1})">Next <i class="fas fa-arrow-right"></i></button>` : '';
        const saveBtn = currentTab === tabs.length-1 ? `<button class="btn btn-primary" onclick="saveNewEmployee()"><i class="fas fa-save"></i> Save Employee</button>` : '';
        const footer = `<div style="display:flex;align-items:center;justify-content:space-between;width:100%;">${stepText}<div style="display:flex;gap:8px;"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button>${prevBtn}${nextBtn}${saveBtn}</div></div>`;
        openModal('Add Employee', body, footer);
    }

    window.switchEmpTab = function(idx) { currentTab = idx; renderModal(); };
    window.updateOnboardProgress = function() {
        const checks = document.querySelectorAll('.onboard-check');
        const done = Array.from(checks).filter(c=>c.checked).length;
        const bar = document.getElementById('onboard-bar');
        const count = document.getElementById('onboard-count');
        if(bar) bar.style.width = Math.round((done/7)*100)+'%';
        if(count) count.textContent = done+'/7';
    };
    renderModal();
}

function saveNewEmployee() {
    const fname = document.getElementById('emp-fname');
    const name = fname ? fname.value : '';
    if (!name) { toast('First Name is required', 'error'); return; }
    const lname = document.getElementById('emp-lname');
    const fullName = name + (lname && lname.value ? ' ' + lname.value : '');

    const getVal = (id, def) => { const el = document.getElementById(id); return el ? el.value : (def||''); };
    const getNum = (id, def) => { const el = document.getElementById(id); return el ? (parseInt(el.value)||0) : (def||0); };

    // Count docs from Documents tab (3 mandatory: aadhar, pan, photo)
    let docCount = 0;
    ['emp-doc-aadhar','emp-doc-pan','emp-doc-photo'].forEach(id => { const el = document.getElementById(id); if(el && el.files && el.files.length > 0) docCount++; });

    const emp = {
        id: getVal('emp-code', generateId('EMP')),
        name: fullName,
        department: getVal('emp-department', 'Civil Engineering'),
        designation: getVal('emp-designation'),
        mobile: getVal('emp-mobile'),
        project: getVal('emp-project', ''),
        company: getVal('emp-company', AppData.companies[0]?.name || ''),
        status: 'Active',
        dob: getVal('emp-dob'),
        gender: getVal('emp-gender', 'Male'),
        email: getVal('emp-email'),
        address: getVal('emp-address'),
        joiningDate: getVal('emp-joining'),
        type: getVal('emp-type', 'Full Time'),
        basicSalary: getNum('emp-basic', 15000),
        hra: getNum('emp-hra', 6000),
        conveyance: getNum('emp-conv', 1600),
        siteAllowance: getNum('emp-site', 2400),
        pfApplicable: getVal('emp-pf','true') === 'true',
        esicApplicable: getVal('emp-esic','false') === 'true',
        bankName: getVal('emp-bank'),
        accountNo: getVal('emp-account'),
        ifsc: getVal('emp-ifsc'),
        uan: getVal('emp-uan'),
        docs: docCount
    };
    AppData.employees.push(emp);
    saveData(AppData);
    closeModal();
    toast('Employee added successfully', 'success');
    renderEmployees(document.getElementById('page-content'));
}

// ===== EMPLOYEE SETUP MODAL =====
function openSetupModal() {
    let setupTab = 0;
    const setupTabs = ['Code Series','Departments','Designations','Document Types','Shifts'];

    function getDocFlag(dt) {
        let flags = [];
        if (dt.mandatory && dt.hasNumber) return 'MandatoryNumber';
        if (dt.mandatory) return 'Mandatory';
        if (dt.hasExpiry && dt.hasNumber) return 'ExpiryNumber';
        if (dt.hasExpiry) return 'Expiry';
        if (dt.hasNumber) return 'Number';
        return '—';
    }

    function getSetupContent(idx) {
        const setup = AppData.empSetup;
        switch(idx) {
            case 0: return `
                <div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button class="btn btn-primary btn-sm" onclick="addCodeSeries()"><i class="fas fa-plus"></i> New</button></div>
                <table class="data-table"><thead><tr><th>Prefix</th><th>Company</th><th>Description</th><th>Action</th></tr></thead>
                <tbody>${setup.codeSeries.map(cs=>`<tr><td><strong>${cs.prefix}</strong></td><td>${cs.company}</td><td>${cs.description}</td><td><button class="btn-edit" onclick="editCodeSeries('${cs.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}</tbody></table>`;
            case 1: return `
                <div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button class="btn btn-primary btn-sm" onclick="addDepartment()"><i class="fas fa-plus"></i> New</button></div>
                <table class="data-table"><thead><tr><th>#</th><th>Department Name</th><th>Action</th></tr></thead>
                <tbody>${setup.departments.map((d,i)=>`<tr><td>${i+1}</td><td>${d.name}</td><td><button class="btn-edit" onclick="editDepartment('${d.id}')"><i class="fas fa-edit"></i></button> <button class="btn-delete" onclick="deleteDepartment('${d.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table>`;
            case 2: return `
                <div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button class="btn btn-primary btn-sm" onclick="addDesignation()"><i class="fas fa-plus"></i> New</button></div>
                <table class="data-table"><thead><tr><th>#</th><th>Designation</th><th>Action</th></tr></thead>
                <tbody>${setup.designations.map((d,i)=>`<tr><td>${i+1}</td><td>${d.name}</td><td><button class="btn-edit" onclick="editDesignation('${d.id}')"><i class="fas fa-edit"></i></button> <button class="btn-delete" onclick="deleteDesignation('${d.id}')"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table>`;
            case 3: return `
                <div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button class="btn btn-primary btn-sm" onclick="addDocType()"><i class="fas fa-plus"></i> New</button></div>
                <table class="data-table"><thead><tr><th>Document Type</th><th>Code</th><th>Flags</th><th>Sort</th><th>Action</th></tr></thead>
                <tbody>${setup.documentTypes.sort((a,b)=>a.sort-b.sort).map(dt=>`<tr><td>${dt.name}</td><td><code>${dt.code}</code></td><td>${getDocFlag(dt)}</td><td>${dt.sort}</td><td><button class="btn-edit" onclick="editDocType('${dt.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}</tbody></table>`;
            case 4: return `
                <div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button class="btn btn-primary btn-sm" onclick="addShift()"><i class="fas fa-plus"></i> New</button></div>
                <table class="data-table"><thead><tr><th>Shift Name</th><th>Start Time</th><th>End Time</th><th>Action</th></tr></thead>
                <tbody>${setup.shifts.map(s=>`<tr><td>${s.name}</td><td>${s.startTime}</td><td>${s.endTime}</td><td><button class="btn-edit" onclick="editShift('${s.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('')}</tbody></table>`;
        }
    }

    function renderSetup() {
        const body = `
            <div class="emp-modal-tabs">
                ${setupTabs.map((t,i)=>`<button class="emp-tab-btn ${i===setupTab?'active':''}" onclick="switchSetupTab(${i})">${t}</button>`).join('')}
            </div>
            <div class="emp-tab-content">${getSetupContent(setupTab)}</div>`;
        openModal('Employee Setup', body, '<button class="btn btn-secondary" onclick="closeModal()">Close</button>');
    }

    window.switchSetupTab = function(idx) { setupTab = idx; renderSetup(); };
    window.addCodeSeries = function() {
        const b = `<div class="form-grid"><div class="form-group"><label>Prefix</label><input type="text" id="cs-prefix"></div><div class="form-group"><label>Company</label><select id="cs-company"><option value="All">All</option>${AppData.companies.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}</select></div><div class="form-group full-width"><label>Description</label><input type="text" id="cs-desc"></div></div>`;
        openModal('New Code Series', b, '<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="saveCodeSeries()">Create</button>');
    };
    window.saveCodeSeries = function() {
        const prefix = document.getElementById('cs-prefix').value;
        if (!prefix) { toast('Prefix required','error'); return; }
        AppData.empSetup.codeSeries.push({ id: generateId('CS'), prefix, company: document.getElementById('cs-company').value, description: document.getElementById('cs-desc').value });
        saveData(AppData); toast('Code series added','success'); openSetupModal();
    };
    window.editCodeSeries = function(id) {
        const cs = AppData.empSetup.codeSeries.find(x=>x.id===id);
        const b = `<div class="form-grid"><div class="form-group"><label>Prefix</label><input type="text" id="cs-prefix" value="${cs.prefix}"></div><div class="form-group"><label>Company</label><select id="cs-company">${['All',...AppData.companies.map(c=>c.name)].map(c=>`<option value="${c}" ${c===cs.company?'selected':''}>${c}</option>`).join('')}</select></div><div class="form-group full-width"><label>Description</label><input type="text" id="cs-desc" value="${cs.description}"></div></div>`;
        openModal('Edit Code Series', b, `<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="updateCodeSeries('${id}')">Update</button>`);
    };
    window.updateCodeSeries = function(id) {
        const cs = AppData.empSetup.codeSeries.find(x=>x.id===id);
        cs.prefix = document.getElementById('cs-prefix').value; cs.company = document.getElementById('cs-company').value; cs.description = document.getElementById('cs-desc').value;
        saveData(AppData); toast('Updated','success'); openSetupModal();
    };
    window.addDepartment = function() {
        const b = `<div class="form-grid"><div class="form-group full-width"><label>Department Name</label><input type="text" id="setup-dept-name"></div></div>`;
        openModal('New Department', b, '<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="saveDepartment()">Create</button>');
    };
    window.saveDepartment = function() {
        const name = document.getElementById('setup-dept-name').value;
        if (!name) { toast('Name required','error'); return; }
        AppData.empSetup.departments.push({ id: generateId('DEPT'), name }); saveData(AppData); toast('Department added','success'); openSetupModal();
    };
    window.editDepartment = function(id) {
        const d = AppData.empSetup.departments.find(x=>x.id===id);
        const b = `<div class="form-grid"><div class="form-group full-width"><label>Department Name</label><input type="text" id="setup-dept-name" value="${d.name}"></div></div>`;
        openModal('Edit Department', b, `<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="updateDepartment('${id}')">Update</button>`);
    };
    window.updateDepartment = function(id) {
        const d = AppData.empSetup.departments.find(x=>x.id===id); d.name = document.getElementById('setup-dept-name').value;
        saveData(AppData); toast('Updated','success'); openSetupModal();
    };
    window.deleteDepartment = function(id) {
        showConfirm('Delete Department','Are you sure?',function(r){if(r){AppData.empSetup.departments=AppData.empSetup.departments.filter(x=>x.id!==id);saveData(AppData);toast('Deleted','info');openSetupModal();}});
    };
    window.addDesignation = function() {
        const b = `<div class="form-grid"><div class="form-group full-width"><label>Designation</label><input type="text" id="setup-desg-name"></div></div>`;
        openModal('New Designation', b, '<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="saveDesignation()">Create</button>');
    };
    window.saveDesignation = function() {
        const name = document.getElementById('setup-desg-name').value;
        if (!name) { toast('Name required','error'); return; }
        AppData.empSetup.designations.push({ id: generateId('DESG'), name }); saveData(AppData); toast('Designation added','success'); openSetupModal();
    };
    window.editDesignation = function(id) {
        const d = AppData.empSetup.designations.find(x=>x.id===id);
        const b = `<div class="form-grid"><div class="form-group full-width"><label>Designation</label><input type="text" id="setup-desg-name" value="${d.name}"></div></div>`;
        openModal('Edit Designation', b, `<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="updateDesignation('${id}')">Update</button>`);
    };
    window.updateDesignation = function(id) {
        const d = AppData.empSetup.designations.find(x=>x.id===id); d.name = document.getElementById('setup-desg-name').value;
        saveData(AppData); toast('Updated','success'); openSetupModal();
    };
    window.deleteDesignation = function(id) {
        showConfirm('Delete Designation','Are you sure?',function(r){if(r){AppData.empSetup.designations=AppData.empSetup.designations.filter(x=>x.id!==id);saveData(AppData);toast('Deleted','info');openSetupModal();}});
    };
    window.addDocType = function() {
        const b = `<div class="form-grid">
            <div class="form-group"><label>Code</label><input type="text" id="dt-code"></div>
            <div class="form-group"><label>Name</label><input type="text" id="dt-name"></div>
            <div class="form-group"><label>Mandatory (Gates Attendance)</label><select id="dt-mandatory"><option value="false">No</option><option value="true">Yes</option></select></div>
            <div class="form-group"><label>Has Expiry Date</label><select id="dt-expiry"><option value="false">No</option><option value="true">Yes</option></select></div>
            <div class="form-group"><label>Needs Document Number</label><select id="dt-number"><option value="false">No</option><option value="true">Yes</option></select></div>
            <div class="form-group"><label>Sort Order</label><input type="number" id="dt-sort" value="100"></div>
        </div>`;
        openModal('New Document Type', b, '<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="saveDocType()">Create type</button>');
    };
    window.saveDocType = function() {
        const code = document.getElementById('dt-code').value, name = document.getElementById('dt-name').value;
        if (!code || !name) { toast('Code and Name required','error'); return; }
        AppData.empSetup.documentTypes.push({ id: generateId('DT'), code, name, mandatory: document.getElementById('dt-mandatory').value==='true', hasExpiry: document.getElementById('dt-expiry').value==='true', hasNumber: document.getElementById('dt-number').value==='true', sort: parseInt(document.getElementById('dt-sort').value)||100 });
        saveData(AppData); toast('Document type created','success'); openSetupModal();
    };
    window.editDocType = function(id) {
        const dt = AppData.empSetup.documentTypes.find(x=>x.id===id);
        const b = `<div class="form-grid">
            <div class="form-group"><label>Code</label><input type="text" id="dt-code" value="${dt.code}" readonly style="background:#f3f4f6;"></div>
            <div class="form-group"><label>Name</label><input type="text" id="dt-name" value="${dt.name}"></div>
            <div class="form-group"><label>Mandatory (Gates Attendance)</label><select id="dt-mandatory"><option value="false" ${!dt.mandatory?'selected':''}>No</option><option value="true" ${dt.mandatory?'selected':''}>Yes</option></select></div>
            <div class="form-group"><label>Has Expiry Date</label><select id="dt-expiry"><option value="false" ${!dt.hasExpiry?'selected':''}>No</option><option value="true" ${dt.hasExpiry?'selected':''}>Yes</option></select></div>
            <div class="form-group"><label>Needs Document Number</label><select id="dt-number"><option value="false" ${!dt.hasNumber?'selected':''}>No</option><option value="true" ${dt.hasNumber?'selected':''}>Yes</option></select></div>
            <div class="form-group"><label>Sort Order</label><input type="number" id="dt-sort" value="${dt.sort}"></div>
        </div>`;
        openModal('Edit Document Type', b, `<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="updateDocType('${id}')">Update type</button>`);
    };
    window.updateDocType = function(id) {
        const dt = AppData.empSetup.documentTypes.find(x=>x.id===id);
        dt.name = document.getElementById('dt-name').value; dt.mandatory = document.getElementById('dt-mandatory').value==='true';
        dt.hasExpiry = document.getElementById('dt-expiry').value==='true'; dt.hasNumber = document.getElementById('dt-number').value==='true';
        dt.sort = parseInt(document.getElementById('dt-sort').value)||100;
        saveData(AppData); toast('Updated','success'); openSetupModal();
    };
    window.addShift = function() {
        const b = `<div class="form-grid"><div class="form-group"><label>Shift Name</label><input type="text" id="sh-name"></div><div class="form-group"><label>Start Time</label><input type="time" id="sh-start"></div><div class="form-group"><label>End Time</label><input type="time" id="sh-end"></div></div>`;
        openModal('New Shift', b, '<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="saveShift()">Create</button>');
    };
    window.saveShift = function() {
        const name = document.getElementById('sh-name').value;
        if (!name) { toast('Name required','error'); return; }
        AppData.empSetup.shifts.push({ id: generateId('SH'), name, startTime: document.getElementById('sh-start').value, endTime: document.getElementById('sh-end').value });
        saveData(AppData); toast('Shift added','success'); openSetupModal();
    };
    window.editShift = function(id) {
        const s = AppData.empSetup.shifts.find(x=>x.id===id);
        const b = `<div class="form-grid"><div class="form-group"><label>Shift Name</label><input type="text" id="sh-name" value="${s.name}"></div><div class="form-group"><label>Start Time</label><input type="time" id="sh-start" value="${s.startTime}"></div><div class="form-group"><label>End Time</label><input type="time" id="sh-end" value="${s.endTime}"></div></div>`;
        openModal('Edit Shift', b, `<button class="btn btn-secondary" onclick="openSetupModal()">Cancel</button><button class="btn btn-primary" onclick="updateShift('${id}')">Update</button>`);
    };
    window.updateShift = function(id) {
        const s = AppData.empSetup.shifts.find(x=>x.id===id); s.name = document.getElementById('sh-name').value; s.startTime = document.getElementById('sh-start').value; s.endTime = document.getElementById('sh-end').value;
        saveData(AppData); toast('Updated','success'); openSetupModal();
    };
    renderSetup();
}

// ===== EMPLOYEE TRANSFER MODAL =====
function openTransferModal() {
    const body = `
        <div class="form-grid">
            <div class="form-group full-width"><label>Employee</label>
                <select id="trf-employee" onchange="updateTransferInfo()">
                    <option value="">-- Select Employee --</option>
                    ${AppData.employees.map(e=>`<option value="${e.id}">${e.id} — ${e.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Current Company</label><input type="text" id="trf-curr-company" readonly style="background:#f3f4f6;"></div>
            <div class="form-group"><label>Current Project</label><input type="text" id="trf-curr-project" readonly style="background:#f3f4f6;"></div>
            <div class="form-group"><label>Transfer To Company</label>
                <select id="trf-to-company">
                    <option value="">-- Select --</option>
                    ${AppData.companies.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Transfer To Project</label>
                <select id="trf-to-project">
                    <option value="">-- Select --</option>
                    ${AppData.projects.map(p=>`<option value="${p.name}">${p.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Transfer Date</label><input type="date" id="trf-date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label>Retain Employee Code</label><select id="trf-retain"><option value="true">Yes</option><option value="false">No</option></select></div>
            <div class="form-group full-width"><label>Reason</label><textarea id="trf-reason" rows="2"></textarea></div>
        </div>`;
    const footer = '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="executeTransfer()"><i class="fas fa-exchange-alt"></i> Transfer</button>';
    openModal('Employee Transfer', body, footer);
}

function updateTransferInfo() {
    const empId = document.getElementById('trf-employee').value;
    const emp = AppData.employees.find(e=>e.id===empId);
    document.getElementById('trf-curr-company').value = emp ? emp.company : '';
    document.getElementById('trf-curr-project').value = emp ? emp.project : '';
}

function executeTransfer() {
    const empId = document.getElementById('trf-employee').value;
    const toCompany = document.getElementById('trf-to-company').value;
    const toProject = document.getElementById('trf-to-project').value;
    if (!empId || !toCompany) { toast('Select employee and target company','error'); return; }
    const emp = AppData.employees.find(e=>e.id===empId);
    if (!emp) return;

    const transfer = {
        id: generateId('TRF'),
        employeeId: empId,
        employeeName: emp.name,
        fromCompany: emp.company,
        fromProject: emp.project,
        toCompany: toCompany,
        toProject: toProject || emp.project,
        date: document.getElementById('trf-date').value,
        reason: document.getElementById('trf-reason').value,
        retainCode: document.getElementById('trf-retain').value === 'true'
    };

    emp.company = toCompany;
    if (toProject) emp.project = toProject;
    if (!transfer.retainCode) emp.id = generateId('EMP');

    if (!AppData.employeeTransfers) AppData.employeeTransfers = [];
    AppData.employeeTransfers.push(transfer);
    saveData(AppData);
    closeModal();
    toast('Employee transferred successfully','success');
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
                <button class="btn btn-outline" onclick="showModifications()"><i class="fas fa-pen-to-square"></i> Modifications</button>
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

function showModifications() {
    const mods = AppData.attendanceModifications || [];
    const body = `
        <p style="margin-bottom:12px;color:#6b7280">Attendance corrections and audit trail</p>
        <table>
            <thead><tr><th>ID</th><th>Employee</th><th>Date</th><th>Original</th><th>Modified To</th><th>Reason</th><th>Modified By</th><th>Modified On</th></tr></thead>
            <tbody>
                ${mods.length ? mods.map(m => `<tr><td>${m.id}</td><td>${m.employee} (${m.empCode})</td><td>${m.date}</td><td><span class="badge-status badge-red">${m.originalStatus}</span></td><td><span class="badge-status badge-green">${m.newStatus}</span></td><td>${m.reason}</td><td>${m.modifiedBy}</td><td>${m.modifiedOn}</td></tr>`).join('') : '<tr><td colspan="8" style="text-align:center;color:#6b7280">No modifications recorded</td></tr>'}
            </tbody>
        </table>
        <div style="margin-top:12px"><button class="btn btn-primary btn-sm" onclick="openAddModification()"><i class="fas fa-plus"></i> Add Modification</button></div>
    `;
    openModal('Attendance Modifications', body);
}
function openAddModification() {
    closeModal({target:document.getElementById('modal-overlay')});
    const empOpts = AppData.employees.map(e => `<option value="${e.id}">${e.name} (${e.id})</option>`).join('');
    openModal('New Attendance Modification', `<form id="mod-form"><div class="form-grid">
        <div class="form-group"><label>Employee</label><select name="empId" required>${empOpts}</select></div>
        <div class="form-group"><label>Date</label><input type="date" name="date" required></div>
        <div class="form-group"><label>Original Status</label><select name="originalStatus"><option>Absent</option><option>Half Day</option><option>Present</option><option>On Leave</option></select></div>
        <div class="form-group"><label>Correct Status</label><select name="newStatus"><option>Present</option><option>Complete</option><option>Half Day</option><option>On Leave</option><option>Absent</option></select></div>
    </div><div class="form-group" style="margin-top:10px"><label>Reason for Modification</label><textarea name="reason" rows="2" style="width:100%" required></textarea></div></form>`,
    `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-primary" onclick="saveModification()">Save</button>`);
}
function saveModification() {
    const fd = new FormData(document.getElementById('mod-form'));
    const empId = fd.get('empId');
    const emp = AppData.employees.find(e => e.id === empId);
    if (!AppData.attendanceModifications) AppData.attendanceModifications = [];
    AppData.attendanceModifications.push({
        id: generateId('MOD'), employee: emp ? emp.name : empId, empCode: empId,
        date: fd.get('date'), originalStatus: fd.get('originalStatus'), newStatus: fd.get('newStatus'),
        reason: fd.get('reason'), modifiedBy: 'Admin', modifiedOn: new Date().toISOString().split('T')[0]
    });
    saveData(AppData);
    closeModal({target:document.getElementById('modal-overlay')});
    toast('Attendance modification recorded');
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
    openModal('Reject Leave — '+id,
        `<div class="form-group"><label>Reason for Rejection <span style="color:#dc2626">*</span></label><textarea id="reject-remarks" rows="3" style="width:100%" placeholder="Enter rejection reason..." required></textarea></div>`,
        `<button class="btn" onclick="closeModal({target:document.getElementById('modal-overlay')})">Cancel</button> <button class="btn btn-danger" onclick="confirmRejectLeave('${id}')">Reject</button>`);
}
function confirmRejectLeave(id) {
    const remarks = document.getElementById('reject-remarks').value.trim();
    if (!remarks) { toast('Please enter rejection remarks', 'error'); return; }
    const leave = AppData.leaves.find(l => l.id === id);
    leave.status = 'Rejected';
    leave.remarks = remarks;
    saveData(AppData);
    closeModal({target:document.getElementById('modal-overlay')});
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
