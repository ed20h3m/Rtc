import React, { useContext, useEffect } from "react";
import "./MainPage.scss";
import Chats from "./Chats";
import Message from "./Message";
import { ChatContext } from "../../../context/Chat/ChatState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import { AuthContext } from "../../../context/Auth/AuthState";

const MainPage = () => {
  const { IsChatSelected, ShowChats, GetFriends } = useContext(ChatContext);
  const { ConnectSocket, connect, ConnectedUsers } = useContext(SocketContext);
  // const { GetFriends } = useContext(AuthContext);

  useEffect(() => {
    GetFriends();
    connect();
    ConnectSocket(localStorage.getItem("username"));
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fixed">
      <div className="main-page">
        {ShowChats && <Chats />}
        {IsChatSelected && <Message />}
      </div>
    </div>
  );
};

export default MainPage;
