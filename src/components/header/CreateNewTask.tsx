import add from "../../assets/img/add.svg";
const CreateNewTask = () => {
  return (
    <div className="w-[268px] h-[39px] items-center justify-center flex border border-MainPurple rounded-[5px] bg-MainPurple text-[#fff] firaGO-font text-[16px] font-[400] hover:border-HoverPurple hover:bg-HoverPurple cursor-pointer gap-[4px]">
      <img src={add} alt="add" />
      <div>შექმენი ახალი დავალება</div>
    </div>
  );
};

export default CreateNewTask;
