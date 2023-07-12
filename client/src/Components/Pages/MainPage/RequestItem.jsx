import React, { Fragment, useContext } from "react";
import "./RequestList.scss";
import "../../utils/utils.scss";
import { ChatContext } from "../../../context/Chat/ChatState";
import { AuthContext } from "../../../context/Auth/AuthState";

const RequestItem = ({ friend }) => {
  const { CancelRequest, HandleRequest } = useContext(ChatContext);
  const { PopUser } = useContext(AuthContext);

  const OnAccept = () => {
    PopUser(friend.Username);
    HandleRequest({ Username: friend.Username, Request: true });
  };
  const OnReject = () => {
    PopUser(friend.Username);
    HandleRequest({ Username: friend.Username, Request: false, Cancel: false });
  };
  const OnCancel = () => {
    PopUser(friend.Username);
    CancelRequest(friend.Username);
  };

  return (
    <div className="req-item">
      <h2>{friend.Username}</h2>
      <div>
        {!friend.DidYouSend ? (
          <Fragment>
            <button className="acc" onClick={OnAccept}>
              Accept
            </button>
            <button className="rej" onClick={OnReject}>
              Reject
            </button>
          </Fragment>
        ) : (
          <button className="rej" onClick={OnCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestItem;
