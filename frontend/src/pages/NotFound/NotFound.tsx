import { Link } from "react-router-dom";
import { useNotFoundLogic } from "./NotFoundLogic";

const NotFound = () => {
  const { state } = useNotFoundLogic();

  return (
    <div className="content-container">
      <div className="status-message">
        <span className="status-message__icon" aria-hidden="true">
          🥄
        </span>
        <h1 className="page-title">Page not found</h1>
        <p>
          There's nothing cooking at <code>{state.path}</code>.
        </p>
        <Link to="/" className="button button--small">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
