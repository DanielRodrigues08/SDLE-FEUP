# Local-first Software Paper Notes

- [Read the paper: Local-first software: You own your data, in spite of the cloud](https://www.inkandswitch.com/local-first.html)

## Roles:
- In local-first software, the primary copy of data resides on your local device.
- Servers store secondary copies of our data to facilitate access from multiple devices.

## CRDTs (Conflict-free Replicated Data Types):
- CRDTs are data structures that enable real-time collaboration in distributed systems.
- They can synchronize their state through any communication channel.

## Functional Reactive Programming (FRP):
- User documents receive updates from both the local user and the network simultaneously.
- By channeling all changes to the underlying data through a single function (a "reducer"), it becomes easy to ensure that all relevant local changes are shared with other users. 