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
import RequestList from "./RequestList";
import ChatPanel from "./ChatPanel";

const MainPage = () => {
  const { IsChatSelected, ShowChats, GetFriends } = useContext(ChatContext);
  const { GetUser } = useContext(AuthContext);
  const { ShowReqList } = useContext(AlertContext);
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
        {IsChatSelected ? (
          <ChatPanel />
        ) : (
          window.innerWidth >= 700 && <Friends />
        )}
        {ShowChatSettings && <ChatSettings />}
        {ShowReqList && <RequestList />}
      </div>
    </div>
  );
};

export default MainPage;
