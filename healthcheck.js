const http = require('http');

http.request('http://localhost:3000/healthcheck', {timeout: 2000}, res => {
    if (res.statusCode == 200) return process.exit(0);
    process.exit(1);
})
    .on('error', () => process.exit(1))
    .end();
