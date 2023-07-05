import React, { useContext } from "react";
import { AlertContext } from "../../context/Alert/Alert";
import "./utils.scss";

const Overlay = () => {
  const onClick = () => ToggleOverlay(false);
  const { ToggleOverlay } = useContext(AlertContext);
  return <div className="overlay" onClick={onClick}></div>;
};

export default Overlay;
