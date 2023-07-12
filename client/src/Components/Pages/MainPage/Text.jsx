import React from "react";

const Text = ({ text }) => {
  const from = text.from === localStorage.getItem("username") ? "me" : "client";
  return (
    <div className={`newMessage ${from}`}>
      <div>
        <h3 className="top">{text.Message}</h3>
        <p className="bottom">{text.timeStamp}</p>
      </div>
    </div>
  );
};

export default Text;
