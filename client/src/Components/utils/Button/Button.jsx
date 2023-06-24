import React from "react";
import "./Button.scss";

const Button = ({ name, event }) => {
  const onClick = (e) => {
    event();
    e.preventDefault();
  };
  return (
    <button className="button" onClick={onClick}>
      {name}
    </button>
  );
};

export default Button;
