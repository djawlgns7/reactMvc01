import React, { useEffect, useState, useRef } from 'react';

const ClientComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [ws, setWs] = useState(null);
    const name = useRef(null);
    const roomInput = useRef(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (message) => {
            const msgData = message.data;
            if (msgData.startsWith("ROOMID:")) {
                setRoomId(msgData.split(":")[1]);
            } else if (msgData.startsWith("JOINED:")) {
                setRoomId(msgData.split(":")[1]);
            } else if (msgData.startsWith("ERROR:")) {
                alert(msgData.split(":")[1]);
            } else {
                setMessages((prevMessages) => [...prevMessages, msgData]);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const createRoom = () => {
        if (ws) {
            ws.send("CREATE:");
        }
    };

    const joinRoom = () => {
        if (ws && roomInput.current.value.trim()) {
            ws.send("JOIN:" + roomInput.current.value.trim());
        }
    };

    const sendMessage = () => {
        if (ws && input.trim() && roomId) {
            const message = name.current.value + ": " + input;
            ws.send("MESSAGE:" + roomId + ":" + message);
            setMessages((prevMessages) => [...prevMessages]);
            setInput(''); // Clear the input field
        }
    };

    return (
        <div>
            <h1>WebSocket Chat</h1>
            {roomId ? (
                <div>
                    <h2>Room ID: {roomId}</h2>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <div>
                        이름: <input type={"text"} ref={name} value={name.current.value} />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        ref={name}
                        placeholder="Enter your name"
                    />
                    <button onClick={createRoom}>Create Room</button>
                    <input
                        type="text"
                        ref={roomInput}
                        placeholder="Enter room ID"
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            )}
        </div>
    );
};

export default ClientComponent;
