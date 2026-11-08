import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import GlobalStyles from "./styles/GlobelStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import store from "./store/store";
import AuthInitializer from "./componets/auth/AuthInitializer";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalStyles />
      <AuthInitializer>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AuthInitializer>
    </BrowserRouter>
  </Provider>
);
