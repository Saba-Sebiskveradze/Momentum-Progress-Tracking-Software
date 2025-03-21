import { useState } from "react";
import Header from "../components/header/Header";
import EmployeeModal from "../components/EmployeeModal";
import TaskInformation from "../components/taskpage/TaskInformation";
import Comments from "../components/taskpage/Comments";

const TaskPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const blurStyle = isModalOpen ? { filter: "blur(5px)" } : {};

  return (
    <div className="relative w-[1920px] h-[1080px]">
      <div style={blurStyle}>
        <Header openModal={openModal} />
        <TaskInformation />
        <Comments />
      </div>
      {isModalOpen && (
        <EmployeeModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default TaskPage;
