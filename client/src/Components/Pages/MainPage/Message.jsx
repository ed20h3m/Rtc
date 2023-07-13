import React, { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../../context/Chat/ChatState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import { AlertContext } from "../../../context/Alert/Alert";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../../utils/Loading";
import Text from "./Text";
import "./Message.scss";

const Message = () => {
  const [state, setState] = useState("");
  const [isTyping, setTyping] = useState(true);
  const [timer, setTimer] = useState(null);
  const { SelectedChat, SetSelectChat, ShowChats, SetShowChats, OnType } =
    useContext(ChatContext);
  const { sendMessage, ConnectedUsers } = useContext(SocketContext);
  const {
    ShowChatSettings,
    ToggleChatSettings,
    MessagesLoading,
    ToggleOverlay,
  } = useContext(AlertContext);

  useEffect(() => {
    const messages = document.getElementsByClassName("messages")[0];
    if (messages) {
      messages.scrollIntoView(false);
    }
  }, [SelectedChat.messages, ConnectedUsers]);

  const AddNewMessage = (e) => {
    e.preventDefault();
    if (state === "") return;
    const messages = document.getElementsByClassName("messages")[0];
    sendMessage(state, SelectedChat);
    setState("");
    messages.scrollIntoView(false);
  };

  const onChange = (e) => {
    if (isTyping) {
      OnType(true);
      setTyping(false);
    }

    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setTyping(true);
      OnType(false);
    }, 1000);
    setTimer(newTimer);

    setState(e.target.value);
  };

  const cancel = () => {
    SetShowChats(true);
    if (ShowChats) {
      const chats = document.getElementById("chats-");
      for (let i = 0; i < chats.children.length; i++) {
        if (chats.children[i].style.backgroundColor !== "#151515") {
          chats.children[i].style.backgroundColor = "#151515";
        }
        const contact = document.getElementsByClassName("chats")[0];
        if (contact.style.display === "none") contact.style.display = "block";
      }
      const selectedChat =
        document.getElementsByClassName("selected-contact")[0];
      if (selectedChat) selectedChat.classList.remove("selected-contact");
    }
    SetSelectChat(false);
  };

  const ShowSettings = () => {
    ToggleChatSettings(!ShowChatSettings);
    ToggleOverlay(true);
  };

  return MessagesLoading ? (
    <div className="loading-con">
      <Loading />
    </div>
  ) : (
    <div className="message">
      <header>
        <div className="left" onClick={ShowSettings}>
          <img
            src="https://cdn.dribbble.com/users/361185/screenshots/3803404/media/1d9cbaab0e2aacf008c6b6524662183a.png?compress=1&resize=400x300&vertical=top"
            alt=""
          />
          <h2 className="selected-name">{SelectedChat.username}</h2>
        </div>
        <div className="right-header">
          <CloseIcon className="bg" onClick={cancel} />
        </div>
      </header>
      <main className="mes">
        <div className="messages">
          {SelectedChat.messages.length > 0 &&
            SelectedChat.messages.map((mes, idx) => (
              <Text text={mes} key={idx} />
            ))}
        </div>
      </main>
      <form>
        <input
          className="left"
          id="message-box"
          onChange={onChange}
          value={state}
        ></input>
        <div className="right">
          <button onClick={AddNewMessage}>Send</button>
        </div>
      </form>
    </div>
  );
};

export default Message;
