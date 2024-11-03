import { BrowserRouter, Route, Routes } from "react-router-dom";
import routers from "./routers.tsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((route) => {
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
