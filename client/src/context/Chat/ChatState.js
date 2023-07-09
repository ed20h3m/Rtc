import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { AlertContext } from "../Alert/Alert";
import ChatReducer from "../Chat/ChatReducer";

// import types
import {
  SET_FRIENDS,
  SELECT_CHAT,
  IS_CHAT_SELECTED,
  SHOW_CHATS,
  SET_SEARCH,
} from "../types";
import { SocketContext } from "../Handler/EventHandler";
import { socket } from "../Handler/Socket";

// Create auth context
export const ChatContext = createContext();
export const ChatState = (props) => {
  // Create initial state
  const initialState = {
    IsChatSelected: false,
    SelectedChat: {},
    chats: [],
    ShowChats: true,
    SearchFriends: [],
  };
  const [state, dispatch] = useReducer(ChatReducer, initialState);

  // import Alert context
  const {
    SetAlert,
    ToggleLoading,
    ToggleOverlay,
    ToggleMessagesLoading,
    ToggleSettingsLoading,
    ToggleSearchLoading,
    ToggleReqLoading,
    ToggleChatSettings,
  } = useContext(AlertContext);

  const { AddUser, RemoveUser, NotifyFriendRequest, ConnectedUsers } =
    useContext(SocketContext);
  // get all friends from database

  useEffect(() => {
    socket.on("friend removed", ({ username }) => {
      RemoveUser(username);
      SetAlert(`${username} Removed You`);
      if (state.IsChatSelected) {
        if (state.ShowChats) {
          const chats = document.getElementById("chats-");
          for (let i = 0; i < chats.children.length; i++) {
            if (chats.children[i].style.backgroundColor !== "#151515") {
              chats.children[i].style.backgroundColor = "#151515";
            }
            const contact = document.getElementsByClassName("chats")[0];
            if (contact.style.display === "none")
              contact.style.display = "block";
          }
          const selectedChat =
            document.getElementsByClassName("selected-contact")[0];
          if (selectedChat) selectedChat.classList.remove("selected-contact");
        }
        SetSelectChat(false);
      }
    });
    socket.on("clear convo", ({ username }) => {
      SetAlert(`${username} cleared your conversation`);
      if (state.SelectedChat.username === username) {
        state.SelectedChat.messages = [];
        dispatch({ type: SELECT_CHAT, payload: state.SelectedChat });
      }
    });
    return () => {
      socket.off("friend removed");
      socket.off("clear convo");
    };
    // eslint-disable-next-line
  }, [ConnectedUsers]);

  const GetFriends = async () => {
    try {
      // Set loading: true
      ToggleLoading(true);

      // set token to headers
      axios.defaults.headers.common["token"] = localStorage.token;

      // make request to backend
      const res = await axios.get("/user/friends");

      // store friends into context
      dispatch({ type: SET_FRIENDS, payload: res.data.Friends });
    } catch ({ response }) {
      // alert if there is an error
      SetAlert(response.data.message);
      // console.log(error);
    }
    ToggleLoading(false);
  };
  // select chat
  const SelectChat = async (chat) => {
    chat.newMessageCounter = 0;
    try {
      ToggleMessagesLoading(true);
      const res = await axios.post("/convos", {
        Users: [localStorage.getItem("username"), chat.username],
      });
      await ResetCounter(chat.username);
      chat.messages = res.data.convos;
    } catch ({ response }) {
      SetAlert(response.data.message);
    }

    ToggleMessagesLoading(false);
    dispatch({ type: SELECT_CHAT, payload: chat });
  };
  // set selected chat
  const SetSelectChat = (option) => {
    dispatch({ type: IS_CHAT_SELECTED, payload: option });
  };
  // set visibility of chats
  const SetShowChats = (option) => {
    dispatch({ type: SHOW_CHATS, payload: option });
  };
  // set visibility of chats
  const ResetCounter = async (To) => {
    try {
      await axios.put("/convos", {
        To,
        From: localStorage.getItem("username"),
      });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };
  // Clear Conversation
  const ClearConvo = async (Username) => {
    try {
      ToggleSettingsLoading(true);
      const res = await axios.put("/convos/clear-convo", {
        Username,
        Me: localStorage.getItem("username"),
      });
      SetAlert(res.data.message);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    state.SelectedChat.messages = [];
    socket.emit("notify clear convo", {
      from: localStorage.getItem("username"),
      to: {
        username: state.SelectedChat.username,
        userID: state.SelectedChat.userID,
      },
    });
    dispatch({ type: SELECT_CHAT, payload: state.SelectedChat });
    ToggleSettingsLoading(false);
    ToggleChatSettings(false);
    ToggleOverlay(false);
  };
  // Remove Friend in settings
  const RemoveFriendSettings = async () => {
    ToggleSettingsLoading(true);
    await RemoveFriend(state.SelectedChat.username);
    ToggleSettingsLoading(false);
    ToggleChatSettings(false);
    ToggleOverlay(false);
  };
  // Remove Friend in search
  const RemoveFriendSearch = async () => {
    ToggleReqLoading(true);
    await RemoveFriend(state.SelectChat.username);
    ToggleReqLoading(false);
  };
  // Remove Friend
  const RemoveFriend = async (Username) => {
    try {
      // set token to headers
      axios.defaults.headers.common["token"] = localStorage.token;
      const res = await axios.put("/user/friends/delete", {
        User: { Username },
      });
      SetAlert(res.data.message);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    SetSelectChat(false);
    RemoveUser(Username);
    NotifyFriendRequest(state.SelectedChat, false);
  };
  // Search Friends
  const Search = async (username) => {
    try {
      if (username === "") return dispatch({ type: SET_SEARCH, payload: [] });

      axios.defaults.headers.common["token"] = localStorage.token;
      ToggleSearchLoading(true);
      const res = await axios.post("/user/friends/search", {
        Username: username,
      });
      dispatch({ type: SET_SEARCH, payload: res.data.Users });
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleSearchLoading(false);
  };
  // Send friend request
  const SendFriendRequest = async (username) => {
    try {
      ToggleReqLoading(true);
      axios.defaults.headers.common["token"] = localStorage.token;
      const res = await axios.post("/user/friends", {
        User: { Username: username },
      });
      SetAlert(res.data.message);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleReqLoading(false);
  };
  //Cancel Request
  const CancelRequest = async (username) => {
    try {
      ToggleReqLoading(true);
      axios.defaults.headers.common["token"] = localStorage.token;
      const res = await axios.put("/user/friends/cancel", {
        User: { Username: username, Request: false, Cancel: true },
      });
      SetAlert(res.data.message);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleReqLoading(false);
  };
  // Accept / Reject Request
  const HandleRequest = async (User) => {
    try {
      ToggleReqLoading(true);
      axios.defaults.headers.common["token"] = localStorage.token;
      const res = await axios.put("/user/friends", User);
      SetAlert(res.data.message);
    } catch ({ response }) {
      // alerts user if error
      SetAlert(response.data.message);
    }
    ToggleReqLoading(false);
    if (User.User.Request) {
      await GetSession(User.User.Username);
    }
  };
  // Get user Session
  const GetSession = async (Username) => {
    try {
      axios.defaults.headers.common["token"] = localStorage.token;
      const res = await axios.post("/sessions", { Username });
      AddUser(res.data.Session);
      NotifyFriendRequest(res.data.Session, true);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
  };

  // Event Triggered when user types
  const OnType = (typing) => {
    // console.log(state.SelectedChat);
    socket.emit("typing", {
      from: localStorage.getItem("username"),
      to: {
        username: state.SelectedChat.username,
        userID: state.SelectedChat.userID,
      },
      isTyping: typing,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        ResetCounter,
        GetFriends,
        SelectChat,
        SetSelectChat,
        SetShowChats,
        ClearConvo,
        RemoveFriendSearch,
        RemoveFriendSettings,
        Search,
        SendFriendRequest,
        CancelRequest,
        HandleRequest,
        OnType,
        ShowChats: state.ShowChats,
        chats: state.chats,
        SelectedChat: state.SelectedChat,
        IsChatSelected: state.IsChatSelected,
        SearchFriends: state.SearchFriends,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
