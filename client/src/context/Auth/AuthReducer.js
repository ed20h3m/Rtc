import { SET_USER } from "../types";
const AlertReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
  }
};
export default AlertReducer;
