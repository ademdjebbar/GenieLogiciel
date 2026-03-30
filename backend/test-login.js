fetch("http://localhost:8000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@test.com", password: "test" })
}).then(async r => {
  console.log("STATUS:", r.status);
  console.log("BODY:", await r.text());
}).catch(console.error);
