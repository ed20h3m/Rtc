import { createContext, useReducer } from "react";
import { SET_ALERT, REMOVE_ALERT, TOGGLE_LOADING } from "../types";
import { v4 as uuid } from "uuid";
export const AlertContext = createContext();

const AlertReducer = (state, action) => {
  switch (action.type) {
    default:
      return { ...state };
    case SET_ALERT: {
      const doesExists = state.Alerts.filter(
        (item) => item.message === action.payload.message
      );
      if (doesExists.length > 0) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          Alerts: [...state.Alerts, action.payload],
        };
      }
    }
    case TOGGLE_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case REMOVE_ALERT: {
      return {
        ...state,
        Alerts: state.Alerts.filter((element) => element.id !== action.payload),
      };
    }
  }
};

export const AlertState = (props) => {
  // Set initial state
  const initialState = {
    Alerts: [],
    isLoading: false,
  };

  // create a reducer and a state
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  const SetAlert = (message, type = "warning") => {
    const id = uuid();
    dispatch({ type: SET_ALERT, payload: { message, type, id } });
    setTimeout(() => RemoveAlert(id), 3000);
  };
  const RemoveAlert = (id) => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  };
  const ToggleLoading = (load) => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: load,
    });
  };
  return (
    <AlertContext.Provider
      value={{
        SetAlert,
        ToggleLoading,
        Alerts: state.Alerts,
        isLoading: state.isLoading,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
