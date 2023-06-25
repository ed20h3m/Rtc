import "./App.scss";
import { Routes, Route } from "react-router-dom";
import {
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  Fragment,
} from "react";
import { AlertContext } from "./context/Alert/Alert";
import { AuthState } from "./context/Auth/AuthState";
// import components
import Alert from "./Components/utils/Alert";
import LoginPage from "./Components/Pages/LoginPage/LoginPage";
import MainPage from "./Components/Pages/MainPage/MainPage";
import { ChatContext } from "./context/Chat/ChatState";

const App = () => {
  const { SetShowChats, ShowChats, IsChatSelected, SetSelectChat } =
    useContext(ChatContext);
  const [width] = useWindowSize();

  useEffect(() => {
    if (width <= 700 && IsChatSelected) {
      SetShowChats(false);
    } else SetShowChats(true);
    // console.log(width);
    // if (width <= 700) SetShowChats(false);
    // else SetShowChats(true);
  }, [width]);

  const { Alerts } = useContext(AlertContext);
  return (
    <Fragment>
      <Alert Alerts={Alerts} />
      <AuthState>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chats" element={<MainPage />} />
        </Routes>
      </AuthState>
    </Fragment>
  );
};

export default App;

// Resize Event listener
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};
