const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer(function (request, response) {
    const filePath = request.url === '/' ? './index.html' : `.${request.url}`;
    const ext = path.extname(filePath);
    const mimeType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    fs.readFile(filePath, function (err, content) {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('404 Not Found');
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': mimeType[ext] || 'text/plain' });
            response.write(content);
            response.end();
        }
    });
});

server.listen(port, hostname, () => {
    // console.log("Server running at http://web-XXXXXXXXX.docode.YYYY.qwasar.io");
    // console.log("Replace XXXXXXXXX by your current workspace ID");
    // console.log("(look at the URL of this page and XXXXXXXXX.docode.YYYY.qwasar.io, XXXXXXXXX is your workspace ID and YYYY is your zone)");


});