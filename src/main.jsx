import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./contexts/AuthContext.jsx";
import { CargaProvider } from "./contexts/LoadContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProviderWrapper>
        <CargaProvider>
          <App />
        </CargaProvider>
      </AuthProviderWrapper>
    </Router>
  </StrictMode>
);
