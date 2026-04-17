import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ModalContainer } from "./Components/molecules/ModalContainer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ModalProvider>
          <ModalContainer />
          <App />
        </ModalProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
