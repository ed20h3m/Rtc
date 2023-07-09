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

  // Connect socket
  const ConnectSocket = async (username) => {
    // attach username
    socket.auth = { username };
    socket.connect();
  };

  useEffect(() => {
    socket.on("user connected", (data) => {
      let payload = {};
      let found = false;
      for (let i = 0; i < state.ConnectedUsers.length; i++) {
        if (state.ConnectedUsers[i].username === data.username) {
          found = true;
          state.ConnectedUsers[i].connected = true;
          payload = state.ConnectedUsers;
          break;
        }
      }
      if (!found) {
        payload = [...state.ConnectedUsers, data];
      }
      dispatch({ type: ADD_CONNECTED_USER, payload });
    });
    socket.on("user disconnected", (id) => {
      for (let i = 0; i < state.ConnectedUsers.length; i++) {
        if (state.ConnectedUsers[i].userID === id) {
          state.ConnectedUsers[i].connected = false;
          dispatch({
            type: REMOVE_CONNECTED_USER,
            payload: state.ConnectedUsers,
          });
          break;
        }
      }
      // copy = copy.filter((user) => user.userID !== id);
    });
    socket.on("private message", ({ content, from }) => {
      const user = document.getElementsByClassName("selected-name")[0];
      const messages = document.getElementsByClassName("messages")[0];
      let Copy = [...state.ConnectedUsers];
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
    socket.on("user typing", ({ from, isTyping }) => {
      state.ConnectedUsers.forEach((user) => {
        if (user.username === from) {
          user.isTyping = isTyping;
        }
      });
      dispatch({
        type: SET_CONNECTED_USERS,
        payload: [...state.ConnectedUsers],
      });
    });
    return () => {
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
      socket.off("user typing");
    };
  }, [state.ConnectedUsers]);

  // register events and capture events
  const connect = async () => {
    // Runs Once
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
    // Runs Once
    socket.on("users", async (data) => {
      ToggleLoading(true);
      dispatch({ type: SET_CONNECTED_USERS, payload: data });
      ToggleLoading(false);
    });
    // Runs Once
    socket.on("friend request accepted", (user) => {
      SetAlert(`${user.username} Accepted Your Friend Request`);
      AddUser(user);
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
    dispatch({ type: ADD_USER, payload: data });
  };

  const RemoveUser = (username) => {
    const filteredItems = state.ConnectedUsers.filter(
      (user) => user.username !== username
    );
    dispatch({ type: SET_CONNECTED_USERS, payload: filteredItems });
  };

  const NotifyFriendRequest = (to, IsAccept) => {
    socket.emit("friend request", {
      from: {
        userID: socket.userID,
        username: localStorage.getItem("username"),
      },
      to: {
        userID: to.userID,
        username: to.username,
      },
      IsAccept: IsAccept,
    });
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
