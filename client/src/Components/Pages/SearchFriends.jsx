import React from "react";
import Friends from "./MainPage/Friends";
import "../utils/utils.scss";

const SearchFriends = () => {
  return (
    <div className="container-fixed">
      <div className="main-page">
        <Friends />
      </div>
    </div>
  );
};

export default SearchFriends;
