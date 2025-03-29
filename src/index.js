import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./core/About.js";
import GameApp from "./core/GameApp";
import GameUtils from './core/utils/GameUtils';

const router = createBrowserRouter([
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <GameApp gameName = {GameUtils.GAME_NAME.CANNON}/>,
  },
  {
    path: "/abalone",
    element: <GameApp gameName = {GameUtils.GAME_NAME.ABALONE}/>,
  }
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);