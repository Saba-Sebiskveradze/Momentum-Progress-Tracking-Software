import { useEffect, useState } from "react";
import { getEmployee } from "../../api/data";
import purplecheck from "../../assets/img/purplecheck.svg";
import purplechecked from "../../assets/img/purplechecked.svg";
import FilterButton from "./FilterButton";
import { useFilterContext } from "./context/FilterContext";

interface EmployeeProps {
  onApply: () => void;
}

const Employee = ({ onApply }: EmployeeProps) => {
  const { tempSelectedEmployees, setTempSelectedEmployees, applyFilters } =
    useFilterContext();
  const [employees, setEmployees] = useState<
    { id: number; name: string; avatar: string; surname: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        setEmployees(data);
      } catch {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeClick = (employee: { id: number; name: string; surname: string; avatar: string }) => {
    setTempSelectedEmployees([employee]);
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
        <div className="flex flex-col gap-[22px] h-[154px] max-h-[154px] overflow-y-auto">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="h-[28px] gap-[15px] flex items-center cursor-pointer"
              onClick={() => handleEmployeeClick(emp)}
            >
              <img
                src={
                  tempSelectedEmployees.some(
                    (selected) => selected.id === emp.id
                  )
                    ? purplechecked
                    : purplecheck
                }
                alt="check"
              />
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-[28px] h-[28px] rounded-full"
              />
              <p className="firaGO-font font-[400] text-[16px] text-[#212529]">
                {emp.name} {emp.surname}
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

export default Employee;
