import React, {useEffect, useRef, useState} from 'react';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);

    const name = useRef("");

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/12345');

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message.data]);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && input.trim()) {
            const message = name.current.value + ": " + input;
            ws.send(message);
            setMessages((prevMessages) => [...prevMessages, message]);
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                닉네임: <input type={"text"} ref={name}/>
            </div>
        </div>
    );
};

export default WebSocketComponent;