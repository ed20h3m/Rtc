import React from "react";
import "./Input.scss";

const Input = ({
  type = "text",
  placeholder = "",
  onChange,
  name,
  value = "",
}) => {
  return (
    <input
      name={name}
      className="input"
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      //value={value}
    ></input>
  );
};

export default Input;
