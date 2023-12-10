# SDLE

# Run Servers

To start servers, go to `server` folder, and inside ```source``` folder just run ```node --experimental-default-type="module" runServers.js```. That will create five node instances and two distinct intermediary servers with the same list of nodes on ports ```3000``` and ```3001```.

# Configure Nginx Server

Run bash script present in ```nginx``` folder to start Nginx, which will redirect requests made to port ```8080``` to one of the multiple intermediary server replicas. That will alter your ```nginx.conf``` file in  order to support its reverse-proxy cabalities, and redirect requests to the defined upstream backend entries.

To run:

```sh
chmod +x start_nginx.sh
./start_nginx.sh
```

Client can now make requests to port ```8080```, which will go through the step of load-balancing before reaching the intermediary server.