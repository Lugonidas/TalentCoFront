import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ChatProvider } from "./context/ChatProvider";
import { CourseProvider } from "./context/CourseProvider";
import { UserProvider } from "./context/UserProvider";
import { LeccionProvider } from "./context/LeccionProvider";
import { ArchivoProvider } from "./context/ArchivoProvider";
import router from "./router";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ComentarioProvider } from "./context/ComentarioProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChatProvider>
        <CourseProvider>
          <ComentarioProvider>
            <UserProvider>
              <LeccionProvider>
                <ArchivoProvider>
                  <RouterProvider router={router}></RouterProvider>
                </ArchivoProvider>
              </LeccionProvider>
            </UserProvider>
          </ComentarioProvider>
        </CourseProvider>
      </ChatProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
