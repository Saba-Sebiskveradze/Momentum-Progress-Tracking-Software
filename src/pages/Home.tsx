import ChosenFilters from "../components/filter/ChosenFilters";
import Filters from "../components/filter/Filters";
import Header from "../components/header/Header";
import Statuses from "../components/tasksection/Statuses";
import TaskList from "../components/tasksection/Tasklist";

const Home = () => {
  return (
    <div className="w-[1920px] h-[1080px] ">
      <Header />
      <div className="mt-[40px] ml-[120px] firaGO-font text-[34px] font-[600] text-GreyShades">
      დავალებების გვერდი
      </div>
      <Filters />
      <ChosenFilters/>
      <Statuses />
      <TaskList/>
    </div>
  );
};

export default Home;
