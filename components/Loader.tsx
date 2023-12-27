import { useEffect, useState } from "react";

const LoadingSpinner: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a delay for demonstration purposes (Replace this with your actual loading logic)
    const timeout = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false to hide the spinner
    }, 2000); // Simulated loading time: 2 seconds

    return () => clearTimeout(timeout); // Clear the timeout on unmount (cleanup)
  }, []);

  return (
    <div
      className={"spinner"}
      style={{ display: isLoading ? "block" : "none" }}
    >
      <div className={"spinnerInner"}></div>
    </div>
  );
};

export default LoadingSpinner;
