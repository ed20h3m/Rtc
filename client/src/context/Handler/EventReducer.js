import {
  SET_CONNECTED_USERS,
  ADD_CONNECTED_USER,
  REMOVE_CONNECTED_USER,
  SEND_MESSAGE,
} from "../types";
const EventReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_CONNECTED_USERS: {
      return {
        ...state,
        ConnectedUsers: action.payload,
      };
    }
    case ADD_CONNECTED_USER: {
      return {
        ...state,
        ConnectedUsers: [...state.ConnectedUsers, action.payload],
      };
    }
    case REMOVE_CONNECTED_USER: {
      return {
        ...state,
        ConnectedUsers: state.ConnectedUsers.filter(
          (user) => user.userID !== action.payload
        ),
      };
    }
    case SEND_MESSAGE: {
      return {
        ...state,
        ConnectedUsers: action.payload,
      };
    }
  }
};
export default EventReducer;
