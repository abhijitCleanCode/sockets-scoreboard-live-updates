import express from "express";
import { matchesRouter } from "./routes/matches";
import http from "http";
import { attachWebSocketServer } from "./ws/server";

const PORT = 8000;
const HOST = "0.0.0.0";

const app = express();
//! create http server so that ws can attach itself
const server = http.createServer(app);

// enable express to understand json data
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/matches", matchesRouter);

// initialize ws
const { broadcastMatchCreated } = attachWebSocketServer(server);
// app.locals is express global obj accessible from any request
app.locals.broadcastMatchCreated = broadcastMatchCreated;


server.listen(PORT, HOST, () => {
    const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server running on port ${baseUrl}`);
    console.log(`ws server is running on ${baseUrl.replace('http', 'ws')}/ws`);
})
