import { useState } from "react";
import vector from "../../assets/img/vector.svg";
import vector2 from "../../assets/img/vector2.svg";
import Departament from "./Departament";
import Priority from "./Priority";
import Employee from "./Employee";

const Filters = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const closeFilter = () => {
    setActiveFilter(null);
  };

  const filterOptions = [
    {
      id: "departament",
      label: "დეპარტამენტი",
      component: <Departament onApply={closeFilter} />,
    },
    {
      id: "priority",
      label: "პრიორიტეტი",
      component: <Priority onApply={closeFilter} />,
    },
    {
      id: "employee",
      label: "თანამშრომელი",
      component: <Employee onApply={closeFilter} />,
    },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const activeFilterComponent = filterOptions.find(
    (filter) => filter.id === activeFilter
  )?.component;

  return (
    <div className="relative w-[688px] h-[44px] ml-[120px] mt-[50px] border border-[#DEE2E6] flex gap-[45px] rounded-[10px]">
      {filterOptions.map((filter) => (
        <div
          key={filter.id}
          className="flex w-[200px] h-[44px] items-center justify-center gap-[8px] cursor-pointer"
          onClick={() => handleFilterClick(filter.id)}
        >
          <p
            className={`firaGO-font text-[16px] font-[400] ${
              activeFilter === filter.id ? "text-MainPurple" : "text-GreyShades"
            }`}
          >
            {filter.label}
          </p>
          <img
            src={activeFilter === filter.id ? vector2 : vector}
            alt="vector"
            className="w-6 h-6"
          />
        </div>
      ))}

      {activeFilterComponent && (
        <div className="absolute top-[50px] left-0 w-full">{activeFilterComponent}</div>
      )}
    </div>
  );
};

export default Filters;
