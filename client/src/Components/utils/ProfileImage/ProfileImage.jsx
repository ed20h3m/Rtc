import React from "react";
import "./ProfileImage.scss";
import "../../utils/utils.scss";

const ProfileImage = ({
  link = "https://cdn.dribbble.com/users/361185/screenshots/3803404/media/1d9cbaab0e2aacf008c6b6524662183a.png?compress=1&resize=400x300&vertical=top",
}) => {
  return (
    <span className="profile-image center-div-abs">
      <img src={link} alt="" />
    </span>
  );
};

export default ProfileImage;
