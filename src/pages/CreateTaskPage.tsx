import { useState } from "react";
import EmployeeModal from "../components/EmployeeModal";
import Header from "../components/header/Header";
import CreateTask from "../components/CreateTask";

const CreateTaskPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
      const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
      const blurStyle = isModalOpen ? { filter: 'blur(5px)' } : {};
  return (
    <div className="relative w-[1920px] h-[1080px]">
      <div style={blurStyle}>
        <Header openModal={openModal} />
        <h1 className="firaGo-font text-[600] text-[34px] text-[#212529] my-[40px] ml-[120px]">შექმენი ახალი დავალება</h1>
        <CreateTask />
      </div>
      {isModalOpen && (
        <EmployeeModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  )
}

export default CreateTaskPage