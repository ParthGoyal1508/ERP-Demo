function initAuth(){document.getElementById('login-form').addEventListener('submit',function(e){e.preventDefault();const em=document.getElementById('login-email').value,pw=document.getElementById('login-password').value;if(em==='admin@buildcore.com'&&pw==='demo123'){localStorage.setItem('buildcore_auth','true');showApp();toast('Welcome back, Admin!','success');}else{toast('Invalid credentials','error');}});}
function togglePassword(){const i=document.getElementById('login-password'),ic=document.querySelector('.toggle-password i');if(i.type==='password'){i.type='text';ic.className='fas fa-eye-slash';}else{i.type='password';ic.className='fas fa-eye';}}
function showApp(){document.getElementById('login-page').classList.add('hidden');document.getElementById('app-shell').classList.remove('hidden');updateNotifBadge();navigateTo(window.location.hash||'#/dashboard');}
function updateNotifBadge(){try{const n=getNotifications().length;const b=document.querySelector('.header-icon .badge');if(b)b.textContent=n;}catch(e){}}
function logout(){localStorage.removeItem('buildcore_auth');document.getElementById('login-page').classList.remove('hidden');document.getElementById('app-shell').classList.add('hidden');toast('Logged out','info');}
function navigateTo(hash){window.location.hash=hash;}
function handleRoute(){
    const hash=window.location.hash||'#/dashboard',route=hash.replace('#','');
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
    const a=document.querySelector(`[href="${hash}"]`);if(a){a.classList.add('active');const g=a.closest('.nav-group');if(g)g.classList.add('open');}
    const c=document.getElementById('page-content');
    switch(route){
        case '/dashboard':renderDashboard(c);break;
        case '/group':renderGroupDashboard(c);break;
        case '/reports':renderReports(c);break;
        case '/notifications':renderNotifications(c);break;
        case '/activity-log':renderActivityLog(c);break;
        case '/site-dashboard':renderSiteDashboard(c);break;
        case '/my/punch':renderMyPunch(c);break;
        case '/my/leave':renderMyLeave(c);break;
        case '/my/salary':renderMySalary(c);break;
        case '/my/face-enrol':renderFaceEnrolment(c);break;
        case '/hr/employees':renderEmployees(c);break;
        case '/hr/attendance':renderAttendance(c);break;
        case '/hr/leave':renderLeave(c);break;
        case '/hr/payroll':renderPayroll(c);break;
        case '/hr/challans':renderChallans(c);break;
        case '/hr/loans':renderLoans(c);break;
        case '/machinery':renderAssetRegister(c);break;
        case '/machinery/logbook':renderLogbook(c);break;
        case '/machinery/fuel':renderMachineryFuel(c);break;
        case '/machinery/maintenance':renderMaintenance(c);break;
        case '/machinery/hire-bills':renderHireBills(c);break;
        case '/machinery/categories':renderEquipmentCategories(c);break;
        case '/machinery/doc-types':renderEquipmentDocTypes(c);break;
        case '/machinery/rates':renderHireRates(c);break;
        case '/machinery/utilization':renderUtilizationReport(c);break;
        case '/projects/portfolio':renderPortfolio(c);break;
        case '/projects/dwr':renderDWR(c);break;
        case '/projects/pnl':renderProjectPnL(c);break;
        case '/projects/clients':renderClients(c);break;
        case '/projects/sites':renderSites(c);break;
        case '/vendors':renderVendors(c);break;
        case '/vendors/categories':renderVendorCategories(c);break;
        case '/contractors':renderContractors(c);break;
        case '/contractors/compliance':renderContractorCompliance(c);break;
        case '/contractors/rag':renderRAGMatrix(c);break;
        case '/bocw':renderBOCW(c);break;
        case '/inventory/stock':renderStock(c);break;
        case '/inventory/purchases':renderPurchases(c);break;
        case '/inventory/issues':renderIssues(c);break;
        case '/inventory/transfers':renderTransfers(c);break;
        case '/inventory/payments':renderPayments(c);break;
        case '/settings/companies':renderCompanies(c);break;
        case '/settings/users':renderSettingsUsers(c);break;
        case '/settings/roles':renderSettingsRoles(c);break;
        default:c.innerHTML='<div class="empty-state"><i class="fas fa-file"></i><p>Page not found</p></div>';
    }
}
function toggleSidebar(){const s=document.getElementById('sidebar');s.classList.toggle('collapsed');s.classList.toggle('open');}
function initSidebar(){document.querySelectorAll('.nav-group-title').forEach(t=>{t.addEventListener('click',function(){this.parentElement.classList.toggle('open');});});document.querySelectorAll('.nav-group').forEach(g=>g.classList.add('open'));}
function toggleUserMenu(){document.getElementById('user-dropdown').classList.toggle('hidden');}
function showNotifications(){navigateTo('#/notifications');}
function toast(msg,type='success'){const c=document.getElementById('toast-container'),el=document.createElement('div');el.className=`toast toast-${type}`;el.textContent=msg;c.appendChild(el);setTimeout(()=>el.remove(),3000);}
function openModal(title,body,footer=''){document.getElementById('modal-title').textContent=title;document.getElementById('modal-body').innerHTML=body;document.getElementById('modal-footer').innerHTML=footer;document.getElementById('modal-overlay').classList.remove('hidden');}
function closeModal(e){if(e&&e.target!==document.getElementById('modal-overlay'))return;document.getElementById('modal-overlay').classList.add('hidden');}
let confirmCallback=null;
function showConfirm(title,msg,cb){document.getElementById('confirm-title').textContent=title;document.getElementById('confirm-message').textContent=msg;document.getElementById('confirm-overlay').classList.remove('hidden');confirmCallback=cb;}
function closeConfirm(r){document.getElementById('confirm-overlay').classList.add('hidden');if(confirmCallback)confirmCallback(r);confirmCallback=null;}
function formatCurrency(n){return '₹'+Number(n).toLocaleString('en-IN');}
function formatDate(d){if(!d)return '-';return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});}
function generateId(p){return p+'-'+String(Date.now()).slice(-6);}
function getStatusBadge(s){const m={'Active':'badge-green','Complete':'badge-green','Approved':'badge-green','Paid':'badge-green','Valid':'badge-green','Ongoing':'badge-green','Processed':'badge-blue','Verified':'badge-blue','Compliant':'badge-green','Absent':'badge-red','Rejected':'badge-red','Expired':'badge-red','Inactive':'badge-red','Non-compliant':'badge-red','Pending':'badge-yellow','Half Day':'badge-yellow','Expiring Soon':'badge-yellow','Part Paid':'badge-yellow','Under Maintenance':'badge-yellow','Planning':'badge-yellow','Draft':'badge-yellow','Pending Verification':'badge-yellow','Partially Compliant':'badge-yellow','Partial':'badge-yellow','On Leave':'badge-blue','On Hold':'badge-blue','Unpaid':'badge-gray','Cancelled':'badge-gray','Completed':'badge-purple','Closed':'badge-gray','Open':'badge-yellow'};const cls=m[s]||'badge-gray';return `<span class="badge-status ${cls}">${s}</span>`;}
function getDocProgress(docs){const pct=(docs/3)*100;let c='progress-green';if(docs===2)c='progress-yellow';if(docs===1)c='progress-orange';if(docs===0)c='progress-red';return `<div class="progress-bar"><div class="progress-bar-fill ${c}" style="width:${pct}%"></div></div><span style="font-size:11px;margin-left:4px">${docs}/3</span>`;}
document.addEventListener('DOMContentLoaded',function(){initAuth();initSidebar();if(localStorage.getItem('buildcore_auth')==='true')showApp();window.addEventListener('hashchange',handleRoute);document.addEventListener('click',function(e){if(!e.target.closest('.user-menu'))document.getElementById('user-dropdown').classList.add('hidden');});});
