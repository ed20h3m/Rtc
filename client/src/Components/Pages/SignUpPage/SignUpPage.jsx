import React, { Fragment, useContext, useState } from "react";
import Card from "../../utils/Card/Card";
import Input from "../../utils/Input/Input";
import PasswordInput from "../../utils/Input/PasswordInput";
import ProfileImage from "../../utils/ProfileImage/ProfileImage";
import Button from "../../utils/Button/Button";
import { AuthContext } from "../../../context/Auth/AuthState";
import Loading from "../../utils/Loading";
import "../../utils/utils.scss";
import { AlertContext } from "../../../context/Alert/Alert";

const LoginPage = () => {
  const { SignUp } = useContext(AuthContext);
  const { isLoading } = useContext(AlertContext);
  const [state, setState] = useState();
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const submit = () => {
    SignUp(state);
  };
  return (
    <div className="container">
      <div className="center-div-ver">
        <Card>
          {isLoading ? (
            <Loading />
          ) : (
            <Fragment>
              <h1>Sign Up</h1>
              <ProfileImage />
              <div className="center-div-abs vertical-div width100">
                <Input placeholder="Name" onChange={onChange} name="Name" />
                <Input placeholder="Email" onChange={onChange} name="Email" />
                <Input
                  placeholder="Username"
                  onChange={onChange}
                  name="Username"
                />
                <PasswordInput
                  placeholder="Enter Password"
                  onChange={onChange}
                  type="password"
                  name="Password"
                  showFilter={true}
                />
              </div>
              <a href="/">Login</a>
              <Button event={submit} name="Sign Up" />
            </Fragment>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
