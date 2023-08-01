import React, { useEffect, useState, useContext, useRef } from "react";
import { ChatContext } from "../../../context/Chat/ChatState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import { AlertContext } from "../../../context/Alert/Alert";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Text from "./Text";
import "./ChatPanel.scss";
import Load from "../../utils/Load";

const ChatPanel = () => {
  const [state, setState] = useState("");
  const [isTyping, setTyping] = useState(true);
  const [timer, setTimer] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [ShowBtn, SetShowBtn] = useState(false);
  const scrollContainerRef = useRef(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const divElement = document.querySelector(".messages");
      const num = Number(
        (
          scrollContainerRef.current.scrollTop / divElement.offsetHeight
        ).toFixed(2)
      );
      if (num <= 0.8) SetShowBtn(true);
      else SetShowBtn(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { SelectedChat, SetSelectChat, ShowChats, SetShowChats, OnType } =
    useContext(ChatContext);

  const { sendMessage, ConnectedUsers } = useContext(SocketContext);
  const {
    ShowChatSettings,
    ToggleChatSettings,
    MessagesLoading,
    ToggleOverlay,
  } = useContext(AlertContext);

  const AddNewMessage = (e) => {
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

  useEffect(() => {
    if (!MessagesLoading) {
      const divElement = document.getElementsByClassName("chat-content")[0];
      if (divElement) {
        divElement.addEventListener("scroll", handleScroll);
      }
    }
  }, [MessagesLoading]);

  useEffect(() => {
    const mes = document.getElementsByClassName("messages")[0];
    if (mes) mes.scrollIntoView(false);
  }, [SelectedChat.messages, ConnectedUsers]);

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

  const scrollDown = () => {
    const mes = document.getElementsByClassName("messages")[0];
    if (mes) mes.scrollIntoView(false);
  };

  return MessagesLoading ? (
    <div className="loading-con">
      <Load />
    </div>
  ) : (
    <div className="chat-container" style={{ height: windowHeight }}>
      <div className="header">
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
      </div>
      <div
        className="chat-content"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="messages">
          {SelectedChat.messages.length > 0 &&
            SelectedChat.messages.map((mes, idx) => (
              <Text text={mes} key={idx} />
            ))}
        </div>
      </div>
      {ShowBtn && (
        <div className="arrow-up">
          <KeyboardArrowDownIcon className="icon" onClick={scrollDown} />
        </div>
      )}
      <div className="footer">
        <form action="">
          <Input
            placeholder="Enter Message"
            id="message-box"
            onChange={onChange}
            value={state}
          />
          <Button name="Send" event={AddNewMessage} />
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
