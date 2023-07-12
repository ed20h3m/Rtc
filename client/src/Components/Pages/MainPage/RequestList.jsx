import React, { useContext } from "react";
import "./RequestList.scss";
import RequestItem from "./RequestItem";
import { AuthContext } from "../../../context/Auth/AuthState";
import CloseIcon from "@mui/icons-material/Close";
import { AlertContext } from "../../../context/Alert/Alert";

const RequestList = () => {
  const { ToggleReqList, ShowReqList, ToggleOverlay } =
    useContext(AlertContext);

  const OnClose = () => {
    ToggleOverlay(!ShowReqList);
    ToggleReqList(!ShowReqList);
  };
  const { user } = useContext(AuthContext);
  return (
    <div className="req-list">
      <header>
        <CloseIcon className="close" onClick={OnClose} />
        <h2>Friend Requests</h2>
      </header>
      <main>
        <div className="scroll">
          {user.Requested_Friends.length > 0 &&
            user.Requested_Friends.map((friend, id) => (
              <RequestItem friend={friend} key={id} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default RequestList;
