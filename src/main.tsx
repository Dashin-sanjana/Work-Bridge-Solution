import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { MotionConfig } from "framer-motion";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user"><App /></MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);

if (root.hasChildNodes() && root.querySelector("main")) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
