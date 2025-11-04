(async function(){
  const fetch = require('node-fetch');
  try {
    let r = await fetch('http://localhost:5000/api/health'); console.log('health', await r.json());
    r = await fetch('http://localhost:5000/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'testuser', email:'test@example.com', password:'test123'}) });
    console.log('register status', r.status, await r.text());
  } catch(e){ console.error('advanced smoke test failed', e.message); process.exit(2); }
  process.exit(0);
})();
