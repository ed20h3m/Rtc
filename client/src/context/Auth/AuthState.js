import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import AuthReducer from "./AuthReducer";
import { AlertContext } from "../Alert/Alert";
import { useNavigate } from "react-router-dom";

// import types
import { SET_USER } from "../types";

// import schemas
import { UserLoginSchema, UserSchema } from "../Schemas/User";
import { socket } from "../Handler/Socket";
import { SocketContext } from "../Handler/EventHandler";

// Create auth context
export const AuthContext = createContext();

export const AuthState = (props) => {
  // Create initial state
  const initialState = {
    user: {},
  };
  // create empty state
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const { AddUser } = useContext(SocketContext);
  useEffect(() => {
    socket.on("friend request alert", ({ from, sending }) => {
      PopUser(from.username);
      if (sending) {
        SetAlert(`Friend Request from ${from.username}`);
        const obj = {
          id: from.Id,
          Username: from.username,
          DidYouSend: false,
        };
        state.user.Requested_Friends = [...state.user.Requested_Friends, obj];
      } else {
        const filteredItems = state.user.Requested_Friends.filter(
          (user) => user.Username !== from.username
        );
        state.user.Requested_Friends = [...filteredItems];
      }
      dispatch({ type: SET_USER, payload: state.user });
    });
    socket.on("friend request accepted", (user) => {
      SetAlert(`${user.username} Accepted Your Friend Request`);
      PopUser(user.username);
      AddUser(user);
    });
    socket.on("friend request rejected", ({ username }) => {
      PopUser(username);
    });
    return () => {
      socket.off("friend request rejected");
      socket.off("friend request alert");
      socket.off("friend request accepted");
    };
    //eslint-disable-next-line
  }, [state.user]);
  // import Alert context
  const { SetAlert, ToggleLoading } = useContext(AlertContext);
  const nav = useNavigate();

  // user login
  const Login = async (User = null) => {
    // Check if Use object is not null - should return and error
    if (!User) return SetAlert("No Information Found");

    // Validate syntax before backend request
    const { error } = UserLoginSchema.validate(User);
    if (error) return SetAlert(error.details[0].message.replace(/"/g, ""));

    // Request Backend
    try {
      ToggleLoading(true);
      // Make request to backend
      const res = await axios.post("/user/login", { User });
      // If login is successful store token
      localStorage.setItem("token", res.data.Token);
      // if logged in: redirect to chats page
      if (res.data.Token) {
        localStorage.setItem("username", User.EmailUsername);
        // redirect to chats page
        nav("/chats");
      }
    } catch ({ response }) {
      SetAlert(response.data.message);
      // console.log(error);
    }
    ToggleLoading(false);
  };
  // get user details
  const GetUser = async () => {
    try {
      // ToggleLoading(true);
      axios.defaults.headers.common["token"] = localStorage.token;
      // Make request to backend
      const res = await axios.get("/user");
      // store user details

      localStorage.setItem("_id", res.data.user._id);
      dispatch({ type: SET_USER, payload: res.data.user });
    } catch ({ response }) {
      // show alert if there is error
      SetAlert(response.data.message);
    }
    // ToggleLoading(false);
  };
  // user log out
  const LogOut = () => {
    // Remove token from local storage
    localStorage.clear();
    // localStorage.removeItem("token");
    // redirect to login page
    nav("/");
    window.location.reload();
  };

  const SignUp = async (User) => {
    // Check if user object is != null
    if (!User) return SetAlert("No Information Found");

    // Add verified attribute
    User.Verified = false;

    // Validate syntax before backend request
    const { error } = UserSchema.validate(User);
    if (error) return SetAlert(error.details[0].message.replace(/"/g, ""));

    try {
      ToggleLoading(true);
      const res = await axios.post("/user", { User });
      SetAlert(res.data.message);
    } catch ({ response }) {
      SetAlert(response.data.message);
    }
    ToggleLoading(false);
  };

  const PopUser = (username) => {
    const filteredItems = state.user.Requested_Friends.filter(
      (user) => user.Username !== username
    );
    state.user.Requested_Friends = [...filteredItems];
    dispatch({ type: SET_USER, payload: state.user });
  };
  return (
    <AuthContext.Provider
      value={{
        Login,
        GetUser,
        LogOut,
        SignUp,
        PopUser,
        user: state.user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
