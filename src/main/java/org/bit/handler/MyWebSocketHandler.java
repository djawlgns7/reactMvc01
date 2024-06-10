package org.bit.handler;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class MyWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // No action needed on initial connection
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String[] parts = payload.split(":", 2);
        String command = parts[0];
        String content = parts[1];

        if ("CREATE".equals(command)) {
            String roomId = generateRoomId();
            rooms.put(roomId, ConcurrentHashMap.newKeySet());
            rooms.get(roomId).add(session);
            session.sendMessage(new TextMessage("ROOMID:" + roomId));
        } else if ("JOIN".equals(command)) {
            String roomId = content;
            if (rooms.containsKey(roomId)) {
                rooms.get(roomId).add(session);
                session.sendMessage(new TextMessage("JOINED:" + roomId));
                broadcast(roomId, "User joined the room");
            } else {
                session.sendMessage(new TextMessage("ERROR:Room not found"));
            }
        } else if ("MESSAGE".equals(command)) {
            String[] msgParts = content.split(":", 2);
            String roomId = msgParts[0];
            String chatMessage = msgParts[1];
            broadcast(roomId, chatMessage);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        rooms.forEach((roomId, sessions) -> sessions.remove(session));
    }

    private void broadcast(String roomId, String message) throws Exception {
        if (rooms.containsKey(roomId)) {
            for (WebSocketSession session : rooms.get(roomId)) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }

    private String generateRoomId() {
        return Long.toHexString(Double.doubleToLongBits(Math.random()));
    }
}
