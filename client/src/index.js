import React from "react";
import ReactDOM from "react-dom/client";
import { AuthState } from "./context/Auth/AuthState";
import { ChatState } from "./context/Chat/ChatState";
import { AlertState } from "./context/Alert/Alert";
import { SocketState } from "./context/Handler/EventHandler";
import App from "./App";
import "./App.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AlertState>
    <ChatState>
      <SocketState>
        <AuthState>
          <App />
        </AuthState>
      </SocketState>
    </ChatState>
  </AlertState>
  /* </React.StrictMode> */
);
