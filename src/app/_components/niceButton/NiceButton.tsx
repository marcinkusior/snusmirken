import "./NiceButton.css";

export const NiceButton = ({ text }: { text: string }) => {
  return (
    <button type="button" className="pushable">
      {/* <span className="shadow"></span> */}
      <span className="edge"></span>
      <span className="front"> {text} </span>
    </button>
  );
};
