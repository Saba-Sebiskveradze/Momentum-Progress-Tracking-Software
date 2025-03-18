import React from "react";
import comments from '../../assets/img/Comments.svg'

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
}

interface Status {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  name: string;
  icon: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: Department;
  employee: Employee;
  status: Status;
  priority: Priority;
  total_comments: number;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  
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

 
  const getStatusBorderColorClass = (statusId: number): string => {
    switch (statusId) {
      case 1:
        return "#F7BC30";
      case 2:
        return "#FB5607";
      case 3:
        return "#FF006E";
      case 4:
        return "#3A86FF";
      default:
        return "#FFFFFF";
    }
  };

  const getPriorityBorderColorClass = (priorityId: number): string => {
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

  const formattedDate = new Date(task.due_date).toLocaleDateString();

  return (
    <div
      className="w-[380px] h-[217px] border rounded-[15px] p-[20px] gap-[28px] flex flex-col"
      style={{ borderColor: getStatusBorderColorClass(task.status.id) }}
    >
      <div className="flex h-[26px] justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <div
            className="flex items-center border-[0.5px] p-[4px] gap-[4px] rounded-[4px] w-[86px] h-[26px]"
            style={{
              borderColor: getPriorityBorderColorClass(task.priority.id),
            }}
          >
            <img
              src={task.priority.icon}
              alt={`${task.priority.name} priority icon`}
            />
            <p
              className="firaGO-font text-[500] text-[12px] "
              style={{ color: getPriorityBorderColorClass(task.priority.id) }}
            >
              {task.priority.name}
            </p>
          </div>

          <div
            className="rounded-[15px] px-[9px] py-[5px] firaGO-font text-[400] text-[12px] text-[#FFFFFF] w-[86px] h-[26px] overflow-hidden whitespace-nowrap text-ellipsis"
            style={{
              backgroundColor: getDepartmentColor(task.department.name),
            }}
          >
            {task.department.name}
          </div>
        </div>

        <div className="firaGO-font text-[400] text-[12px] text-[#212529]">
          {formattedDate}
        </div>
      </div>

      <div className="flex flex-col w-[320px] gap-[12px] mx-auto ">
        <div className="firaGO-font font-[900] text-[15px] text-[#191919]">
          {task.name}
        </div>
        <div className="firaGO-font text-[400] text-[14px] text-[#343A40]">
          {task.description}
        </div>
      </div>

      <div className="flex w-[340px] justify-between items-center">
        <img
          src={task.employee.avatar}
          alt=""
          className="w-[32px] h-[32px] rounded-full"
        />
        <div className=" flex gap-[4px]">
            <img src={comments} alt="comments" />
            <p className="firaGO-font text-[400] text-[12px] text-[#212529]">{task.total_comments}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
