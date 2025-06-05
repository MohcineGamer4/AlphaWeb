// Set your password here
const CORRECT_PASSWORD = "admin";

// DOM elements
const passwordContainer = document.getElementById('password-container');
const protectedContent = document.getElementById('protected-content');
const passwordInput = document.getElementById('password-input');
const submitBtn = document.getElementById('submit-password');
const errorMessage = document.getElementById('error-message');
const logoutBtn = document.getElementById('logout-btn');

// Check if already authenticated (using sessionStorage)
if (sessionStorage.getItem('authenticated') === 'true') {
    showProtectedContent();
}

// Password submission
submitBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    if (passwordInput.value === CORRECT_PASSWORD) {
        // Correct password
        sessionStorage.setItem('authenticated', 'true');
        showProtectedContent();
    } else {
        // Wrong password
        errorMessage.textContent = "Incorrect password. Please try again.";
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function showProtectedContent() {
    passwordContainer.style.display = 'none';
    protectedContent.style.display = 'block';
}

// Logout functionality
logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('authenticated');
    protectedContent.style.display = 'none';
    passwordContainer.style.display = 'flex';
    passwordInput.value = '';
    errorMessage.textContent = '';
});