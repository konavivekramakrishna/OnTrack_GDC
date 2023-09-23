import HashLoader from "react-spinners/HashLoader";

export default function CenteredLoader() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="sweet-loading">
        <HashLoader
          color={"#111111"}
          loading={true}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}
