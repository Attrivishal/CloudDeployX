const http = require('http');

const server = http.createServer((req, res) => {
    res.end("CloudDeployX CI/CD is working 🚀");
});

server.listen(3000, ()=> {
    console.log("Server is running on port 3000");
});