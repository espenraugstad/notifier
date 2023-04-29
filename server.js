const express = require("express");
const server = express();
const PORT = 8080;

server.use(express.json());
server.use(express.static("public"));

let connections = [];

server.get("/ping", (req, res) => {
  console.log("Connecting");
  // SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // Confirm connection
  res.write("event: connected\ndata: Connected to server\n\n");
  connections.push(res);

  // Write message if query message is "ping"
  /*   if (req.query.message === "ping") {
    console.log(`Received: ${req.query.message}`);
    res.write(`event: message\ndata: ${req.query.message}\n\n`);
  } */

  // Listen for "close" event
  req.on("close", () => {
    console.log("Client disconnected");
  });
});

server.post("/pinger", (req, res)=>{
    console.log("Pinger");
    const message = req.body.message;
    console.log(message);
    for(let c of connections){
        c.write(`event: message\ndata: ${message}\n\n`);
    }
    
    res.end();
})

/* server.on("data", (data) => {
  console.log("Processing data");
  const message = JSON.parse(data.toString()).message;

  // Write message if query message is "ping"
  if (message === "ping") {
    console.log(`Received: ${message}`);
    server
      .write(`event: message\ndata: ${message}\n\n`)
      .catch((err) => console.log(err));
  }
}); */

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
