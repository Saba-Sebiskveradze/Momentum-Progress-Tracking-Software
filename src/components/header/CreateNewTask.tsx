import { Link } from "react-router";
import add from "../../assets/img/add.svg";
const CreateNewTask = () => {
  return (
    <Link to={"/createtaskpage"} style={{ textDecoration: 'none' }}>

    <div className="w-[268px] h-[39px] items-center leading-none justify-center flex border border-MainPurple rounded-[5px] bg-MainPurple hover:border-HoverPurple hover:bg-HoverPurple cursor-pointer gap-[4px]">
        <img src={add} alt="add" />
        <div className="text-[#fff] firaGO-font text-[16px] font-[400] border-none">შექმენი ახალი დავალება</div>
    </div>
    </Link>

  );
};

export default CreateNewTask;
