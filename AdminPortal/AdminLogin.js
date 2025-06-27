const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const passwordValue = document.getElementById('password').value;

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    fetch('AdminLogin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password: passwordValue })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // ✅ Store session and role info in both localStorage and sessionStorage
            sessionStorage.setItem("isAdmin", "true");
            sessionStorage.setItem("adminUsername", data.username);
            sessionStorage.setItem("adminRole", data.role);
            
            // Also store in localStorage for persistence
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("adminUsername", data.username);
            localStorage.setItem("adminRole", data.role);
            
            console.log('Login successful. Role:', data.role);

            successMessage.style.display = 'block';
            successMessage.textContent = data.message;

            // Redirect based on role
            let redirectUrl = 'AdminDashboard.html'; // Default dashboard
            
            // Map roles to their respective dashboards
            const roleDashboards = {
                'Releasing Officer': '../Roles/ReleasingAdmin.html',
                'Verifying Officer': '../Roles/VerifierAdmin.html',
                'Cashier': '../Roles/CashierAdmin.html',
                'Document Signatory Officer': '../Roles/SignatoryAdmin.html',
                'Report Officer': '../Roles/ReportAdmin.html',
                'Help Desk Officer': '../Roles/HelpAdmin.html',
                'Super Admin': 'AdminDashboard.html' // Keep Super Admin on the main dashboard
            };

            // If role has a specific dashboard, use it
            if (roleDashboards[data.role]) {
                redirectUrl = roleDashboards[data.role];
            }

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            throw new Error(data.message);
        }
    })
    .catch(err => {
        errorMessage.style.display = 'block';
        errorMessage.textContent = err.message;
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    });
});

document.getElementById('username').addEventListener('input', hideError);
document.getElementById('password').addEventListener('input', hideError);

function hideError() {
    errorMessage.style.display = 'none';
}
