import fetch from 'node-fetch';

async function testSignup() {
  console.log("Testing Signup with Local DB...");
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\x1b[32m%s\x1b[0m", "SUCCESS: Signup worked with Local DB!");
    } else {
      console.log("\x1b[31m%s\x1b[0m", "FAILED: Signup failed.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testSignup();
