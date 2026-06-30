(async () => {
    try {
        const user = 'browsertest' + Date.now();
        console.log('user:', user);

        const base = 'http://localhost:3000';

        const regRes = await fetch(base + '/api/auth/register', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ username: user, password: 'testpass' })
        });
        console.log('register status', regRes.status);
        console.log(await regRes.text());

        const loginRes = await fetch(base + '/api/auth/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ username: user, password: 'testpass' })
        });
        const loginJson = await loginRes.json();
        console.log('login status', loginRes.status, 'body:', loginJson);
        const token = loginJson.token;
        if (!token) throw new Error('no token returned');

        const createRes = await fetch(base + '/api/students', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token },
            body: JSON.stringify({ name: 'Bob', email: `bob_${user}@example.com` })
        });
        console.log('create student status', createRes.status);
        console.log(await createRes.text());

        const listRes = await fetch(base + '/api/students', { headers: { authorization: 'Bearer ' + token } });
        const listJson = await listRes.json();
        console.log('list status', listRes.status);
        console.log(JSON.stringify(listJson, null, 2));
    } catch (e) {
        console.error('verify error', e);
        process.exit(1);
    }
})();
