# Amazoff 

## Team Members
- Abílio Epalanga - up202300492
- Daniel Rodrigues - up202006562
- Martim Videira - up202006289
- Miguel Silva - up202007972

## Documentation
- You can watch the demo video [here](), last updated on 10/11/2023.
- The presentation slides are in the [amazoff_slides.pdf](./docs/amazoff_slides.pdf) file, last updated on 10/11/2023.
- The system's architecture is detailed in the [architecture.pdf](./docs/architecture.pdf) file, last updated on 07/11/2023.





## Pre-requisites
- The following software must be installed:
    - Node.js v20.0.1
      - [Nodejs Download](https://nodejs.org/en/download)
    - Nginx 
      - `sudo apt install nginx`


## How to run
### Amazoff Client
To run:
```shell
cd amazoff-client
npm install
npm run dev
```
### Nginx

Run bash script present in ```nginx``` folder to start Nginx, which will redirect requests made to port ```8080``` to one of the multiple intermediary server replicas. That will alter your ```nginx.conf``` file in  order to support its reverse-proxy cabalities, and redirect requests to the defined upstream backend entries.

To run:
```sh
cd nginx
chmod +x start_nginx.sh
./start_nginx.sh
```


### Cloud
To start servers, go to `server` folder, and inside ```src``` folder just run ```npm run cloud```. That will create five node instances and two distinct intermediary servers with the same list of nodes on ports ```3000``` and ```3001```. The nodes will store the data in `server/src/data` folder.

Before running the cloud, you must have a running instance of Nginx, as described above.

To run:
```sh
cd server
npm install
npm run cloud
```

### CRDTs Test Interface
To run:
```sh
cd crdts-client
npm install
# Or run any other server of your choice like vscode live server
python3 -m http.server 8081
```

## Endpoints
The following endpoints are the ones most relevant to see the state of the system and to interact with it:
- `GET <Client Interface address>/admin`: Accesses the admin page.
- `GET <Node address>/ring`: Retrieves the ring state specific to that node.
- `GET <Node address>/ring/nodes`: Displays the list of nodes within the ring for that particular node.

Additionally, there are other endpoints specifically utilized by the client interface.
