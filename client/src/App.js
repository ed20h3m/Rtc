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
// import components
import Alert from "./Components/utils/Alert";
import LoginPage from "./Components/Pages/LoginPage/LoginPage";
import SignUpPag from "./Components/Pages/SignUpPage/SignUpPage";
import MainPage from "./Components/Pages/MainPage/MainPage";
import { ChatContext } from "./context/Chat/ChatState";
import Overlay from "./Components/utils/Overlay";
import SearchFriends from "./Components/Pages/SearchFriends";

const App = () => {
  const { SetShowChats, IsChatSelected } = useContext(ChatContext);
  const [width] = useWindowSize();

  useEffect(() => {
    if (width <= 700 && IsChatSelected) {
      SetShowChats(false);
    } else SetShowChats(true);
  }, [width]);

  const { Alerts, ShowOverlay } = useContext(AlertContext);
  return (
    <Fragment>
      {ShowOverlay && <Overlay />}
      <Alert Alerts={Alerts} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPag />} />
        <Route path="/chats" element={<MainPage />} />
        <Route path="/friends" element={<SearchFriends />} />
      </Routes>
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
