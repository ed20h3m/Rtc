import React, { useEffect, useContext, useState, Fragment } from "react";
import "./ResetPassword.scss";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Auth/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";

const ResetPassword = () => {
  const { id, token } = useParams();
  const { ValidateToken, ResetPasswordFuc } = useContext(AuthContext);
  const { isLoading, SetAlert } = useContext(AlertContext);
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
    <div className="con">
      <div className="reset-password">
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <header>
              <h2>Reset Password</h2>
            </header>
            <main>
              <h3>Enter New password</h3>
              <Input
                placeholder="Enter New Password"
                name="Password"
                onChange={OnInput}
              />
              <Input
                placeholder="Confirm Password"
                name="Password2"
                onChange={OnInput}
              />
            </main>
            <footer>
              <Button name="Rest Password" event={OnClick} />
            </footer>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
