import React, { useContext } from "react";
import { ChatContext } from "../../../context/Chat/ChatState";
import "./Contact.scss";

const Contact = ({ contact, id }) => {
  const { SetSelectChat, SelectChat, ShowChats, SetShowChats } =
    useContext(ChatContext);

  const Focus = (id, chat) => {
    SetSelectChat(true);
    if (window.innerWidth <= 700) {
      SetShowChats(false);
      const contact = document.getElementsByClassName("chats")[0];
      contact.style.display = "none";
    }
    const contact = document.getElementById(id);
    for (let i = 0; i < contact.parentElement.children.length; i++) {
      contact.parentElement.children[i].classList.remove("selected-contact");
      if (contact.parentElement.children[i].style.backgroundColor !== "#222") {
        contact.parentElement.children[i].style.backgroundColor = "#222";
      }
    }
    if (ShowChats) {
      contact.classList.add("selected-contact");
      contact.style.backgroundColor = "#000";
    }
    SelectChat(chat);
  };
  return (
    <div className="contact" id={id} onClick={() => Focus(id, contact)}>
      <div className="left">
        <img
          src="https://cdn.dribbble.com/users/361185/screenshots/3803404/media/1d9cbaab0e2aacf008c6b6524662183a.png?compress=1&resize=400x300&vertical=top"
          alt=""
        />
        <div className="mid">
          <h3>{contact.username}</h3>
          {contact.connected ? (
            <div className="con"></div>
          ) : (
            <div className="dis"></div>
          )}
        </div>
      </div>
      {contact.newMessageCounter !== 0 && (
        <div className="right">
          <p>{contact.newMessageCounter}</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
