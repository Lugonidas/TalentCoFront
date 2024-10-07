import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import router from "./router";
import "./index.css";
import { ChatProvider } from "./context/ChatProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChatProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChatProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
