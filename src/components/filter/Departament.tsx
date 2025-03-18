import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import { getDepartment } from "../../api/data";
import check from "../../assets/img/check.svg";
import checked from "../../assets/img/checked.svg";
import { useFilterContext } from "./context/FilterContext";

interface DepartamentProps {
  onApply: () => void;
}

const Departament: React.FC<DepartamentProps> = ({ onApply }) => {
  const {
    tempSelectedDepartments,
    setTempSelectedDepartments,
    applyFilters,
  } = useFilterContext();
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartment();
        setDepartments(data);
      } catch {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartamentClick = (department: { id: number; name: string }) => {
    let newDepartments: { id: number; name: string }[];

    if (tempSelectedDepartments.some((dept) => dept.id === department.id)) {
      newDepartments = tempSelectedDepartments.filter((dept) => dept.id !== department.id);
    } else {
      newDepartments = [...tempSelectedDepartments, department];
    }

    setTempSelectedDepartments(newDepartments);
  };

  const handleApplyFilter = () => {
    applyFilters(); 
    onApply(); 
  };

  return (
    <div className="w-[688px] h-[274px] bg-[#fff] absolute border-[0.5px] rounded-[10px] border-MainPurple pt-[40px] pr-[30px] pl-[30px] pb-[20px] flex flex-col gap-[25px]">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <div className="h-[154px]"></div>}
      {!loading && !error && (
        <div className="flex flex-col gap-[22px] max-h-[154px] overflow-y-auto">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="h-[22px] gap-[15px] flex items-center cursor-pointer"
              onClick={() => handleDepartamentClick(dept)}
            >
              <img
                src={tempSelectedDepartments.some((selected) => selected.id === dept.id) ? checked : check}
                alt="check"
              />
              <p className="firaGO-font font-[400] text-[16px] text-[#212529]">
                {dept.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <div onClick={handleApplyFilter}>
        <FilterButton />
      </div>
    </div>
  );
};

export default Departament;