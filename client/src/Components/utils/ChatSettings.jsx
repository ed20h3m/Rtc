import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AlertContext } from "../../context/Alert/Alert";
import "./utils.scss";
import { ChatContext } from "../../context/Chat/ChatState";
import Loading from "../utils/Loading";

const ChatSettings = () => {
  const { ToggleOverlay, isSettingsLoading } = useContext(AlertContext);
  const { ClearConvo, SelectedChat, RemoveFriendSettings } =
    useContext(ChatContext);
  return (
    <div className="chat-settings">
      <header>
        <div className="right-header" onClick={() => ToggleOverlay(false)}>
          <CloseIcon className="right" />
        </div>
        <h2>Chat Settings</h2>
      </header>
      {isSettingsLoading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        <main>
          <div onClick={() => ClearConvo(SelectedChat.username)}>
            <h3>Clear Conversation</h3>
          </div>
          <div>
            <h3 className="red-text" onClick={() => RemoveFriendSettings()}>
              Remove Contact
            </h3>
          </div>
          <div>
            <h3 className="red-text">Block Contact</h3>
          </div>
        </main>
      )}
    </div>
  );
};

export default ChatSettings;
