import momentum from "../../assets/img/Momentum.svg";
import HourGlass from "../../assets/img/Hourglass.svg";
import CreateEmployee from "./CreateEmployee";
import CreateNewTask from "./CreateNewTask";
import { Link } from "react-router";

type HeaderProps = {
  openModal: () => void;
};

const Header = ({ openModal }: HeaderProps) => {
  return (
    <div className="h-[100px] py-[30px] px-[120px] flex justify-between">
      <div className="flex gap-[4px]">
        <Link to={"/"}>
        <img src={momentum} alt="momentum" className="w-[168px] h-[38px]" />
        <img src={HourGlass} alt="HourGlass" className="w-[38px] h-[38px]" />
        </Link>
      </div>
      <div className="flex gap-[40px]">
        <CreateEmployee openModal={openModal} />
        <CreateNewTask />
      </div>
    </div>
  );
};

export default Header;