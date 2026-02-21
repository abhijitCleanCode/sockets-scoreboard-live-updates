import { WebSocket, WebSocketServer } from "ws";

// prevent repeatative JSON.Stringify calls and ensure socket is actually open before sending
function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }

    client.send(JSON.stringify(payload));
  }
}

// this will receive http server instance, created by express
export function attachWebSocketServer(server) {
    // pass express server to ws so that it can attach itself to the same underlying server
    const wss = new WebSocketServer({
        server, // uses same server and listen for upgrade request | avoid running separate port for ws
        path: "/ws", // only req made to this exact path r eligible for ws upgrade
        maxPayload: 1024 * 1024, // 1mb, security measure avoid flooding
    });

    wss.on("connection", (socket) => {
        sendJson(socket, { type: "welcome" });

        socket.on("error", console.error);
    });

    function broadcastMatchCreated(match) {
        broadcast(wss, { type: "match_created", data: match });
    }

    return { broadcastMatchCreated };
};
