import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AlertContext } from "../Alert/Alert";
import EventReducer from "./EventReducer";
import {
  SET_CONNECTED_USERS,
  ADD_CONNECTED_USER,
  REMOVE_CONNECTED_USER,
  SEND_MESSAGE,
  ADD_USER,
} from "../types";
import { socket } from "./Socket";

// create context
export const SocketContext = createContext();

export const SocketState = (props) => {
  // set initial state
  const initialState = {
    ConnectedUsers: [],
  };
  const { ToggleLoading, SetAlert } = useContext(AlertContext);
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
    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
      // save the ID of the session
      socket.sessionID = sessionID;
    });
    socket.on("users", async (data) => {
      ToggleLoading(true);
      dispatch({ type: SET_CONNECTED_USERS, payload: data });
      copy = data;
      ToggleLoading(false);
    });
    socket.on("user connected", (data) => {
      // SetAlert("User Connected");
      let payload = {};
      let found = false;
      for (let i = 0; i < copy.length; i++) {
        // console.log(copy[i].username, data.username);
        if (copy[i].username === data.username) {
          found = true;
          copy[i].connected = true;
          payload = copy;
          break;
        }
      }
      if (!found) {
        payload = [...state.ConnectedUsers, data];
      }
      dispatch({ type: ADD_CONNECTED_USER, payload });
    });
    socket.on("user disconnected", (id) => {
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].userID === id) {
          copy[i].connected = false;
          dispatch({
            type: REMOVE_CONNECTED_USER,
            payload: copy,
          });
          break;
        }
      }
      // copy = copy.filter((user) => user.userID !== id);
    });
    socket.on("friend request accepted", (user) => {
      SetAlert(`${user.username} Accepted Your Friend Request`);
      AddUser(user);
    });
    socket.on("private message", ({ content, from }) => {
      const user = document.getElementsByClassName("selected-name")[0];
      const messages = document.getElementsByClassName("messages")[0];
      console.log(copy);
      let Copy = [...copy];
      for (let i = 0; i < Copy.length; i++) {
        if (Copy[i].userID === from.userID) {
          Copy[i].messages.push({
            from: from.username,
            Message: content,
          });
          if (user) {
            if (Copy[i].username !== user.innerText) {
              Copy[i].newMessageCounter++;
            }
          } else {
            Copy[i].newMessageCounter++;
          }
          break;
        }
      }
      // SetUsers();
      dispatch({ type: SET_CONNECTED_USERS, payload: Copy });
      if (messages) messages.scrollIntoView(false);
    });
  };

  // Used for sending messages
  const sendMessage = (content, user) => {
    let users = [...state.ConnectedUsers];
    for (let i = 0; i < users.length; i++) {
      if (users[i].userID === user.userID) {
        users[i].messages.push({
          Message: content,
          from: localStorage.getItem("username"),
          to: user.username,
        });
      }
    }
    dispatch({ type: SEND_MESSAGE, payload: users });
    socket.emit("private message", {
      content,
      from: localStorage.getItem("username"),
      to: { username: user.username, userID: user.userID },
    });
  };

  const Disconnect = () => {
    // socket.emit("disconnec");
    socket.disconnect();
  };

  const AddUser = (data) => {
    copy = [...state.ConnectedUsers, data];
    dispatch({ type: ADD_USER, payload: data });
  };

  const RemoveUser = (username) => {
    const filteredItems = state.ConnectedUsers.filter(
      (user) => user.username !== username
    );
    copy = filteredItems;
    dispatch({ type: SET_CONNECTED_USERS, payload: filteredItems });
  };

  const NotifyFriendRequest = (to) => {
    socket.emit("friend request", {
      from: {
        userID: socket.userID,
        username: localStorage.getItem("username"),
      },
      to: {
        userID: to.userID,
        username: to.username,
      },
    });
  };

  const SetUsers = () => {
    // console.log(copy);
    // console.log(state.ConnectedUsers);
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        ConnectSocket,
        connect,
        Disconnect,
        AddUser,
        RemoveUser,
        NotifyFriendRequest,
        ConnectedUsers: state.ConnectedUsers,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};
