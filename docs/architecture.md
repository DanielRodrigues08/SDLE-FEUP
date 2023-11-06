# Architecture

## Overview

- Each shopping list has a unique ID that would be a random string of 10 characters.
- An user can access a shopping list using a link that would contain the ID.
- The application should be local first. If even the user is offline, he should be able to use the application. When the user is online, the application should sync the data with the server, pushing and pulling changes.

## Storage

- Each shopping list will be stored in a file with the name being its ID.
- In the server side, all the shopping list that were synced will be stored.
- In the client side, any shopping list that the user accesses will be stored.

## Data Model

```js
    CRDT structure    
    {
        name: String,
        products: [
            {
                name: String,
                quantity: Number,
                wish: Number
            }
        ]
    }
```

## Client Side

- Local-first application. The user should be able to use the application even if he is offline: 
  - The client will store all the logic to add and remove products from the shopping list as well the code to render and update the UI. 
  - All the shopping list that the user accesses will be stored in the client side.
  

## Server Side

- The sever will only store and replicate the data as well being a sync point for different clients.
- The server will only have two endpoints:
  - one that serves the client application
  - another one that syncs the data

## Flow

### Creating a new shopping list
- The user will create a new shopping list through the interface which generates a unique ID.
  - This ID will be generated randomly and will be a string of 10 characters.
- The user will add different products to the shopping list and those changes will be stored in the client side.
- At any moment the user can sync the shopping list with the server.
  - The client will send a request to the server with the shopping list ID and the data.
  - The server will store the data and replicate it to all the clients that are connected to it as well the other server replicas.

### Accessing an existing shopping list
- The user try to access locally the file that contains the shopping list.
  - If the file exists, the user will be able to access the shopping list.
  - If the file doesn't exist, the user will create a new empty shopping list.


## Security