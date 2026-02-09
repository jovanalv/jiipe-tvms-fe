import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { appRoutes } from "./routes/appRoutes";

function App() {
  const routing = useRoutes(appRoutes);

  return (
    <>
      <ToastContainer />
      {routing}
    </>
  );
}

export default App;
