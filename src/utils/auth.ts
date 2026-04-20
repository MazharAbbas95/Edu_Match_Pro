export const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

export const forgotPassword = async (email: string) => {
  const response = await fetch('/api/auth/forgotPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send reset email');
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`/api/auth/resetPassword/${token}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Password reset failed');

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
