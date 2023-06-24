import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Alert = ({ Alerts }) => {
  return (
    <div className="alerts">
      {Alerts.map((alert, idx) => (
        <div key={idx}>
          <h2>{alert.message}</h2>
          <ErrorOutlineIcon
            sx={{
              fontSize: "2rem",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Alert;
