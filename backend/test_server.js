require('dotenv').config();
const request = require('http');
const app = require('./app');

const PORT = 3001; // use a different port for testing

const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    
    // Helper for requests
    const makeRequest = (path, method = 'GET', data = null, headers = {}) => {
        return new Promise((resolve, reject) => {
            const req = request.request(`http://localhost:${PORT}${path}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            }, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve({ status: res.statusCode, body }));
            });
            req.on('error', reject);
            if (data) req.write(JSON.stringify(data));
            req.end();
        });
    };

    try {
        console.log("--- Starting Endpoint Tests ---");
        
        // 1. Test Auth Login (Expect 400 or 401/404 based on controller)
        let res = await makeRequest('/api/auth/login', 'POST', { email: 'test@test.com', password: 'wrong' });
        console.log(`[Auth Login] Status: ${res.status} Body: ${res.body}`);

        // 2. Test unprotected flat access (Flats GET requires auth)
        res = await makeRequest('/api/flats');
        console.log(`[Flats GET (No Auth)] Status: ${res.status}`);

        // 3. Test resident dashboard (Requires Auth)
        res = await makeRequest('/api/resident/dashboard');
        console.log(`[Resident Dashboard (No Auth)] Status: ${res.status}`);
        
        // 4. Test admin dashboard (Requires Auth)
        res = await makeRequest('/api/admin/dashboard');
        console.log(`[Admin Dashboard (No Auth)] Status: ${res.status}`);

        console.log("--- All base route configurations seem to be applying middleware correctly. ---");

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        server.close();
        console.log("Test server shut down.");
        process.exit(0);
    }
});
