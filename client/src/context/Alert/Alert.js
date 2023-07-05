import { createContext, useReducer } from "react";
import {
  SET_ALERT,
  REMOVE_ALERT,
  TOGGLE_LOADING,
  TOGGLE_MESSAGES_LOADING,
  SHOW_CHAT_SETTINGS,
  SHOW_OVERLAY,
  TOGGLE_SETTINGS_LOADING,
  TOGGLE_PROFILE,
  SET_SEARCH_LOADING,
  SET_REQ_LOADING,
} from "../types";
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
    case TOGGLE_MESSAGES_LOADING: {
      return {
        ...state,
        MessagesLoading: action.payload,
      };
    }
    case SET_REQ_LOADING: {
      return {
        ...state,
        RequestLoading: action.payload,
      };
    }
    case SHOW_CHAT_SETTINGS: {
      return {
        ...state,
        ShowChatSettings: action.payload,
      };
    }
    case SHOW_OVERLAY: {
      return {
        ...state,
        ShowOverlay: action.payload,
      };
    }
    case TOGGLE_PROFILE: {
      return {
        ...state,
        ShowProfile: action.payload,
      };
    }
    case SET_SEARCH_LOADING: {
      return {
        ...state,
        SearchLoading: action.payload,
      };
    }
    case TOGGLE_SETTINGS_LOADING: {
      return {
        ...state,
        isSettingsLoading: action.payload,
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
    isSettingsLoading: false,
    MessagesLoading: false,
    ShowChatSettings: false,
    ShowOverlay: false,
    ShowProfile: false,
    SearchLoading: false,
    RequestLoading: false,
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
  const ToggleSettingsLoading = (load) => {
    dispatch({
      type: TOGGLE_SETTINGS_LOADING,
      payload: load,
    });
  };
  const ToggleLoading = (load) => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: load,
    });
  };
  const ToggleMessagesLoading = (option) => {
    dispatch({
      type: TOGGLE_MESSAGES_LOADING,
      payload: option,
    });
  };
  const ToggleChatSettings = (option) => {
    dispatch({
      type: SHOW_CHAT_SETTINGS,
      payload: option,
    });
  };
  const ToggleProfile = (option) => {
    dispatch({
      type: TOGGLE_PROFILE,
      payload: option,
    });
  };
  const ToggleOverlay = (option) => {
    dispatch({
      type: SHOW_OVERLAY,
      payload: option,
    });
    if (!option) {
      ToggleChatSettings(false);
    }
  };
  const ToggleSearchLoading = (option) => {
    dispatch({
      type: SET_SEARCH_LOADING,
      payload: option,
    });
  };
  const ToggleReqLoading = (option) => {
    dispatch({
      type: SET_REQ_LOADING,
      payload: option,
    });
  };
  return (
    <AlertContext.Provider
      value={{
        SetAlert,
        ToggleLoading,
        ToggleMessagesLoading,
        ToggleChatSettings,
        ToggleOverlay,
        ToggleSettingsLoading,
        ToggleProfile,
        ToggleSearchLoading,
        ToggleReqLoading,
        Alerts: state.Alerts,
        isLoading: state.isLoading,
        MessagesLoading: state.MessagesLoading,
        ShowChatSettings: state.ShowChatSettings,
        ShowOverlay: state.ShowOverlay,
        isSettingsLoading: state.isSettingsLoading,
        SearchLoading: state.SearchLoading,
        RequestLoading: state.RequestLoading,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};
