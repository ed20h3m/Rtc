import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthState } from "./context/Auth/AuthState";
import { ChatState } from "./context/Chat/ChatState";
import { AlertState } from "./context/Alert/Alert";
import { SocketState } from "./context/Handler/EventHandler";
import App from "./App";
import "./App.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AlertState>
      <SocketState>
        <ChatState>
          <AuthState>
            <App />
          </AuthState>
        </ChatState>
      </SocketState>
    </AlertState>
  </BrowserRouter>
  // </React.StrictMode>
);
