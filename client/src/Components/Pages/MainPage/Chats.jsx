import React, { useContext, useEffect } from "react";
import "./Chats.scss";
import Contact from "./Contact";
import { ChatContext } from "../../../context/Chat/ChatState";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Auth/AuthState";
import { SocketContext } from "../../../context/Handler/EventHandler";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Loading from "../../utils/Loading";

const Chats = () => {
  const { LogOut } = useContext(AuthContext);
  const { isLoading } = useContext(AlertContext);
  const { ConnectedUsers } = useContext(SocketContext);
  const { IsChatSelected, SelectedChat } = useContext(ChatContext);

  useEffect(() => {
    if (IsChatSelected && window.innerWidth > 700) {
      const chatList = document.getElementById("chats-");
      for (let i = 0; i < chatList.children.length; i++) {
        // console.log(chatList.children[i].innerText);
        if (chatList.children[i].innerText === SelectedChat.username) {
          chatList.children[i].classList.add("selected-contact");
          chatList.children[i].style.backgroundColor = "#000";
          break;
        }
      }
    }
    // eslint-disable-next-line
  }, []);
  const onClick = () => LogOut();

  return (
    <div className="chats">
      <header>
        <h1>Chats</h1>
        <PowerSettingsNewIcon className="log-out" onClick={onClick} />
      </header>
      <main id="chats-">
        {isLoading ? (
          <div className="center-loading">
            <Loading />
          </div>
        ) : (
          ConnectedUsers.map((contact, idx) => (
            <Contact contact={contact} id={idx} key={idx} />
          ))
        )}
        {/* {isLoading ? (
          <div className="center-loading">
            <Loading />
          </div>
        ) : (
          chats.map((contact, idx) => (
            <Contact contact={contact} id={idx} key={idx} />
          ))
        )} */}
      </main>
    </div>
  );
};

export default Chats;
