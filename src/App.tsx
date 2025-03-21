import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import TaskPage from "./pages/TaskPage";


function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taskpage/:taskId" element={<TaskPage />} />

      </Routes>
  );
}

export default App;