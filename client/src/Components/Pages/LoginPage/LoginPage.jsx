import React, { useContext, useState } from "react";
import Card from "../../utils/Card/Card";
import Input from "../../utils/Input/Input";
import PasswordInput from "../../utils/Input/PasswordInput";
import ProfileImage from "../../utils/ProfileImage/ProfileImage";
import Button from "../../utils/Button/Button";
import { AuthContext } from "../../../context/Auth/AuthState";
import "../../utils/utils.scss";
import "./LoginPage.scss";

const LoginPage = () => {
  const { Login } = useContext(AuthContext);
  const [state, setState] = useState();
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return (
    <div className="container">
      <div className="center-div-ver">
        <Card>
          <h1>Log in</h1>
          <ProfileImage />
          <div className="center-div-abs vertical-div width100">
            <Input
              placeholder="Enter Username or Email"
              onChange={onChange}
              name="EmailUsername"
            />
            <PasswordInput
              placeholder="Enter Password"
              onChange={onChange}
              type="password"
              name="Password"
            />
          </div>
          <a href="/forgot-password">Forgotten Password?</a>
          <a href="/signup">Sign Up</a>
          <Button event={() => Login(state)} name="Log in" />
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
