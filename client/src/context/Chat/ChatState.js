import { createContext, useReducer, useContext } from "react";
import axios from "axios";
import { AlertContext } from "../Alert/Alert";
import ChatReducer from "../Chat/ChatReducer";

// import types
import {
  SET_FRIENDS,
  SELECT_CHAT,
  IS_CHAT_SELECTED,
  SHOW_CHATS,
} from "../types";

// Create auth context
export const ChatContext = createContext();
export const ChatState = (props) => {
  // Create initial state
  const initialState = {
    IsChatSelected: false,
    SelectedChat: {},
    chats: [],
    ShowChats: true,
  };
  const [state, dispatch] = useReducer(ChatReducer, initialState);

  // import Alert context
  const { SetAlert, ToggleLoading } = useContext(AlertContext);

  // get all friends from database
  const GetFriends = async () => {
    try {
      // Set loading: true
      ToggleLoading(true);

      // set token to headers
      axios.defaults.headers.common["token"] = localStorage.token;

      // make request to backend
      const res = await axios.get("user/friends");

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
  const SelectChat = (chat) => {
    chat.newMessageCounter = 0;
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

  return (
    <ChatContext.Provider
      value={{
        GetFriends,
        SelectChat,
        SetSelectChat,
        SetShowChats,
        ShowChats: state.ShowChats,
        chats: state.chats,
        SelectedChat: state.SelectedChat,
        IsChatSelected: state.IsChatSelected,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
