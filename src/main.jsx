import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { CourseProvider } from "./context/CourseProvider";
import router from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* <CourseProvider> */}
        <RouterProvider router={router}></RouterProvider>
      {/* </CourseProvider> */}
    </ErrorBoundary>
  </React.StrictMode>
);
