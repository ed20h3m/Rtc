import { SET_FRIENDS, SELECT_CHAT, IS_CHAT_SELECTED } from "../types";
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
  }
};
export default AlertReducer;
