import React from "react";
import LoginCard from "./LoginCard";
import "../../utils/utils.scss";

const LoginPage = () => {
  return (
    <div className="root-con">
      <div className="max-width-con">
        <div className="center-con-column full-height-width">
          <LoginCard />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
