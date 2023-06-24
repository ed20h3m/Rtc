import { useContext, React } from "react";
import Loading from "../Loading";
import { AlertContext } from "../../../context/Alert/Alert";
import "../../utils/utils.scss";
import "./Card.scss";

const Card = ({ children }) => {
  const { isLoading } = useContext(AlertContext);
  return (
    <form className="card center-div-abs">
      {isLoading ? <Loading /> : children}
    </form>
  );
};

export default Card;
