function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const username = form.querySelector('input[name=username]').value.trim();
    const email = form.querySelector('input[type=email]').value.trim();
    const password = form.querySelector('input[type=password]').value.trim();
    const confirmPassword = form.querySelector('input[name=confirm_password]').value.trim();

    if (!username || !email || !password) {
        Swal.fire({ icon: 'warning', title: 'Incomplete Information', text: 'Fill in all fields.' });
        return;
    }

    if (!isValidEmail(email)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Enter a valid email.' });
        return;
    }

    fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Account Created', text: 'You can now log in with your credentials.', confirmButtonText: 'OK'
                    }).then(() => {
                    toggleForms();
                    form.reset();
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Signup Failed', text: data.message });
            }
        })
        .catch(() => {
            Swal.fire({ icon: 'error', title: 'Server Error', text: 'Try again later.' });
        });
});

function LogIn() {
    console.log('LogIn function called');
    const form = document.getElementById('loginForm');
    const emailInput = form.querySelector('input[type=email]');
    const passwordInput = form.querySelector('input[type=password]');

    if (!emailInput || !passwordInput) {
        Swal.fire({
            icon: 'error',
            title: 'Form Error',
            text: 'Login form is missing required fields.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Information',
            text: 'Please fill in all the required fields before logging in.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    if (!isValidEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('loggedInUser', JSON.stringify({
                username: data.username,
                email: email
            }));

            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: `Welcome, ${data.username}!`,
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '../Certification/Certificate.php';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Login',
                text: data.message,
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Try again later.',
            confirmButtonText: 'OK'
        });
    });

    return false; 
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    LogIn();
});

function toggleForms() {
    const signupBox = document.getElementById('signupBox');
    const loginBox = document.getElementById('loginBox');

    if (signupBox.style.display === 'none') {
        signupBox.style.display = 'block';
        loginBox.style.display = 'none';
    } else {
        signupBox.style.display = 'none';
        loginBox.style.display = 'block';
    }
}

function forgotPassword() {
    Swal.fire({
        title: 'Forgot Password',
        input: 'email',
        inputLabel: 'Enter your email address',
        inputPlaceholder: 'your@example.com',
        showCancelButton: true,
        confirmButtonText: 'Send Reset Link',
        preConfirm: (email) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Email Sent!', 'Check your inbox for a reset link.', 'success');
        }
    });
}

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const input = document.querySelector(this.getAttribute('toggle'));
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});