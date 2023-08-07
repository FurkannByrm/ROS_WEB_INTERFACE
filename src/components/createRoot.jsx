import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App"; // App bileşenini içe aktardığınız dosyanın yolunu belirtin

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);

