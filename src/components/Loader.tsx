import React, { useState, CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#111111");

  return (
    <div className="sweet-loading">
      <HashLoader
        color={color}
        loading={loading}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
