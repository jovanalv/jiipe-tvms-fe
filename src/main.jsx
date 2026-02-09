import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { BrowserRouter } from "react-router-dom";
import { persistor } from "./store/store.jsx";
import ConsoleWarning from "./components/env/ConsoleWarning.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConsoleWarning />
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
