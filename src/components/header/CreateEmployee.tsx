
interface CreateEmployeeProps {
  openModal: () => void;
}
const CreateEmployee: React.FC<CreateEmployeeProps> = ({ openModal }) => {
  return (
    <div 
      className="w-[225px] h-[39px] items-center justify-center flex  border rounded-[5px] border-MainPurple text-GreyShades firaGO-font text-[16px] font-[400] hover:border-HoverPurple cursor-pointer"
      onClick={openModal}
    >
      თანამშრომლის შექმნა
    </div>
  );
};

export default CreateEmployee;