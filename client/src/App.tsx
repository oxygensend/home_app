import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Router } from "react-router";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import {Login} from "./pages/login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<Login />}>
      <Route path={"dashboard"} element={<Dashboard />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
