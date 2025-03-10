import "./NiceButton.css";

export const NiceButton = ({
  text,
  highlight,
  onClick,
}: {
  text: string;
  highlight: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`pushable ${highlight ? "niceButton--active" : ""}`}
    >
      {/* <span className="shadow"></span> */}
      <span className="edge"></span>
      <span className="front"> {text} </span>
    </button>
  );
};
