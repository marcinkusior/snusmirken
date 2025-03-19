import "./NiceButton.css";

export const NiceButton = ({
  text,
  highlight,
  onClick,
  fontSize,
}: {
  text: string;
  highlight: boolean;
  onClick: () => void;
  fontSize?: string;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`pushable text-md ${highlight ? "niceButton--active" : ""}`}
      style={{ fontSize }}
    >
      {/* <span className="shadow"></span> */}
      <span className="edge"></span>
      <span className="front"> {text} </span>
    </button>
  );
};
