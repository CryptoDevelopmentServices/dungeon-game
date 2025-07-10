async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    alert('Logged in!');
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html?mode=topdown'; // or sidescroller
  } else {
    alert(data.error || 'Login failed');
  }
}

async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    alert('Account created!');
  } else {
    alert(data.error || 'Registration failed');
  }
}
