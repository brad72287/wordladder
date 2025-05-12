import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add font-family styles
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'Inter', sans-serif;
  }
  .font-mono {
    font-family: 'Source Code Pro', monospace;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
