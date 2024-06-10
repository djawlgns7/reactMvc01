import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import AudioComparison from "./components/AudioComparison.jsx";
import WebSocketComponent from "./components/WebSocketComponent.jsx";
import ClientComponent from "./components/ClientComponent.jsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/music" element={<AudioComparison />} />
                    <Route path="/host" element={<WebSocketComponent />} />
                    <Route path="/client" element={<ClientComponent />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
