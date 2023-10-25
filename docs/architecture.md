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
                flag: String
            }
        ]
    }
```

## Flow

