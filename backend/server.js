// WebSocket init
const websocket = new require('ws');
const wss = new websocket.Server({ port : 3000 });

// Server start log
console.log('server started');

// WebSocket logic
wss.on('connection', ws => {
	console.log("Client connected");
	// on message
	ws.on('message', message => {
		// message to string
		message = message.toString()

		wss.clients.forEach(client => {
			if (client.readyState === websocket.OPEN) {
				client.send(message)
			}
		});
	})
})