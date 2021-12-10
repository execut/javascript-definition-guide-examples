const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const fs = require('fs');

    let rawdata = fs.readFileSync('./13.2-promise/response.json');
    // let data = JSON.parse(rawdata);
    res.end(rawdata);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
