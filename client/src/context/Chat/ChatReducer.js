import {
  SET_FRIENDS,
  SELECT_CHAT,
  IS_CHAT_SELECTED,
  SHOW_CHATS,
  SET_SEARCH,
} from "../types";
const AlertReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_FRIENDS: {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case IS_CHAT_SELECTED: {
      return {
        ...state,
        IsChatSelected: action.payload,
      };
    }
    case SELECT_CHAT: {
      return {
        ...state,
        SelectedChat: action.payload,
      };
    }
    case SHOW_CHATS: {
      return {
        ...state,
        ShowChats: action.payload,
      };
    }
    case SET_SEARCH: {
      return {
        ...state,
        SearchFriends: action.payload,
      };
    }
  }
};
export default AlertReducer;
