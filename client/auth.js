export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

export async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const messageBox = document.getElementById('message');

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html?mode=topdown';
  } else {
    messageBox.textContent = data.error || 'Login failed';
    messageBox.classList.add('error');
  }
}

export async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const messageBox = document.getElementById('message');

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    messageBox.textContent = '🎉 Account created! You can now log in.';
    messageBox.classList.remove('error');
    messageBox.classList.add('success');
  } else {
    messageBox.textContent = data.error || 'Registration failed';
    messageBox.classList.add('error');
  }
}

window.login = login;
window.register = register;
