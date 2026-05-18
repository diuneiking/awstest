import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading backend...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Could not connect to backend"));
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Frontend: Updated from local VS Code.</h1>
      <h2>Backend: {message}</h2>
    </div>
  );
}

export default App;