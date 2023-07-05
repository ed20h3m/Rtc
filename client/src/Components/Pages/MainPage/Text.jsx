import React from "react";

const Text = ({ text }) => {
  const from = text.from === localStorage.getItem("username") ? "me" : "client";
  return (
    <div className={`newMessage ${from}`}>
      <div>{text.Message}</div>
    </div>
  );
};

export default Text;
