import React, { Fragment, useContext, useEffect, useState } from "react";
import "./UserCard.scss";
import Button from "../../utils/Button/Button";
import { SocketContext } from "../../../context/Handler/EventHandler";
import { ChatContext } from "../../../context/Chat/ChatState";
import { AuthContext } from "../../../context/Auth/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";

const UserCard = ({ Username, image = null, _id }) => {
  const { ConnectedUsers } = useContext(SocketContext);
  const {
    SendFriendRequest,
    CancelRequest,
    HandleRequest,
    RemoveFriendSearch,
  } = useContext(ChatContext);
  const { RequestLoading } = useContext(AlertContext);

  const [isFriend, setisFriend] = useState(false);
  const [sent, setSent] = useState(false);
  const [Requested, setRequested] = useState(false);
  const { user } = useContext(AuthContext);

  const onFriend = () => {
    SendFriendRequest(Username);
    setisFriend(false);
    setRequested(true);
    setSent(true);
  };

  const cancel = () => {
    setisFriend(false);
    setRequested(false);
    setSent(false);
    CancelRequest(Username);
  };

  const Accept = () => {
    HandleRequest({ Username, Request: true });
    setisFriend(true);
    setRequested(false);
  };

  const Reject = () => {
    HandleRequest({ Username, Request: false, Cancel: false });
    setisFriend(false);
    setRequested(false);
  };

  const Remove = () => {
    RemoveFriendSearch(Username);
    setisFriend(false);
    setRequested(false);
  };

  useEffect(() => {
    ConnectedUsers.forEach((chat) => {
      if (chat.username === Username) setisFriend(true);
    });
    user.Requested_Friends.forEach((chat) => {
      if (chat.id === _id) {
        setRequested(true);
        if (chat.DidYouSend) setSent(true);
        else setSent(false);
      }
    });
    //eslint-disable-next-line
  }, []);
  return (
    <div className="user-card">
      <img
        className="img"
        src="https://www.syracuse.com/resizer/LjTbKFiHmJSEJyboi68vnEYh40U=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/EAACMW43EZAVNDPNCAV26JZAFI.jpg"
        alt=""
      />
      <h2>{Username}</h2>
      {RequestLoading ? (
        <div className="con-img">
          <Loading />
        </div>
      ) : (
        <Fragment>
          {(() => {
            if (isFriend) {
              return <Button name="Remove" className="btn" event={Remove} />;
            } else if (Requested) {
              if (sent) {
                return (
                  <Button
                    name="Cancel Request"
                    className="btn"
                    event={cancel}
                  />
                );
              } else {
                return (
                  <div className="btns">
                    <Button name="Accept" className="btn" event={Accept} />
                    <Button name="Reject" className="btn" event={Reject} />
                  </div>
                );
              }
            } else {
              return (
                Username !== localStorage.getItem("username") && (
                  <Button name="Add" className="btn" event={onFriend} />
                )
              );
            }
          })()}
          {/* {isFriend ? (
            <Button name="Remove" className="btn" />
          ) : Requested ? (
            <Button
              name={sent ? "Cancel Request" : "Accept"}
              className="btn"
              event={sent ? cancel : Accept}
            />
          ) : (
            Username !== localStorage.getItem("username") && (
              <Button name="Add" className="btn" event={onFriend} />
            )
          )} */}
        </Fragment>
      )}
    </div>
  );
};

export default UserCard;
