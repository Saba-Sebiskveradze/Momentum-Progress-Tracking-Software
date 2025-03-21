import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import TaskPage from "./pages/TaskPage";
import CreateTaskPage from "./pages/CreateTaskPage";


function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taskpage/:taskId" element={<TaskPage />} />
        <Route path="/createtaskpage" element={<CreateTaskPage />} />

      </Routes>
  );
}

export default App;