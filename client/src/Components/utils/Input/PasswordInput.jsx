import React, { useState } from "react";
import "../../utils/utils.scss";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import "./Input.scss";

const Input = ({ placeholder = "", showFilter = false, name, onChange }) => {
  const [isShow, setShow] = useState(false);
  const [cond1, setcond1] = useState(false);
  const [cond2, setcond2] = useState(false);
  const [cond3, setcond3] = useState(false);
  const onChangePassword = (e) => {
    onChange(e);
    let counter = 0;
    const progressBar = document.getElementsByClassName("progress-bar");
    var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    var format2 = /[A-Z]+/;
    if (showFilter) {
      if (e.target.value !== "") {
        if (e.target.value.length > 8) {
          counter++;
          setcond1(true);
        } else setcond1(false);

        if (format.test(e.target.value)) {
          counter++;
          setcond2(true);
        } else setcond2(false);

        if (format2.test(e.target.value)) {
          counter++;
          setcond3(true);
        } else setcond3(false);

        if (counter === 0)
          progressBar[0].style.backgroundColor = "rgb(228, 64, 64)";
        else if (counter === 1) progressBar[0].style.backgroundColor = "orange";
        else if (counter === 2) progressBar[0].style.backgroundColor = "orange";
        else if (counter === 3)
          progressBar[0].style.backgroundColor = "rgb(52, 217, 96)";
        progressBar[0].style.width = 10 + counter * 30 + "%";
      } else {
        progressBar[0].style.width = "0%";
        setcond1(false);
        setcond2(false);
        setcond3(false);
      }
    }
  };
  const ToggleShow = () => setShow(!isShow);
  return (
    <div className="pass-con center-div-abs width100 vertical-div">
      <div className="width100 pass-con center-div-abs">
        <input
          name={name}
          // onChange={onChange}
          className="input"
          type={isShow ? "text" : "password"}
          placeholder={placeholder}
          onChange={onChangePassword}
        ></input>
        {!isShow ? (
          <VisibilityOffOutlinedIcon className="icon" onClick={ToggleShow} />
        ) : (
          <VisibilityOutlinedIcon className="icon" onClick={ToggleShow} />
        )}
      </div>
      {showFilter && (
        <span>
          <div className="progress-bar"></div>
          <span>
            {cond3 ? (
              <TaskAltRoundedIcon
                className="i"
                style={{ fill: "rgb(52, 217, 96)" }}
              />
            ) : (
              <ClearRoundedIcon
                className="i"
                style={{ fill: "rgb(228, 64, 64)" }}
              />
            )}
            <h4> Must contain a capital letter </h4>
          </span>
          <span>
            {cond2 ? (
              <TaskAltRoundedIcon
                className="i"
                style={{ fill: "rgb(52, 217, 96)" }}
              />
            ) : (
              <ClearRoundedIcon
                className="i"
                style={{ fill: "rgb(228, 64, 64)" }}
              />
            )}
            <h4>Must contain a special character </h4>
          </span>
          <span>
            {cond1 ? (
              <TaskAltRoundedIcon
                className="i"
                style={{ fill: "rgb(52, 217, 96)" }}
              />
            ) : (
              <ClearRoundedIcon
                className="i"
                style={{ fill: "rgb(228, 64, 64)" }}
              />
            )}
            <h4>Length must be 8 or more</h4>
          </span>
        </span>
      )}
    </div>
  );
};

export default Input;
