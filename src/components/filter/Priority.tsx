import FilterButton from "./FilterButton";
import purplecheck from "../../assets/img/purplecheck.svg";
import purplechecked from "../../assets/img/purplechecked.svg";
import { useFilterContext } from "./context/FilterContext";

interface PriorityProps {
  onApply: () => void;
}

const Priority = ({ onApply }: PriorityProps) => {
  const {
    tempSelectedPriorities,
    setTempSelectedPriorities,
    applyFilters,
  } = useFilterContext();

  const handlePriorityClick = (name: string) => {
    let newPriorities: string[];

    if (tempSelectedPriorities.includes(name)) {
      newPriorities = tempSelectedPriorities.filter((r) => r !== name);
    } else {
      newPriorities = [...tempSelectedPriorities, name];
    }

    setTempSelectedPriorities(newPriorities);
  };

  const handleApplyFilter = () => {
    applyFilters(); 
    onApply();
  };

  return (
    <div className="w-[688px] h-[230px] bg-[#fff] absolute border-[0.5px] rounded-[10px] border-MainPurple pt-[40px] pr-[30px] pl-[30px] pb-[20px] flex flex-col gap-[25px]">
      <div className="flex flex-col gap-[22px]">
        <div
          className="flex gap-[15px] items-center cursor-pointer"
          onClick={() => handlePriorityClick("დაბალი")}
        >
          <img
            src={tempSelectedPriorities.includes("დაბალი") ? purplechecked : purplecheck}
            alt="check"
            className="cursor-pointer"
          />
          <div className="firaGO-font text-[16px] text-[#212529]">დაბალი</div>
        </div>
        <div
          className="flex gap-[15px] items-center cursor-pointer"
          onClick={() => handlePriorityClick("საშუალო")}
        >
          <img
            src={tempSelectedPriorities.includes("საშუალო") ? purplechecked : purplecheck}
            alt="check"
            className="cursor-pointer"
          />
          <div className="firaGO-font text-[16px] text-[#212529]">საშუალო</div>
        </div>
        <div
          className="flex gap-[15px] items-center cursor-pointer"
          onClick={() => handlePriorityClick("მაღალი")}
        >
          <img
            src={tempSelectedPriorities.includes("მაღალი") ? purplechecked : purplecheck}
            alt="check"
            className="cursor-pointer"
          />
          <div className="firaGO-font text-[16px] text-[#212529]">მაღალი</div>
        </div>
      </div>

      <div onClick={handleApplyFilter}>
        <FilterButton />
      </div>
    </div>
  );
};

export default Priority;