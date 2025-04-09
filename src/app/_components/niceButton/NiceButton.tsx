import "./NiceButton.css";

export const NiceButton = ({
  text,
  highlight,
  onClick,
  fontSize,
  children,
  borderWidth = "1.4px",
}: {
  text: string;
  highlight: boolean;
  onClick: () => void;
  fontSize?: string;
  children?: React.ReactNode;
  borderWidth?: string;
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
      <span className="front" style={{ borderWidth }}>
        {children}
      </span>
    </button>
  );
};
