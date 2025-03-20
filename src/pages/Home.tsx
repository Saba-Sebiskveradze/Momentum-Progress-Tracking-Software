import { useState } from "react";
import ChosenFilters from "../components/filter/ChosenFilters";
import Filters from "../components/filter/Filters";
import Header from "../components/header/Header";
import Statuses from "../components/tasksection/Statuses";
import TaskList from "../components/tasksection/Tasklist";
import EmployeeModal from "../components/EmployeeModal";

const Home = () => {
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
        <div className="mt-[40px] ml-[120px] firaGO-font text-[34px] font-[600] text-GreyShades">
          დავალებების გვერდი
        </div>
        <Filters />
        <ChosenFilters />
        <Statuses />
        <TaskList />
      </div>
      

      {isModalOpen && <EmployeeModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default Home;