import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocecketContextProvider } from "./context/socketContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/Real-Time-Chat-App/">
    <AuthContextProvider>
      <SocecketContextProvider>
        <App />
      </SocecketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
