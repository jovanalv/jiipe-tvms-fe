import "./Loader.scss";

export default function Loader({ screen }) {
  return (
    <div className={`loader-container ${screen ? "min-h-[80vh]" : ""}`}>
      <div className="loader"></div>
      <p className="font-medium text-gray-400 mt-[7px] text-xs">Loading...</p>
    </div>
  );
}
