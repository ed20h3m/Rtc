import React, { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../../context/Chat/ChatState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import CloseIcon from "@mui/icons-material/Close";
import "./Message.scss";

const Message = () => {
  const [state, setState] = useState("");
  const {
    SelectedChat,
    SetSelectChat,
    IsChatSelected,
    ShowChats,
    SetShowChats,
  } = useContext(ChatContext);
  const { sendMessage } = useContext(SocketContext);

  useEffect(() => {
    const messages = document.getElementsByClassName("messages")[0];
    AddMessages(SelectedChat);
    messages.scrollIntoView(false);
  }, [SelectedChat]);

  const AddMessages = (user) => {
    const messages = document.getElementsByClassName("messages")[0];
    messages.innerText = "";
    for (let i = 0; i < user.messages.length; i++) {
      const newMessage = document.createElement("div");
      newMessage.classList.add("newMessage");
      newMessage.classList.add(
        user.messages[i].from === "self" ? "me" : "client"
      );
      const div = document.createElement("div");
      div.innerHTML = user.messages[i].content;
      newMessage.appendChild(div);
      messages.appendChild(newMessage);
    }
  };

  const AddNewMessage = () => {
    const messages = document.getElementsByClassName("messages")[0];
    if (!state) return;
    const newMessage = document.createElement("div");
    newMessage.classList.add("newMessage");
    newMessage.classList.add("me");
    const div = document.createElement("div");
    div.innerHTML = state;
    newMessage.appendChild(div);
    messages.appendChild(newMessage);
    const messageBox = document.getElementById("message-box");
    messageBox.value = "";
    sendMessage(state, SelectedChat);
    setState("");
    messages.scrollIntoView(false);
  };
  const onChange = (e) => setState(e.target.value);

  const cancel = () => {
    SetShowChats(true);
    if (ShowChats) {
      const chats = document.getElementById("chats-");
      for (let i = 0; i < chats.children.length; i++) {
        if (chats.children[i].style.backgroundColor !== "#222") {
          chats.children[i].style.backgroundColor = "#222";
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

  return (
    <div className="message">
      <header>
        <div className="left">
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
        <div className="messages"></div>
      </main>
      <footer>
        <input className="left" id="message-box" onChange={onChange}></input>
        <div className="right">
          <button onClick={AddNewMessage}>Send</button>
        </div>
      </footer>
    </div>
  );
};

export default Message;
