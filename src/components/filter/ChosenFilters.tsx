import { useFilterContext } from "./context/FilterContext";
import x from "../../assets/img/x.svg";

const ChosenFilters = () => {
  const {
    selectedDepartments,
    selectedEmployees,
    selectedPriorities,
    removeFilter,
    clearAllFilters,
  } = useFilterContext();

  const hasFilters =
    selectedDepartments.length > 0 ||
    selectedEmployees.length > 0 ||
    selectedPriorities.length > 0;

  return (
    <div className="flex flex-wrap items-center ml-[120px] mt-[30px] gap-[16px]">
      <div className="flex items-center  gap-[8px]">
        {selectedDepartments.length > 0 &&
          selectedDepartments.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center border border-[#CED4DA] px-[10px]  rounded-[43px] gap-[4px] bg-[#fff]"
            >
              <p className="firaGO-font text-[14px] leading-[6px] font-[400] text-[#343A40]">
                {dept.name}
              </p>
              <button
                onClick={() => removeFilter("department", dept.id)}
                className="cursor-pointer flex items-center"
              >
                <img src={x} alt="remove filter" />
              </button>
            </div>
          ))}

        {selectedEmployees.length > 0 &&
          selectedEmployees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center border border-[#CED4DA] rounded-[43px] px-[10px] gap-[4px] bg-[#fff]"
            >
              <p className="firaGO-font text-[14px] leading-[6px] font-[400] text-[#343A40]">
                {emp.name} {emp.surname}
              </p>
              <button
                onClick={() => removeFilter("employee", emp.id)}
                className="cursor-pointer flex items-center"
              >
                <img src={x} alt="remove filter" />
              </button>
            </div>
          ))}

        {selectedPriorities.length > 0 &&
          selectedPriorities.map((priority) => (
            <div
              key={priority}
              className="flex items-center border border-[#CED4DA] rounded-[43px] px-[10px] gap-[4px] bg-[#fff]"
            >
              <p className="firaGO-font text-[14px] leading-[6px] font-[400] text-[#343A40]">
                {priority}
              </p>
              <button
                onClick={() => removeFilter("priority", priority)}
                className="cursor-pointer flex items-center"
              >
                <img src={x} alt="remove filter" />
              </button>
            </div>
          ))}
      </div>

      {hasFilters && (
        <div
          onClick={clearAllFilters}
          className="firaGO-font text-[14px] font-[400] text-[#343A40] flex items-center cursor-pointer"
        >
          გასუფთავება
        </div>
      )}
    </div>
  );
};

export default ChosenFilters;
