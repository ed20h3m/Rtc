import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AlertContext } from "./context/Alert/Alert";
import { AuthState } from "./context/Auth/AuthState";
// import components
import Alert from "./Components/utils/Alert";
import LoginPage from "./Components/Pages/LoginPage/LoginPage";
import MainPage from "./Components/Pages/MainPage/MainPage";

const App = () => {
  const { Alerts } = useContext(AlertContext);
  return (
    <BrowserRouter>
      <Alert Alerts={Alerts} />
      <AuthState>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chats" element={<MainPage />} />
        </Routes>
      </AuthState>
    </BrowserRouter>
  );
};

export default App;
