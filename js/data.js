const STORAGE_KEY = 'buildcore_erp_data';
function getDefaultData() {
    return {
        companies: [
            { id: 'COMP-001', name: 'Demo Constructions Pvt Ltd', shortCode: 'DEMO', address: '45 Industrial Area, Jaipur, Rajasthan 302001', gstin: '08AABCD1234E1Z5', pan: 'AABCD1234E', pfCode: 'RJ/JAI/12345', esicCode: 'ESIC/RJ/001', status: 'Active' },
            { id: 'COMP-002', name: 'Demo Infra Projects Pvt Ltd', shortCode: 'DINF', address: '12 IT Park, Jaipur, Rajasthan 302017', gstin: '08AABCD5678F1Z3', pan: 'AABCD5678F', pfCode: 'RJ/JAI/12346', esicCode: 'ESIC/RJ/002', status: 'Active' }
        ],
        employees: [
            { id: 'EMP-0001', name: 'Ramesh Kumar', department: 'Accounts & Finance', designation: 'Accountant', mobile: '9999900001', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1985-03-15', gender: 'Male', email: 'ramesh@demo.com', address: '12 MG Road, Jaipur', joiningDate: '2020-01-15', type: 'Full Time', basicSalary: 15000, hra: 6000, conveyance: 1600, siteAllowance: 2400, pfApplicable: true, esicApplicable: false, bankName: 'State Bank of India', accountNo: '12345678901', ifsc: 'SBIN0001234', uan: '100123456789', docs: 3 },
            { id: 'DEMO-0001', name: 'Suresh Sharma', department: 'Civil Engineering', designation: 'Project Manager', mobile: '9820000013', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1980-06-20', gender: 'Male', email: 'suresh@demo.com', address: '45 Gandhi Nagar, Jaipur', joiningDate: '2018-04-01', type: 'Full Time', basicSalary: 35000, hra: 14000, conveyance: 3200, siteAllowance: 5000, pfApplicable: true, esicApplicable: false, bankName: 'HDFC Bank', accountNo: '98765432101', ifsc: 'HDFC0001234', uan: '100123456790', docs: 3 },
            { id: 'DEMO-0002', name: 'Meena Verma', department: 'Accounts & Finance', designation: 'Accountant', mobile: '9820000026', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1990-11-10', gender: 'Female', email: 'meena@demo.com', address: '78 Vaishali, Jaipur', joiningDate: '2021-07-01', type: 'Full Time', basicSalary: 18000, hra: 7200, conveyance: 1600, siteAllowance: 2400, pfApplicable: true, esicApplicable: true, bankName: 'ICICI Bank', accountNo: '11223344556', ifsc: 'ICIC0001234', uan: '100123456791', docs: 2 },
            { id: 'DEMO-0003', name: 'Rajendra Singh', department: 'Civil Engineering', designation: 'Senior Site Engineer', mobile: '9820000039', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1982-01-25', gender: 'Male', email: 'rajendra@demo.com', address: '23 Tonk Road, Jaipur', joiningDate: '2019-03-15', type: 'Full Time', basicSalary: 28000, hra: 11200, conveyance: 2400, siteAllowance: 4000, pfApplicable: true, esicApplicable: false, bankName: 'Axis Bank', accountNo: '55667788990', ifsc: 'UTIB0001234', uan: '100123456792', docs: 3 },
            { id: 'DEMO-0004', name: 'Amit Kumar', department: 'Civil Engineering', designation: 'Site Engineer', mobile: '9820000052', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1992-08-05', gender: 'Male', email: 'amit@demo.com', address: '56 Mansarovar, Jaipur', joiningDate: '2022-01-10', type: 'Full Time', basicSalary: 22000, hra: 8800, conveyance: 1600, siteAllowance: 3000, pfApplicable: true, esicApplicable: true, bankName: 'State Bank of India', accountNo: '44556677889', ifsc: 'SBIN0005678', uan: '100123456793', docs: 2 },
            { id: 'DEMO-0005', name: 'Vikram Meena', department: 'Quality Assurance & Control', designation: 'Quality Control Engineer', mobile: '9820000065', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1988-12-18', gender: 'Male', email: 'vikram@demo.com', address: '34 Malviya Nagar, Jaipur', joiningDate: '2020-06-01', type: 'Full Time', basicSalary: 25000, hra: 10000, conveyance: 2000, siteAllowance: 3500, pfApplicable: true, esicApplicable: false, bankName: 'HDFC Bank', accountNo: '33445566778', ifsc: 'HDFC0005678', uan: '100123456794', docs: 3 },
            { id: 'DEMO-0006', name: 'Dinesh Yadav', department: 'Site Operations & Maintenance', designation: 'Site Supervisor', mobile: '9820000078', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1985-04-22', gender: 'Male', email: 'dinesh@demo.com', address: '12 Sodala, Jaipur', joiningDate: '2019-08-15', type: 'Full Time', basicSalary: 20000, hra: 8000, conveyance: 1600, siteAllowance: 3000, pfApplicable: true, esicApplicable: true, bankName: 'Punjab National Bank', accountNo: '22334455667', ifsc: 'PUNB0001234', uan: '100123456795', docs: 1 },
            { id: 'DEMO-0007', name: 'Ramavtar Gurjar', department: 'Electrical & Mechanical', designation: 'Electrician', mobile: '9820000091', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1987-07-30', gender: 'Male', email: 'ramavtar@demo.com', address: '67 Sanganer, Jaipur', joiningDate: '2021-02-01', type: 'Full Time', basicSalary: 16000, hra: 6400, conveyance: 1600, siteAllowance: 2400, pfApplicable: true, esicApplicable: true, bankName: 'Bank of Baroda', accountNo: '11223344557', ifsc: 'BARB0001234', uan: '100123456796', docs: 2 },
            { id: 'DEMO-0008', name: 'Kalu Ram', department: 'Plant & Machinery', designation: 'Mechanic / Fitter', mobile: '9820000104', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1983-09-14', gender: 'Male', email: 'kalu@demo.com', address: '89 Ajmer Road, Jaipur', joiningDate: '2020-11-01', type: 'Full Time', basicSalary: 14000, hra: 5600, conveyance: 1600, siteAllowance: 2000, pfApplicable: true, esicApplicable: true, bankName: 'State Bank of India', accountNo: '99887766554', ifsc: 'SBIN0009876', uan: '100123456797', docs: 2 },
            { id: 'DEMO-0009', name: 'Bhanwar Lal', department: 'Plant & Machinery', designation: 'Plant Operator', mobile: '9820000117', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1986-02-28', gender: 'Male', email: 'bhanwar@demo.com', address: '45 Sikar Road, Jaipur', joiningDate: '2019-05-15', type: 'Full Time', basicSalary: 15000, hra: 6000, conveyance: 1600, siteAllowance: 2400, pfApplicable: true, esicApplicable: true, bankName: 'Central Bank', accountNo: '88776655443', ifsc: 'CBIN0001234', uan: '100123456798', docs: 3 },
            { id: 'DEMO-0010', name: 'Mukesh Saini', department: 'Stores & Procurement', designation: 'Store Keeper', mobile: '9820000130', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1989-05-12', gender: 'Male', email: 'mukesh@demo.com', address: '23 Vidhyadhar Nagar, Jaipur', joiningDate: '2021-09-01', type: 'Full Time', basicSalary: 14000, hra: 5600, conveyance: 1600, siteAllowance: 2000, pfApplicable: true, esicApplicable: true, bankName: 'ICICI Bank', accountNo: '77665544332', ifsc: 'ICIC0005678', uan: '100123456799', docs: 1 },
            { id: 'DEMO-0011', name: 'Pappu Ram', department: 'Site Operations & Maintenance', designation: 'Mason', mobile: '9820000143', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1984-10-08', gender: 'Male', email: '', address: '56 Chomu, Rajasthan', joiningDate: '2020-03-01', type: 'Daily Wage', basicSalary: 12000, hra: 4800, conveyance: 1600, siteAllowance: 2000, pfApplicable: true, esicApplicable: true, bankName: 'State Bank of India', accountNo: '66554433221', ifsc: 'SBIN0003456', uan: '100123456800', docs: 1 },
            { id: 'DEMO-0012', name: 'Sita Devi', department: 'Site Operations & Maintenance', designation: 'Helper', mobile: '9820000156', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1990-06-15', gender: 'Female', email: '', address: '78 Amber Road, Jaipur', joiningDate: '2022-04-01', type: 'Daily Wage', basicSalary: 9000, hra: 3600, conveyance: 1600, siteAllowance: 1500, pfApplicable: true, esicApplicable: true, bankName: 'Punjab National Bank', accountNo: '55443322110', ifsc: 'PUNB0005678', uan: '100123456801', docs: 0 },
            { id: 'DEMO-0013', name: 'Gopal Nath', department: 'Site Operations & Maintenance', designation: 'Helper', mobile: '9820000169', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1988-03-22', gender: 'Male', email: '', address: '12 Amer, Rajasthan', joiningDate: '2022-06-15', type: 'Daily Wage', basicSalary: 9000, hra: 3600, conveyance: 1600, siteAllowance: 1500, pfApplicable: true, esicApplicable: true, bankName: 'Bank of Baroda', accountNo: '44332211009', ifsc: 'BARB0005678', uan: '100123456802', docs: 0 },
            { id: 'DEMO-0014', name: 'Kamla Devi', department: 'Site Operations & Maintenance', designation: 'Helper', mobile: '9820000182', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1991-12-01', gender: 'Female', email: '', address: '34 Nahargarh, Jaipur', joiningDate: '2022-08-01', type: 'Daily Wage', basicSalary: 9000, hra: 3600, conveyance: 1600, siteAllowance: 1500, pfApplicable: true, esicApplicable: true, bankName: 'State Bank of India', accountNo: '33221100998', ifsc: 'SBIN0007890', uan: '100123456803', docs: 1 },
            { id: 'DEMO-0015', name: 'Bheru Lal', department: 'Health, Safety & Environment', designation: 'Security Guard', mobile: '9820000195', project: 'NH-48 O&M', company: 'Demo Constructions Pvt Ltd', status: 'Active', dob: '1979-08-20', gender: 'Male', email: '', address: '56 Naila, Rajasthan', joiningDate: '2020-10-01', type: 'Full Time', basicSalary: 12000, hra: 4800, conveyance: 1600, siteAllowance: 2000, pfApplicable: true, esicApplicable: true, bankName: 'Central Bank', accountNo: '22110099887', ifsc: 'CBIN0005678', uan: '100123456804', docs: 2 }
        ],
        attendance: generateAttendanceData(),
        leaves: [
            { id: 'LV-001', employeeId: 'EMP-0001', employee: 'Ramesh Kumar', type: 'Leave Without Pay', from: '2026-11-02', to: '2026-11-03', days: 2, reason: 'Unpaid personal leave', status: 'Pending', remarks: '' },
            { id: 'LV-002', employeeId: 'EMP-0001', employee: 'Ramesh Kumar', type: 'Sick Leave', from: '2026-10-12', to: '2026-10-13', days: 2, reason: 'Fever and rest advised', status: 'Pending', remarks: '' },
            { id: 'LV-003', employeeId: 'EMP-0001', employee: 'Ramesh Kumar', type: 'Casual Leave', from: '2026-09-07', to: '2026-09-07', days: 1, reason: 'Personal work at bank', status: 'Rejected', remarks: 'Insufficient leave balance' },
            { id: 'LV-004', employeeId: 'EMP-0001', employee: 'Ramesh Kumar', type: 'Earned Leave', from: '2026-08-03', to: '2026-08-04', days: 2, reason: 'Family function in Jaipur', status: 'Approved', remarks: '' }
        ],
        payrollRuns: [],
        loans: [
            { id: 'LOAN-001', employeeId: 'EMP-0001', employee: 'Ramesh Kumar', amount: 50000, emi: 5000, disbursedOn: '2026-03-01', paid: 25000, balance: 25000, status: 'Active', reason: 'Home renovation' },
            { id: 'LOAN-002', employeeId: 'DEMO-0004', employee: 'Amit Kumar', amount: 30000, emi: 3000, disbursedOn: '2026-05-01', paid: 9000, balance: 21000, status: 'Active', reason: 'Medical expenses' }
        ],
        assets: [
            { id: 'ACP-001', name: 'Atlas Copco XAS 186', class: 'Equipment', category: 'Air Compressor', ownership: 'Owned', status: 'Active', site: 'NH-11 Widening', reading: '1,981.3 hrs', utilization: 93.9, flags: 0 },
            { id: 'ACP-002', name: 'Atlas Copco XAS 186', class: 'Equipment', category: 'Air Compressor', ownership: 'Owned', status: 'Active', site: 'NH-11 Widening', reading: '2,841.3 hrs', utilization: 81.4, flags: 0 },
            { id: 'BHL-001', name: 'JCB 3DX Backhoe Loader', class: 'Plant', category: 'Backhoe Loader', ownership: 'Hired', status: 'Active', site: 'NH-48 O&M', reading: '3,120 hrs', utilization: 86.7, flags: 0 },
            { id: 'BHL-002', name: 'CASE 770EX', class: 'Plant', category: 'Backhoe Loader', ownership: 'Owned', status: 'Active', site: 'NH-48 O&M', reading: '3,499.8 hrs', utilization: 65.0, flags: 0 },
            { id: 'BDZ-001', name: 'BEML BD80', class: 'Plant', category: 'Bulldozer', ownership: 'Owned', status: 'Active', site: 'NH-11 Widening', reading: '5,959.7 hrs', utilization: 79.2, flags: 0 },
            { id: 'BTK-001', name: 'Ashok Leyland 2518 (20 KL)', class: 'Vehicle', category: 'Bitumen Tanker', ownership: 'Owned', status: 'Active', site: 'NH-11 Widening', reading: '38,194 km', utilization: 98.9, flags: 1 },
            { id: 'CAR-001', name: 'Toyota Innova Crysta', class: 'Vehicle', category: 'Car', ownership: 'Owned', status: 'Active', site: 'NH-48 O&M', reading: '75,771 km', utilization: 97.8, flags: 2 },
            { id: 'AMB-001', name: 'Force Traveller Ambulance', class: 'Vehicle', category: 'Ambulance', ownership: 'Owned', status: 'Active', site: 'NH-48 O&M', reading: '46,763 km', utilization: 94.8, flags: 0 },
            { id: 'CMX-001', name: 'Safari 10/7 CFT', class: 'Equipment', category: 'Concrete Mixer', ownership: 'Owned', status: 'Active', site: 'NH-48 O&M', reading: '2,010.9 hrs', utilization: 80.4, flags: 0 },
            { id: 'DG-001', name: 'Kirloskar 40 kVA', class: 'Equipment', category: 'Diesel Generator', ownership: 'Hired', status: 'Active', site: 'NH-48 O&M', reading: '4,500 hrs', utilization: 72.0, flags: 0 },
            { id: 'DG-002', name: 'Kirloskar 62.5 kVA', class: 'Equipment', category: 'Diesel Generator', ownership: 'Hired', status: 'Active', site: 'NH-11 Widening', reading: '3,200 hrs', utilization: 68.5, flags: 1 },
            { id: 'DG-003', name: 'Cummins 125 kVA', class: 'Equipment', category: 'Diesel Generator', ownership: 'Owned', status: 'Active', site: 'NH-11 Widening', reading: '1,248 hrs', utilization: 55.3, flags: 1 },
            { id: 'EXC-001', name: 'Tata Hitachi EX 210LC', class: 'Plant', category: 'Excavator', ownership: 'Owned', status: 'Under Maintenance', site: 'NH-48 O&M', reading: '6,780 hrs', utilization: 88.0, flags: 1 },
            { id: 'WHL-001', name: 'Caterpillar 950 GC', class: 'Plant', category: 'Wheel Loader', ownership: 'Owned', status: 'Active', site: 'NH-48 O&M', reading: '4,200 hrs', utilization: 76.5, flags: 0 },
            { id: 'WHL-002', name: 'Caterpillar 950 GC', class: 'Plant', category: 'Wheel Loader', ownership: 'Hired', status: 'Under Maintenance', site: 'NH-11 Widening', reading: '3,850 hrs', utilization: 71.2, flags: 1 },
            { id: 'MCY-001', name: 'Hero Splendor Plus', class: 'Vehicle', category: 'Motorcycle', ownership: 'Owned', status: 'Active', site: '', reading: '', utilization: 0, flags: 0 }
        ],
        logbook: [
            { id: 'LB-001', date: '2026-07-23', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Backhoe Loader', site: 'NH-48 O&M', operator: 'Bhanwar Lal', opening: 3110, closing: 3120, totalHrs: 10, fuel: 65, remarks: '' },
            { id: 'LB-002', date: '2026-07-23', machineId: 'EXC-001', machine: 'EXC-001 Tata Hitachi EX 210LC', site: 'NH-48 O&M', operator: 'Kalu Ram', opening: 6770, closing: 6780, totalHrs: 10, fuel: 120, remarks: '' },
            { id: 'LB-003', date: '2026-07-23', machineId: 'WHL-001', machine: 'WHL-001 Caterpillar 950 GC', site: 'NH-48 O&M', operator: 'Helper', opening: 4192, closing: 4200, totalHrs: 8, fuel: 72, remarks: '' },
            { id: 'LB-004', date: '2026-07-22', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Backhoe Loader', site: 'NH-48 O&M', operator: 'Bhanwar Lal', opening: 3100, closing: 3110, totalHrs: 10, fuel: 62, remarks: '' },
            { id: 'LB-005', date: '2026-07-22', machineId: 'DG-001', machine: 'DG-001 Kirloskar 40 kVA', site: 'NH-48 O&M', operator: '', opening: 4488, closing: 4500, totalHrs: 12, fuel: 48, remarks: 'Night shift power' }
        ],
        machineryFuel: [
            { id: 'MF-001', date: '2026-07-23', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Backhoe Loader', site: 'NH-48 O&M', quantity: 65, rate: 90, amount: 5850, reading: 3120, vendor: 'Shree Shyam Fuel Station' },
            { id: 'MF-002', date: '2026-07-23', machineId: 'EXC-001', machine: 'EXC-001 Tata Hitachi EX 210LC', site: 'NH-48 O&M', quantity: 120, rate: 90, amount: 10800, reading: 6780, vendor: 'Shree Shyam Fuel Station' },
            { id: 'MF-003', date: '2026-07-22', machineId: 'WHL-001', machine: 'WHL-001 Caterpillar 950 GC', site: 'NH-48 O&M', quantity: 72, rate: 90, amount: 6480, reading: 4200, vendor: 'Shree Shyam Fuel Station' },
            { id: 'MF-004', date: '2026-07-22', machineId: 'DG-001', machine: 'DG-001 Kirloskar 40 kVA', site: 'NH-48 O&M', quantity: 48, rate: 90, amount: 4320, reading: 4500, vendor: 'Shree Shyam Fuel Station' },
            { id: 'MF-005', date: '2026-07-21', machineId: 'BDZ-001', machine: 'BDZ-001 BEML BD80', site: 'NH-11 Widening', quantity: 180, rate: 90, amount: 16200, reading: 5959, vendor: 'Shree Shyam Fuel Station' }
        ],
        maintenanceJobs: [
            { id: 'MJ-001', machineId: 'EXC-001', machine: 'EXC-001 Tata Hitachi EX 210LC', opened: '2026-07-20', type: 'Breakdown', problem: 'BRK/EXC-001/01', totalCost: 45000, status: 'Open' },
            { id: 'MJ-002', machineId: 'WHL-002', machine: 'WHL-002 Caterpillar 950 GC', opened: '2026-07-18', type: 'Breakdown', problem: 'BRK/WHL-002/01', totalCost: 32000, status: 'Open' },
            { id: 'MJ-003', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Backhoe Loader', opened: '2026-06-15', type: 'Scheduled', problem: 'Engine oil & filter change', totalCost: 8500, status: 'Closed' }
        ],
        hireBills: [
            { id: 'HB-001', bill: 'JB/26-27/DG-001', vendor: 'Jai Bhavani Earthmovers', machineId: 'DG-001', machine: 'DG-001 Kirloskar 40 kVA', period: '01 Jun – 30 Jun 2026', billedHrs: 149.74, logbookHrs: 136.39, variance: 13.35, amount: 170345.72, tds: 3406.91, netPayable: 166938.81, status: 'Pending Verification' },
            { id: 'HB-002', bill: 'JB/26-27/BHL-001', vendor: 'Jai Bhavani Earthmovers', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Super', period: '01 Jun – 30 Jun 2026', billedHrs: 271.16, logbookHrs: 249.71, variance: 21.45, amount: 305608.16, tds: 6112.16, netPayable: 299496.00, status: 'Pending Verification' },
            { id: 'HB-003', bill: 'JB/26-27/019', vendor: 'Jai Bhavani Earthmovers', machineId: 'BHL-001', machine: 'BHL-001 JCB 3DX Backhoe Loader', period: '01 Jul – 31 Jul 2026', billedHrs: 59, logbookHrs: 59, variance: 0, amount: 190000, tds: 3800, netPayable: 186200, status: 'Verified' }
        ],
        equipmentCategories: [
            { id: 'EC-01', category: 'Excavator', class: 'Plant', meter: 'hrs', fuelBenchmark: '12 L/hr', sort: 10 },
            { id: 'EC-02', category: 'Backhoe Loader', class: 'Plant', meter: 'hrs', fuelBenchmark: '6.5 L/hr', sort: 20 },
            { id: 'EC-03', category: 'Bulldozer', class: 'Plant', meter: 'hrs', fuelBenchmark: '18 L/hr', sort: 30 },
            { id: 'EC-04', category: 'Wheel Loader', class: 'Plant', meter: 'hrs', fuelBenchmark: '9 L/hr', sort: 40 },
            { id: 'EC-05', category: 'Roller', class: 'Plant', meter: 'hrs', fuelBenchmark: '5 L/hr', sort: 60 },
            { id: 'EC-06', category: 'Paver Finisher', class: 'Plant', meter: 'hrs', fuelBenchmark: '14 L/hr', sort: 90 },
            { id: 'EC-07', category: 'Concrete Mixer', class: 'Equipment', meter: 'hrs', fuelBenchmark: '3 L/hr', sort: 100 },
            { id: 'EC-08', category: 'Air Compressor', class: 'Equipment', meter: 'hrs', fuelBenchmark: '4 L/hr', sort: 110 },
            { id: 'EC-09', category: 'Diesel Generator', class: 'Equipment', meter: 'hrs', fuelBenchmark: '8 L/hr', sort: 120 },
            { id: 'EC-10', category: 'Car', class: 'Vehicle', meter: 'km', fuelBenchmark: '12 km/L', sort: 200 },
            { id: 'EC-11', category: 'Ambulance', class: 'Vehicle', meter: 'km', fuelBenchmark: '8 km/L', sort: 210 },
            { id: 'EC-12', category: 'Bitumen Tanker', class: 'Vehicle', meter: 'km', fuelBenchmark: '4 km/L', sort: 220 },
            { id: 'EC-13', category: 'Motorcycle', class: 'Vehicle', meter: 'km', fuelBenchmark: '50 km/L', sort: 230 }
        ],
        equipmentDocTypes: [
            { id: 'EDT-01', code: 'RC', name: 'Registration Certificate', flags: 'Number', remind: 0, sort: 10 },
            { id: 'EDT-02', code: 'INSURANCE', name: 'Insurance Policy', flags: 'ExpiryNumber', remind: 30, sort: 20 },
            { id: 'EDT-03', code: 'PUC_POLLUTION', name: 'PUC / Pollution Certificate', flags: 'ExpiryNumber', remind: 15, sort: 30 },
            { id: 'EDT-04', code: 'FITNESS', name: 'Fitness Certificate', flags: 'ExpiryNumber', remind: 30, sort: 40 },
            { id: 'EDT-05', code: 'PERMIT', name: 'Permit', flags: 'ExpiryNumber', remind: 30, sort: 50 },
            { id: 'EDT-06', code: 'ROAD_TAX', name: 'Road Tax Receipt', flags: 'Expiry', remind: 30, sort: 60 },
            { id: 'EDT-07', code: 'CALIBRATION', name: 'Calibration Certificate', flags: 'ExpiryNumber', remind: 30, sort: 80 }
        ],
        hireRates: [
            { id: 'HR-01', appliesTo: 'Road Marking Machine', rate: 1400, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-02', appliesTo: 'Tower Light Mast', rate: 220, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-03', appliesTo: 'Plate Compactor', rate: 200, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-04', appliesTo: 'Welding Machine', rate: 250, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-05', appliesTo: 'Concrete Mixer', rate: 350, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-06', appliesTo: 'Air Compressor', rate: 600, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-07', appliesTo: 'Diesel Generator', rate: 450, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-08', appliesTo: 'Backhoe Loader', rate: 1100, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-09', appliesTo: 'Crane', rate: 1650, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-10', appliesTo: 'Hot Mix Plant', rate: 6500, effectiveFrom: '2026-04-01', effectiveTo: 'Current' },
            { id: 'HR-11', appliesTo: 'Paver Finisher', rate: 3800, effectiveFrom: '2026-04-01', effectiveTo: 'Current' }
        ],
        fuelVarianceThreshold: 15,
        projects: [
            { id: 'PRJ-001', code: 'NH48', name: 'NH-48 O&M', client: 'NHAI', location: 'Jaipur-Ajmer Highway', manager: 'Suresh Sharma', contractValue: 85000000, status: 'Ongoing', startDate: '2024-01-01', endDate: '2027-12-31' },
            { id: 'PRJ-002', code: 'NH11', name: 'NH-11 Widening', client: 'PWD Rajasthan', location: 'Jaipur-Bikaner NH-11', manager: 'Rajendra Singh', contractValue: 65000000, status: 'Ongoing', startDate: '2025-06-01', endDate: '2028-05-31' },
            { id: 'PRJ-003', code: 'SH22', name: 'SH-22 Maintenance', client: 'State Highways', location: 'Jaipur-Tonk SH-22', manager: 'Suresh Sharma', contractValue: 35000000, status: 'Ongoing', startDate: '2026-01-01', endDate: '2027-12-31' }
        ],
        clients: [
            { id: 'CLT-001', name: 'NHAI', contactPerson: 'Rajesh Gupta', phone: '011-23456789', email: 'rajesh@nhai.gov.in', address: 'G-5, Sector 10, Dwarka, New Delhi', projects: 1, status: 'Active' },
            { id: 'CLT-002', name: 'PWD Rajasthan', contactPerson: 'Anil Sharma', phone: '0141-2345678', email: 'anil@pwd.raj.in', address: 'Jacob Road, Civil Lines, Jaipur', projects: 1, status: 'Active' },
            { id: 'CLT-003', name: 'State Highways', contactPerson: 'Vijay Meena', phone: '0141-3456789', email: 'vijay@highways.raj.in', address: 'Transport Nagar, Jaipur', projects: 1, status: 'Active' }
        ],
        sites: [
            { id: 'SITE-001', name: 'NH48 — NH-48 O&M', project: 'NH-48 O&M', location: 'KM 12-45', lat: 26.9124, lng: 75.7873, geofenceRadius: 500, status: 'Active' },
            { id: 'SITE-002', name: 'NH11 — NH-11 Widening', project: 'NH-11 Widening', location: 'KM 0-35', lat: 26.9800, lng: 75.7200, geofenceRadius: 800, status: 'Active' },
            { id: 'SITE-003', name: 'SH22 — SH-22 Maintenance', project: 'SH-22 Maintenance', location: 'KM 5-25', lat: 26.8500, lng: 75.8100, geofenceRadius: 600, status: 'Active' }
        ],
        vendors: [
            { id: 'VEN-001', name: 'Shree Shyam Fuel Station', city: '', dealsIn: 'Diesel & Lubricants', type: 'Fuel', gstin: '08AABC59968F1Z2', tds: '', active: true },
            { id: 'VEN-002', name: 'Jai Bhavani Earthmovers', city: 'Kota', dealsIn: 'Equipment Hire', type: 'Hire', gstin: '08AAECJ4455H1Z7', tds: '2% (194C)', active: true },
            { id: 'VEN-003', name: 'Bansal Building Materials', city: '', dealsIn: 'Cement, Steel, Aggregate', type: 'Material', gstin: '08AACCB7712M1Z4', tds: '', active: true },
            { id: 'VEN-004', name: 'Maruti Equipment Rentals', city: 'Ajmer', dealsIn: 'Equipment Hire', type: 'Hire', gstin: '08AADCM7710K1Z9', tds: '2% (194C)', active: true },
            { id: 'VEN-005', name: 'Rajputana Machinery Services', city: 'Jaipur', dealsIn: 'Spare Parts, Tyres & Batteries', type: 'Service', gstin: '08A4FCR3321L1Z4', tds: '2% (194C)', active: true }
        ],
        contractors: [
            { id: 'CON-001', name: 'Shree Balaji Labour Co', contact: 'Mohan Singh', licenseNo: 'LC/RJ/2025/1234', pfReg: 'RJ/BLJ/001', esicReg: 'ESIC/RJ/BLJ/001', insurance: 'Valid', bocwReg: 'BOCW/RJ/456', complianceStatus: 'Partially Compliant' },
            { id: 'CON-002', name: 'Rajasthan Labour Services', contact: 'Kishore Verma', licenseNo: 'LC/RJ/2025/5678', pfReg: 'RJ/RLS/002', esicReg: 'ESIC/RJ/RLS/002', insurance: 'Valid', bocwReg: 'BOCW/RJ/789', complianceStatus: 'Compliant' }
        ],
        ragMatrix: [
            { contractorId: 'CON-001', contractor: 'Shree Balaji Labour Co', months: { 'Apr 2026': 'red', 'May 2026': 'green', 'Jun 2026': 'red', 'Jul 2026': 'yellow' } },
            { contractorId: 'CON-002', contractor: 'Rajasthan Labour Services', months: { 'Apr 2026': 'green', 'May 2026': 'green', 'Jun 2026': 'green', 'Jul 2026': 'green' } }
        ],
        bocwCess: [
            { id: 'BOCW-001', project: 'NH-48 O&M', contractValue: 85000000, cessRate: 1, cessLiability: 850000, paid: 600000, balance: 250000, lastPayment: '2026-06-15', status: 'Partial' },
            { id: 'BOCW-002', project: 'NH-11 Widening', contractValue: 65000000, cessRate: 1, cessLiability: 650000, paid: 650000, balance: 0, lastPayment: '2026-05-20', status: 'Paid' },
            { id: 'BOCW-003', project: 'SH-22 Maintenance', contractValue: 35000000, cessRate: 1, cessLiability: 350000, paid: 0, balance: 350000, lastPayment: '', status: 'Pending' }
        ],
        stock: [
            { id: 'STK-001', item: 'Cement OPC 53 Grade', project: 'NH-11 Widening', category: 'CEMENT', unit: 'BAG', received: 0, issued: 0, transferIn: 30, transferOut: 0 },
            { id: 'STK-002', item: 'Aggregate 20mm', project: 'NH-48 O&M', category: 'AGGREGATE', unit: 'CUM', received: 150, issued: 90, transferIn: 0, transferOut: 0 },
            { id: 'STK-003', item: 'Cement OPC 53 Grade', project: 'NH-48 O&M', category: 'CEMENT', unit: 'BAG', received: 200, issued: 125, transferIn: 0, transferOut: 50 },
            { id: 'STK-004', item: 'TMT Steel 12mm', project: 'NH-48 O&M', category: 'STEEL', unit: 'KG', received: 2000, issued: 1200, transferIn: 0, transferOut: 0 },
            { id: 'STK-005', item: 'Cement OPC 53 Grade', project: 'SH-22 Maintenance', category: 'CEMENT', unit: 'BAG', received: 20, issued: 0, transferIn: 0, transferOut: 0 }
        ],
        stockRates: { 'Cement OPC 53 Grade': 385, 'Aggregate 20mm': 1350, 'TMT Steel 12mm': 62 },
        purchases: [
            { id: 'PUR-001', date: '2026-07-15', project: 'NH-48 O&M', item: 'Cement OPC 53 Grade', vendor: 'Bansal Building Materials', qty: 100, unit: 'BAG', rate: 385, amount: 38500, bill: 'INV-2026-071', payment: 'Paid' },
            { id: 'PUR-002', date: '2026-07-10', project: 'NH-48 O&M', item: 'Aggregate 20mm', vendor: 'Jai Bhavani Earthmovers', qty: 150, unit: 'CUM', rate: 1350, amount: 202500, bill: 'INV-2026-068', payment: 'Part Paid' },
            { id: 'PUR-003', date: '2026-07-08', project: 'NH-48 O&M', item: 'TMT Steel 12mm', vendor: 'Bansal Building Materials', qty: 2000, unit: 'KG', rate: 62, amount: 124000, bill: 'INV-2026-065', payment: 'Unpaid' },
            { id: 'PUR-004', date: '2026-07-05', project: 'SH-22 Maintenance', item: 'Cement OPC 53 Grade', vendor: 'Bansal Building Materials', qty: 20, unit: 'BAG', rate: 385, amount: 7700, bill: 'INV-2026-060', payment: 'Paid' }
        ],
        issues: [
            { id: 'ISS-001', date: '2026-07-20', project: 'NH-48 O&M', item: 'Cement OPC 53 Grade', issuedTo: 'Site Team A', qty: 50, unit: 'BAG', remarks: 'For culvert work' },
            { id: 'ISS-002', date: '2026-07-18', project: 'NH-48 O&M', item: 'Aggregate 20mm', issuedTo: 'Concreting Team', qty: 90, unit: 'CUM', remarks: 'Road base layer' },
            { id: 'ISS-003', date: '2026-07-16', project: 'NH-48 O&M', item: 'TMT Steel 12mm', issuedTo: 'Rebar Team', qty: 1200, unit: 'KG', remarks: 'Bridge pier reinforcement' }
        ],
        transfers: [
            { id: 'TRF-001', date: '2026-07-12', fromProject: 'NH-48 O&M', toProject: 'NH-11 Widening', item: 'Cement OPC 53 Grade', qty: 30, unit: 'BAG', remarks: 'Excess stock transfer' },
            { id: 'TRF-002', date: '2026-07-14', fromProject: 'NH-48 O&M', toProject: 'SH-22 Maintenance', item: 'Cement OPC 53 Grade', qty: 20, unit: 'BAG', remarks: 'Urgent requirement' }
        ],
        payments: [
            { id: 'PAY-001', date: '2026-07-17', vendor: 'Bansal Building Materials', amount: 102500, mode: 'UPI', ref: 'BOOT-FULL-1784272647189', allocatedBills: 1 },
            { id: 'PAY-002', date: '2026-07-17', vendor: 'Bansal Building Materials', amount: 100000, mode: 'BANK', ref: 'BOOT-PART-1784272647159', allocatedBills: 1 },
            { id: 'PAY-003', date: '2026-07-17', vendor: 'Bansal Building Materials', amount: 124000, mode: 'BANK', ref: 'BOOT-1784272606491', allocatedBills: 1 },
            { id: 'PAY-004', date: '2026-07-15', vendor: 'Bansal Building Materials', amount: 50000, mode: 'BANK', ref: 'UTR2607150042', allocatedBills: 1 }
        ],
        categories: ['CEMENT', 'AGGREGATE', 'STEEL', 'BRICKS', 'SAND', 'PAINT', 'ELECTRICAL', 'PLUMBING'],
        users: [
            { id: 'USR-001', name: 'Admin', email: 'admin@buildcore.com', role: 'Super Admin', status: 'Active', lastLogin: '2026-07-24 09:15 AM' },
            { id: 'USR-002', name: 'Suresh Sharma', email: 'suresh@demo.com', role: 'Project Manager', status: 'Active', lastLogin: '2026-07-23 08:30 AM' },
            { id: 'USR-003', name: 'Meena Verma', email: 'meena@demo.com', role: 'Accountant', status: 'Active', lastLogin: '2026-07-24 08:45 AM' },
            { id: 'USR-004', name: 'Rajendra Singh', email: 'rajendra@demo.com', role: 'Site Engineer', status: 'Active', lastLogin: '2026-07-22 07:00 AM' },
            { id: 'USR-005', name: 'Mukesh Saini', email: 'mukesh@demo.com', role: 'Store Keeper', status: 'Active', lastLogin: '2026-07-24 09:00 AM' },
            { id: 'USR-006', name: 'Vikram Meena', email: 'vikram@demo.com', role: 'Viewer', status: 'Inactive', lastLogin: '2026-06-15 10:00 AM' }
        ],
        roles: [
            { id: 'ROLE-001', name: 'Super Admin', permissions: ['All Modules', 'User Management', 'Company Settings', 'Data Export', 'Data Delete'], users: 1 },
            { id: 'ROLE-002', name: 'Project Manager', permissions: ['Dashboard', 'Employees', 'Attendance', 'Projects', 'Machinery', 'Reports'], users: 1 },
            { id: 'ROLE-003', name: 'Accountant', permissions: ['Dashboard', 'Payroll', 'Challans', 'Loans', 'Inventory', 'Reports'], users: 1 },
            { id: 'ROLE-004', name: 'Site Engineer', permissions: ['Dashboard', 'Attendance', 'Machinery', 'Logbook', 'Fuel', 'Inventory'], users: 1 },
            { id: 'ROLE-005', name: 'Store Keeper', permissions: ['Dashboard', 'Inventory', 'Purchases', 'Issues', 'Transfers'], users: 1 },
            { id: 'ROLE-006', name: 'Viewer', permissions: ['Dashboard', 'Reports'], users: 1 }
        ],
        settings: { companyName: 'Demo Constructions Pvt Ltd', phone: '0141-2345678', email: 'info@demo.com', gst: '08AABCD1234E1Z5', address: '45 Industrial Area, Jaipur, Rajasthan 302001' },
        alerts: [
            { machine: 'DG-003', desc: 'Engine oil & filter change approaching', detail: '2.0 units remaining', due: '26 May 2026' },
            { machine: 'DG-002', desc: 'Engine oil & filter change approaching', detail: '22.0 units remaining', due: '04 Apr 2026' },
            { machine: 'BSP-001', desc: 'Engine oil & filter change approaching', detail: '3.0 units remaining', due: '18 Apr 2026' },
            { machine: 'TOW-001', desc: 'PUC / Pollution Certificate', detail: 'PUC/RJ/2026/81703', due: 'expires 2026-07-31' },
            { machine: 'CAR-001', desc: 'PUC / Pollution Certificate', detail: 'PUC/RJ/2026/56165', due: 'expires 2026-07-31' },
            { machine: 'CAR-001', desc: 'Insurance Policy', detail: 'POL/2026/667145', due: 'expires 2026-08-10' }
        ]
    };
}
function generateAttendanceData() {
    const today = new Date().toISOString().split('T')[0];
    const emps = [
        { id:'EMP-0001',name:'Ramesh Kumar',project:'NH-48 O&M',dept:'Accounts & Finance',designation:'Accountant' },
        { id:'DEMO-0001',name:'Suresh Sharma',project:'NH-48 O&M',dept:'Civil Engineering',designation:'Project Manager' },
        { id:'DEMO-0002',name:'Meena Verma',project:'NH-48 O&M',dept:'Accounts & Finance',designation:'Accountant' },
        { id:'DEMO-0003',name:'Rajendra Singh',project:'NH-48 O&M',dept:'Civil Engineering',designation:'Senior Site Engineer' },
        { id:'DEMO-0004',name:'Amit Kumar',project:'NH-48 O&M',dept:'Civil Engineering',designation:'Site Engineer' },
        { id:'DEMO-0005',name:'Vikram Meena',project:'NH-48 O&M',dept:'Quality Assurance & Control',designation:'Quality Control Engineer' },
        { id:'DEMO-0006',name:'Dinesh Yadav',project:'NH-48 O&M',dept:'Site Operations & Maintenance',designation:'Site Supervisor' },
        { id:'DEMO-0007',name:'Ramavtar Gurjar',project:'NH-48 O&M',dept:'Electrical & Mechanical',designation:'Electrician' },
        { id:'DEMO-0008',name:'Kalu Ram',project:'NH-48 O&M',dept:'Plant & Machinery',designation:'Mechanic / Fitter' },
        { id:'DEMO-0009',name:'Bhanwar Lal',project:'NH-48 O&M',dept:'Plant & Machinery',designation:'Plant Operator' },
        { id:'DEMO-0010',name:'Mukesh Saini',project:'NH-48 O&M',dept:'Stores & Procurement',designation:'Store Keeper' },
        { id:'DEMO-0011',name:'Pappu Ram',project:'NH-48 O&M',dept:'Site Operations & Maintenance',designation:'Mason' },
        { id:'DEMO-0012',name:'Sita Devi',project:'NH-48 O&M',dept:'Site Operations & Maintenance',designation:'Helper' },
        { id:'DEMO-0013',name:'Gopal Nath',project:'NH-48 O&M',dept:'Site Operations & Maintenance',designation:'Helper' },
        { id:'DEMO-0014',name:'Kamla Devi',project:'NH-48 O&M',dept:'Site Operations & Maintenance',designation:'Helper' },
        { id:'DEMO-0015',name:'Bheru Lal',project:'NH-48 O&M',dept:'Health, Safety & Environment',designation:'Security Guard' }
    ];
    return emps.map((emp,i) => {
        let s='Complete',inT='09:00 am',outT='06:00 pm',w='9h 00m',ot='0';
        if(i===5){s='Absent';inT='-';outT='-';w='-';}
        if(i===12){s='On Leave';inT='-';outT='-';w='-';}
        if(i===3){ot='2';w='11h 00m';outT='08:00 pm';}
        return {id:`ATT-${String(i+1).padStart(3,'0')}`,date:today,empCode:emp.id,employee:emp.name,project:emp.project,department:emp.dept,designation:emp.designation,inTime:inT,outTime:outT,ot,worked:w,status:s};
    });
}
function loadData(){const s=localStorage.getItem(STORAGE_KEY);if(s){try{return JSON.parse(s);}catch(e){}}const d=getDefaultData();saveData(d);return d;}
function saveData(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function resetData(){localStorage.removeItem(STORAGE_KEY);return loadData();}
let AppData=loadData();
