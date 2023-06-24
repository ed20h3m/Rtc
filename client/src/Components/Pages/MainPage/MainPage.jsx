import React, { useContext } from "react";
import "./MainPage.scss";
import Chats from "./Chats";
import Message from "./Message";
import { ChatContext } from "../../../context/Chat/ChatState";

const MainPage = () => {
  const { IsChatSelected } = useContext(ChatContext);
  return (
    <div className="container-fixed">
      <div className="main-page">
        <Chats />
        {IsChatSelected && <Message />}
      </div>
    </div>
  );
};

export default MainPage;
