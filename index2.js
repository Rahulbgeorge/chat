const io = require('socket.io')();
const redisAdapter = require('socket.io-redis');
const Redis = require('ioredis');

// Redis configuration
const redisOptions = {
  host: 'your_redis_host',
  port: 6379,
  // ... other Redis options
};

// Initialize Redis clients
const pubClient = new Redis(redisOptions); // For publishing (if needed elsewhere)
const subClient = new Redis(redisOptions); // For subscribing

// Configure Socket.IO with the Redis adapter
io.adapter(redisAdapter({ pubClient, subClient }));

io.on('connection', (socket) => {
  socket.on('subscribe', (contractId) => {
    socket.join(`contract_${contractId}`); // Join Socket.IO room

    console.log(`Client ${socket.id} subscribed to contract ${contractId}`);
  });

  socket.on('unsubscribe', (contractId) => {
    socket.leave(`contract_${contractId}`);
    console.log(`Client ${socket.id} unsubscribed from contract ${contractId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});


// Subscribe to Redis channels (globally, only once)
const subscribedContracts = new Set(); // Keep track of subscribed contracts

const subscribeToContract = (contractId) => {
    const redisKey = `contract_ltp:${contractId}`;
    if (!subscribedContracts.has(contractId)) {
        subClient.subscribe(redisKey, (err, count) => {
            if (err) {
                console.error(`Error subscribing to ${redisKey}:`, err);
                return;
            }

            if (count === 1) { // Only subscribe once per contract
                console.log(`Subscribed to Redis channel: ${redisKey}`);
                subscribedContracts.add(contractId);

                subClient.on('message', (channel, message) => {
                    if (channel === redisKey) {
                        try {
                            const ltpInfo = JSON.parse(message); // Parse the message (assuming JSON)
                            io.to(`contract_${contractId}`).emit('ltp_update', { contractId, ltpInfo }); // Emit to room
                        } catch (parseError) {
                            console.error("Error parsing message:", parseError, message);
                        }
                    }
                });
            }
        });
    }
};


// ... (Your logic to determine which contracts to subscribe to initially - perhaps on server startup) ...
const initialContracts = ['contract_1', 'contract_2', 'contract_3']; // Example
initialContracts.forEach(subscribeToContract);


// Example: (Data is being published elsewhere)
// ... (No need for publishLTPUpdate here as data is published externally) ...


const port = process.env.PORT || 3000;
io.listen(port, () => {
  console.log(`Socket.IO server listening on port ${port}`);
});