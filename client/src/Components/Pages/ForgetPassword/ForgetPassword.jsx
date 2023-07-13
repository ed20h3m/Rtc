import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/Auth/AuthState";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import "../ResetPassword/ResetPassword.scss";
import "../../utils/utils.scss";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const { ForgottenPassword } = useContext(AuthContext);
  const { isLoading } = useContext(AlertContext);
  const OnChange = (e) => setEmail(e.target.value);
  const OnSend = () => {
    if (email === "") return;
    ForgottenPassword(email);
  };
  return (
    <div className="con">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="reset-password">
          <header>
            <h2>Forgotten Password</h2>
          </header>
          <main>
            <p>
              Enter the email associated with your account. We will send you an
              email to reset your password.
            </p>
            <Input placeholder="Enter Your Email" onChange={OnChange} />
          </main>
          <footer>
            <Button event={OnSend} name="Send Link" />
          </footer>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
