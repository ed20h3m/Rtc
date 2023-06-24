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
  const { GetFriends } = useContext(ChatContext);
  const { isLoading } = useContext(AlertContext);
  const { ConnectSocket, connect, ConnectedUsers } = useContext(SocketContext);
  useEffect(() => {
    GetFriends();
    connect();
    ConnectSocket(localStorage.getItem("username"));
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
