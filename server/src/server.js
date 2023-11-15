const http = require('http');
const axios = require('axios');
const bodyParser = require('body-parser');
const ConsistentHashing = require('./ConsistentHashing'); // Adjust the path accordingly

const PORT = 3000;


const instances = process.argv[2] || 3
const nodeServers = []
for (let i = 0; i < instances; i++) {
  nodeServers.push(`http://localhost:${4000 + i}`)
}
const consistentHashing = new ConsistentHashing(nodeServers, instances);

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/processRequest') {
      const requestData = [];
      req.on('data', chunk => {
        requestData.push(chunk);
      });

      req.on('end', async () => {
        try {
          const requestBody = JSON.parse(Buffer.concat(requestData).toString());
          const requestId = requestBody.id;
          const targetNode = consistentHashing.getNode(requestId);

          if (targetNode) {
            const response = await axios.post(`${targetNode}/handleRequest`, { requestId });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Request forwarded to ${targetNode}`, targetNode, response: response.data }));
          } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No available node servers' }));
          }
        } catch (error) {
          console.error('Error parsing request data:', error.message);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Bad Request');
        }
      });
    } else if (req.method === 'GET' && req.url === '/visualizeRing') {
      consistentHashing.visualizeRing();
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Check the server console for the consistent hashing ring visualization.');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});


server.listen(PORT, () => {
  console.log(`Intermediary server listening at http://localhost:${PORT}`);
});
