import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/Auth/AuthState";
import ProfileImage from "../../utils/ProfileImage/ProfileImage";
import Button from "../../utils/Button/Button";
import Input from "../../utils/Input/Input";
import Card from "../../utils/Card/Card";
import "../ResetPassword/ResetPassword.scss";
import "../../utils/utils.scss";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const { ForgottenPassword } = useContext(AuthContext);
  const OnChange = (e) => setEmail(e.target.value);
  const OnSend = () => {
    if (email === "") return;
    ForgottenPassword(email);
  };

  return (
    <div className="center-con-column full-height-width">
      <Card>
        <h1>Forgotten Password ?</h1>
        <ProfileImage link="https://cdn-icons-png.flaticon.com/512/1803/1803612.png" />
        <div className="center-div-abs vertical-div width100">
          <Input placeholder="Enter Email" onChange={OnChange} name="Email" />
        </div>
        <a href="/">Login</a>
        <Button name="Send Link" event={OnSend} />
      </Card>
    </div>
  );
};

export default ForgetPassword;
