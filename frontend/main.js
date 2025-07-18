const API_BASE = 'http://localhost:3001/api'; // Change if backend URL differs

const tokenKey = 'advcGameToken';

// Elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const errorMsg = document.getElementById('error-msg');
const goRegister = document.getElementById('go-register');

// Redirect to game page if already logged in
if (localStorage.getItem(tokenKey)) {
  window.location.href = 'game.html';
}

loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  errorMsg.textContent = '';

  if (!username || !password) {
    errorMsg.textContent = 'Please fill in both fields';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Login failed';
      return;
    }

    localStorage.setItem(tokenKey, data.token);
    window.location.href = 'game.html';
  } catch (e) {
    errorMsg.textContent = 'Server error, try again later';
  }
});

goRegister.addEventListener('click', () => {
  window.location.href = 'register.html';
});
