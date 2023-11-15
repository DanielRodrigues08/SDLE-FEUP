const http = require('http');
const axios = require('axios');


const PORT = process.argv[2] || 4000;
const n    = process.argv[3] || 0;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/handleRequest' && req.method === 'POST') {
      // Handle the 'handleRequest' endpoint
      const requestData = [];
      req.on('data', chunk => {
        requestData.push(chunk);
      });

      req.on('end', async () => {
        try {
          const requestBody = JSON.parse(Buffer.concat(requestData).toString());
          // You can now use the requestBody for processing the request

          // Example: Log the received data
          console.log(`Data received at Server ${n}:`, requestBody);

          // Respond to the request
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `\n Request handled by Server ${n}` }));
        } catch (error) {
          console.error('Error parsing request data:', error.message);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Bad Request');
        }
      });
    } else {
      // Make a request to Server 1
      const response = await axios.get('http://127.0.0.1:3000/');

      // Log the message from Server 1
      console.log('Message from Server 1:', response.data);

      // Respond with the combined message
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Invalid URL: ${req.url}`);

    }
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Node running at http://localhost:${PORT}/`);
});
