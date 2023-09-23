 
import HashLoader from "react-spinners/HashLoader";

export default function Loader() {
  return (
    <div className="sweet-loading">
      <HashLoader
        color={"#111111"}
        loading={true}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
