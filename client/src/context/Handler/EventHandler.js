import React, { createContext, useContext, useReducer } from "react";
import { AlertContext } from "../Alert/Alert";
import EventReducer from "./EventReducer";
import {
  SET_CONNECTED_USERS,
  ADD_CONNECTED_USER,
  REMOVE_CONNECTED_USER,
  SEND_MESSAGE,
} from "../types";
import { socket } from "./Socket";

// create context
export const SocketContext = createContext();

export const SocketState = (props) => {
  // set initial state
  const initialState = {
    ConnectedUsers: [],
  };
  const [state, dispatch] = useReducer(EventReducer, initialState);
  // Import alert context
  // const { SetAlert } = useContext(AlertContext);
  // Create socket

  let copy = [];

  // Connect socket
  const ConnectSocket = async (username) => {
    // attach username
    socket.auth = { username };
    socket.connect();
  };

  // register events and capture events
  const connect = async () => {
    socket.on("connect", () => {
      // SetAlert("Connected");
    });

    socket.on("disconnect", () => {
      // SetAlert("Disconnected");
    });

    socket.on("users", (data) => {
      dispatch({ type: SET_CONNECTED_USERS, payload: data });
      copy = data;
    });
    socket.on("user connected", (data) => {
      // SetAlert("User Connected");
      dispatch({ type: ADD_CONNECTED_USER, payload: data });
      copy = [...copy, data];
    });
    socket.on("user disconnected", (id) => {
      // SetAlert("User Disconnected");
      dispatch({
        type: REMOVE_CONNECTED_USER,
        payload: id,
      });
      copy = copy.filter((user) => user.userID !== id);
    });
    socket.on("private message", ({ content, from }) => {
      const user = document.getElementsByClassName("selected-name")[0];
      const messages = document.getElementsByClassName("messages")[0];
      if (user && messages) {
        if (user.innerText === from.username) {
          const newMessage = document.createElement("div");
          newMessage.classList.add("newMessage");
          newMessage.classList.add("client");
          const div = document.createElement("div");
          div.innerHTML = content;
          newMessage.appendChild(div);
          messages.appendChild(newMessage);
          const messageBox = document.getElementById("message-box");
          messageBox.value = "";
        }
      }
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].userID === from.userID) {
          copy[i].messages.push({
            from: from.username,
            content: content,
          });
          if (user) {
            if (copy[i].username !== user.innerText) {
              copy[i].newMessageCounter++;
            }
          } else {
            copy[i].newMessageCounter++;
          }
          break;
        }
      }
      dispatch({ type: SET_CONNECTED_USERS, payload: copy });
      if (messages) messages.scrollIntoView(false);
    });
    // return () => {
    //   socket.off("connect");
    //   socket.off("disconnect");
    //   socket.off("message");
    // };
  };

  // Used for sending messages
  const sendMessage = (content, user) => {
    let users = state.ConnectedUsers;
    for (let i = 0; i < users.length; i++) {
      if (users[i].userID === user.userID) {
        users[i].messages.push({
          from: "self",
          content: content,
        });
      }
    }
    dispatch({ type: SEND_MESSAGE, payload: users });
    socket.emit("private message", {
      content,
      from: localStorage.getItem("username"),
      to: user.userID,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        ConnectSocket,
        connect,
        ConnectedUsers: state.ConnectedUsers,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};
