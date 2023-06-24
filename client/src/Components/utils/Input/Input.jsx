import React from "react";
import "./Input.scss";

const Input = ({ type = "text", placeholder = "", onChange, name }) => {
  return (
    <input
      name={name}
      className="input"
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    ></input>
  );
};

export default Input;
