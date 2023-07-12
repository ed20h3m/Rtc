import React, { useContext, useState } from "react";
import "./Friends.scss";
import UserCard from "./UserCard";
import { ChatContext } from "../../../context/Chat/ChatState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";
import { AuthContext } from "../../../context/Auth/AuthState";
import "../../utils/utils.scss";

const Friends = () => {
  const { Search, SearchFriends } = useContext(ChatContext);
  const { SearchLoading } = useContext(AlertContext);
  const { GetUser } = useContext(AuthContext);
  const [text, setText] = useState("");
  const onChange = (e) => {
    Search(e.target.value.trim());
    setText(e.target.value.trim());
    GetUser();
  };
  return (
    <div className="friends">
      <header>
        <input placeholder="Search For Friends" onChange={onChange} />
      </header>
      <div className="main-con">
        {SearchLoading ? (
          <div className="loading-con">
            <Loading />
          </div>
        ) : SearchFriends.length > 0 ? (
          <main>
            {SearchFriends.map((friend, id) => (
              <UserCard Username={friend.Username} key={id} _id={friend._id} />
            ))}
          </main>
        ) : text.length > 0 ? (
          <div className="center">
            <h1>No Match Found</h1>
          </div>
        ) : (
          <div className="center">
            <h1>🙂</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
