import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getStatuses, getTaskInformation, updateTaskStatus } from "../../api/data";
import pieChart from "../../assets/img/pie-chart.svg";
import calendar from "../../assets/img/calendar.svg";
import person from "../../assets/img/person.svg";
import vector from "../../assets/img/vector.svg";
import { format, parseISO } from "date-fns";
import { ka } from "date-fns/locale";

export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  department: Department;
}

export interface Status {
  id: number;
  name: string;
}

export interface Priority {
  id: number;
  name: string;
  icon: string;
}

export interface TaskInformation {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: Department;
  employee: Employee;
  status: Status;
  priority: Priority;
}

const TaskInformation = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [taskInformation, setTaskInformation] = useState<TaskInformation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getStatuses();
        if (data && Array.isArray(data)) {
          setStatuses(data);
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    if (!taskId) {
      setError("No task ID provided");
      setLoading(false);
      return;
    }

    const fetchInformations = async () => {
      try {
        const data = await getTaskInformation(Number(taskId));
        setTaskInformation(data);
        setSelectedStatus(data.status.id); 
      } catch {
        setError("Failed to fetch task information");
      } finally {
        setLoading(false);
      }
    };

    fetchInformations();
  }, [taskId]);

  const handleStatusChange = async (newStatusId: number) => {
    if (!taskId) return;

    try {
      await updateTaskStatus(Number(taskId), newStatusId);
      setTaskInformation((prev) => {
        if (prev) {
          const newStatus = statuses.find((status) => status.id === newStatusId);
          if (newStatus) {
            return { ...prev, status: newStatus };
          }
        }
        return prev;
      });
      setSelectedStatus(newStatusId);
    } catch {
      setError("Failed to update task status");
    }
  };

  const formatGeorgianDate = (isoString: string): string => {
    const date = parseISO(isoString);
    const dayOfWeek = format(date, "EEE", { locale: ka });
    const formattedDate = format(date, "dd/M/yyyy");
    return `${dayOfWeek} - ${formattedDate}`;
  };

  const getPriorityBorderColorClass = (priorityId?: number): string => {
    switch (priorityId) {
      case 1:
        return "#08A508";
      case 2:
        return "#FFBE0B";
      case 3:
        return "#FA4D4D";
      default:
        return "#FA4D4D";
    }
  };

  const getDepartmentColor = (departmentName: string): string => {
    const stringToHash = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };

    const getColorFromHash = (hash: number): string => {
      const color = `#${((hash & 0x00ffffff) | 0x1000000)
        .toString(16)
        .slice(1)}`;
      return color;
    };

    const hash = stringToHash(departmentName);
    return getColorFromHash(hash);
  };

  if (loading) return <div className="flex absolute flex-col gap-[63px] ml-[120px] mt-[40px] pt-[100px] pl-[200px] flex items-center justify-center">Loading...</div>;
  if (error) return <p>{error}</p>;

  if (!taskInformation) {
    return <p>No task information available</p>;
  }

  return (
    <div className="flex absolute flex-col gap-[63px] ml-[120px] mt-[40px]">
      <div className="flex flex-col gap-[26px] w-[715px]">
        <div className="flex flex-col gap-[12px] pt-[10px] pb-[10px]">
          <div className="flex items-center gap-[18px]">
            <div
              className="flex items-center border-[0.5px] py-[4px] px-[5px] gap-[4px] rounded-[4px] w-[106px] h-[32px]"
              style={{
                borderColor: getPriorityBorderColorClass(
                  taskInformation.priority?.id
                ),
              }}
            >
              <img
                src={taskInformation.priority?.icon}
                alt={`${
                  taskInformation.priority?.name || "Unknown"
                } priority icon`}
              />
              <p
                className="firaGO-font text-[500] text-[16px] leading-[150%]"
                style={{
                  color: getPriorityBorderColorClass(
                    taskInformation.priority?.id
                  ),
                }}
              >
                {taskInformation.priority?.name || "Unknown"}
              </p>
            </div>
            <div
              className="rounded-[15px] px-[10px] py-[5px] firaGO-font text-[400] text-[16px] text-[#FFFFFF] w-[88px] h-[29px] overflow-hidden whitespace-nowrap text-ellipsis"
              style={{
                backgroundColor: getDepartmentColor(
                  taskInformation.department?.name
                ),
              }}
            >
              {taskInformation.department?.name}
            </div>
          </div>
          <h1 className="firaGO-font text-[600] text-[34px] text-[#212529]">{taskInformation.name}</h1>
        </div>
        <p className="firaGO-font text-[400] text-[18px] text-[#000000] leading-[150%]">
          {taskInformation.description}
        </p>
      </div>

      <div className="flex flex-col gap-[18px] w-[500px]">
        <div className="pt-[10px] pb-[10px] flex gap-[10px] firaGO-font text-[500] text-[24px] text-[#2A2A2A]">დავალების დეტალები</div>

        <div className="flex flex-col">
          <div className="flex gap-[70px] items-center pt-[10px] pb-[10px]">
            <div className="flex gap-[6px] w-[164px]">
              <img src={pieChart} alt="pieChart" />
              <p className="firaGO-font text-[400] text-[16px] text-[#474747] leading-[150%]">სტატუსი</p>
            </div>
            <div className="relative">
              <div
                className="flex items-center justify-between gap-[10px] border border-[#CED4DA] rounded-[5px] w-[260px] h-[45px] p-[14px] cursor-pointer focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                tabIndex={0} 
              >
                <span className="firaGO-font text-[300] text-[14px] text-[#0D0F10]">
                  {statuses.find((status) => status.id === selectedStatus)?.name || "Select an option"}
                </span>
                <img
                  src={vector}
                  alt="chevron"
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-[#FFF]  border border-[#CED4DA] rounded[6px] mt-1  z-10">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="p-[10px]  cursor-pointer firaGO-font text-[300] text-[14px] text-[#0D0F10]"
                      onClick={() => {
                        handleStatusChange(status.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {status.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-[70px] items-center pt-[10px] pb-[10px]">
            <div className="flex gap-[6px] w-[164px]">
              <img src={person} alt="person" />
              <p className="firaGO-font text-[400] text-[16px] text-[#474747] leading-[150%]">თანამშრომელი</p>
            </div>
            <div className="flex items-center gap-[12px] h-[42px]">
              <img src={taskInformation.employee?.avatar} alt="avatar" className="rounded-[100px] w-[32px] h-[32px]" />
              <div className="flex flex-col gap-[1px]">
                <p className="firaGO-font text-[300] text-[11px] text-[#474747] leading-[0px]">{taskInformation.employee?.department?.name}</p>
                <p className="firaGO-font text-[400] text-[14px] text-[#0D0F10] leading-[0px]">{taskInformation.employee.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center pt-[10px] pb-[10px] gap-[70px]">
            <div className="flex gap-[6px] w-[164px]">
              <img src={calendar} alt="calendar" />
              <p className="firaGO-font text-[400] text-[16px] text-[#474747] leading-[150%]">დავალების ვადა</p>
            </div>
            <div className="firaGO-font text-[400] text-[14px] text-[#0D0F10] leading-[150%]">
              {formatGeorgianDate(taskInformation.due_date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInformation;