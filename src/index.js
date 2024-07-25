import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./core/About.js";
import GameApp from "./core/GameApp";

const router = createBrowserRouter([
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <GameApp />,
  }
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);