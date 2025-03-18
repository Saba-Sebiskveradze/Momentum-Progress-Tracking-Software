import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter as Router } from "react-router";
import App from "./App.tsx";
import { FilterProvider } from "../src/components/filter/context/FilterContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <FilterProvider>
      <App />
    </FilterProvider>
  </Router>
);
