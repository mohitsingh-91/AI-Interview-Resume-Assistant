import "./loader.scss"
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-wrap">
      <div className="loader-ring">
        <span className="ring-track" />
        <span className="ring-spin" />
      </div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;