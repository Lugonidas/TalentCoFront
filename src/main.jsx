import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ChatProvider } from "./context/ChatProvider";
import { CourseProvider } from "./context/CourseProvider";
import { UserProvider } from "./context/UserProvider";
import { LeccionProvider } from "./context/LeccionProvider";
import { ArchivoProvider } from "./context/ArchivoProvider";
import { ComentarioProvider } from "./context/ComentarioProvider";
import router from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* <ChatProvider> */}
        <CourseProvider>
          {/* <ComentarioProvider> */}
           {/*  <UserProvider> */}
              {/* <LeccionProvider> */}
                {/* <ArchivoProvider> */}
                  <RouterProvider router={router}></RouterProvider>
                {/* </ArchivoProvider> */}
              {/* </LeccionProvider> */}
           {/*  </UserProvider> */}
          {/* </ComentarioProvider> */}
        </CourseProvider>
      {/* </ChatProvider> */}
    </ErrorBoundary>
  </React.StrictMode>
);
