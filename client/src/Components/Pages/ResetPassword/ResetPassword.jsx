import React, { useEffect, useContext, useState } from "react";
import "./ResetPassword.scss";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Auth/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Card from "../../utils/Card/Card";
import ProfileImage from "../../utils/ProfileImage/ProfileImage";

const ResetPassword = () => {
  const { id, token } = useParams();
  const { ValidateToken, ResetPasswordFuc } = useContext(AuthContext);
  const { SetAlert } = useContext(AlertContext);
  const [state, setState] = useState({
    Password: "",
    Password2: "",
  });
  const OnInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const nav = useNavigate();
  useEffect(() => {
    (async () => {
      const isValid = await ValidateToken({ id, token });
      if (!isValid) {
        setTimeout(() => {
          nav("/");
        }, 1200);
      }
    })();
    //eslint-disable-next-line
  }, []);
  const OnClick = () => {
    if (state.Password === state.Password2) {
      ResetPasswordFuc({ id, token, Password: state.Password });
    } else SetAlert("Passwords do not Match.");
  };
  return (
    <div className="center-con-column full-height-width">
      <Card>
        <h1>Reset Password</h1>
        <ProfileImage link="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Eo_circle_light-blue_checkmark.svg/640px-Eo_circle_light-blue_checkmark.svg.png"/>
        <div className="center-div-abs vertical-div width100">
          <Input
            placeholder="Enter New Password"
            onChange={OnInput}
            name="Password"
          />
          <Input
            placeholder="Confirm New Password"
            onChange={OnInput}
            name="Password2"
          />
        </div>
        <Button name="Reset Password" event={OnClick} />
      </Card>
    </div>
  );
};

export default ResetPassword;
