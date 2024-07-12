# Large Scale Distributed Systems
FEUP M.EIC Y1S1

# Amazoff 

Link to the YouTube [video](https://youtu.be/yyL1a-NZa38)

## Team Members
- Abílio Epalanga - up202300492
- Daniel Rodrigues - up202006562
- Martim Videira - up202006289
- Miguel Silva - up202007972

## Documentation
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

## About This Project

- `/amazoff-client`
```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Svelte                           7             57              4            938
JavaScript                       6             41             14            277
HTML                             1              3              0             17
TypeScript                       1              1              6              5
-------------------------------------------------------------------------------
SUM:                            15            102             24           1237
-------------------------------------------------------------------------------
```


- `/server`
```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                       5            153              7            546
JSON                             1              0              0             16
-------------------------------------------------------------------------------
SUM:                             6            153              7            562
-------------------------------------------------------------------------------
```

- `/crdts`
```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                      23            201             30           1015
HTML                             1              5              0             18
JSON                             1              0              0             15
-------------------------------------------------------------------------------
SUM:                            25            206             30           1048
-------------------------------------------------------------------------------
```

- `/crdts-client`
```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                       7             67              2            502
HTML                             1             22              0            110
JSON                             3              0              0             73
-------------------------------------------------------------------------------
SUM:                            11             89              2            685
-------------------------------------------------------------------------------
```
