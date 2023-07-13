import React, { useContext, useState, Fragment } from "react";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import { AuthContext } from "../../../context/Auth/AuthState";
import Card from "../../utils/Card/Card";
import PasswordInput from "../../utils/Input/PasswordInput";
import Loading from "../../utils/Loading";
import { AlertContext } from "../../../context/Alert/Alert";
import "../../utils/utils.scss";

const SignUpCard = () => {
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
    <Card>
      {isLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <h1>Sign Up</h1>
          <div className="center-div-abs vertical-div width100 mgt-2rem">
            <Input placeholder="Name" onChange={onChange} name="Name" />
            <Input placeholder="Email" onChange={onChange} name="Email" />
            <Input placeholder="Username" onChange={onChange} name="Username" />
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
  );
};

export default SignUpCard;
