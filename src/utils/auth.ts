export const loginUser = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // For testing, accept any valid-looking email with password "password123"
  // or check localStorage if they just signed up
  const usersStr = localStorage.getItem('mockUsers');
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', token);
    const userWithoutPassword = { name: user.name, email: user.email };
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return { token, user: userWithoutPassword };
  }

  throw new Error('Invalid email or password');
};

export const registerUser = async (name: string, email: string, password: string) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const usersStr = localStorage.getItem('mockUsers');
  const users = usersStr ? JSON.parse(usersStr) : [];

  if (users.some((u: any) => u.email === email)) {
    throw new Error('Email is already registered');
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('mockUsers', JSON.stringify(users));

  const token = 'mock-jwt-token-' + Date.now();
  localStorage.setItem('token', token);
  const userWithoutPassword = { name, email };
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  return { token, user: userWithoutPassword };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
