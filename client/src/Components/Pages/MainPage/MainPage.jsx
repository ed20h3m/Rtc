import React, { useContext, useEffect } from "react";
import "./MainPage.scss";
import Chats from "./Chats";
import Message from "./Message";
import { ChatContext } from "../../../context/Chat/ChatState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import ChatSettings from "../../utils/ChatSettings";
import { AlertContext } from "../../../context/Alert/Alert";
import Friends from "./Friends";
import { AuthContext } from "../../../context/Auth/AuthState";

const MainPage = () => {
  const { IsChatSelected, ShowChats, GetFriends } = useContext(ChatContext);
  const { GetUser } = useContext(AuthContext);
  const { ConnectSocket, connect } = useContext(SocketContext);
  const { ShowChatSettings } = useContext(AlertContext);

  useEffect(() => {
    GetFriends();
    GetUser();
    connect();
    ConnectSocket(localStorage.getItem("username"));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {}, [IsChatSelected]);
  return (
    <div className="container-fixed">
      <div className="main-page">
        {ShowChats && <Chats />}
        {IsChatSelected ? <Message /> : window.innerWidth >= 700 && <Friends />}
        {ShowChatSettings && <ChatSettings />}
      </div>
    </div>
  );
};

export default MainPage;
