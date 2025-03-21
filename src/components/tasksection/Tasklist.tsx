import { useEffect, useState } from "react";
import { useFilterContext } from "../filter/context/FilterContext";
import { getTasks } from "../../api/data";
import TaskCard from "./TaskCard";
import { useNavigate } from "react-router";

interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
    department: {
      id: number;
      name: string;
    };
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
    icon: string;
  };
  total_comments: number;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { selectedDepartments, selectedEmployees, selectedPriorities } =
    useFilterContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        if (data && Array.isArray(data)) {
          setTasks(data);
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesDepartment =
      selectedDepartments.length === 0 ||
      selectedDepartments.some((dept) => dept.id === task.department.id);
    const matchesEmployee =
      selectedEmployees.length === 0 ||
      selectedEmployees.some((emp) => emp.id === task.employee.id);
    const matchesPriority =
      selectedPriorities.length === 0 ||
      selectedPriorities.includes(task.priority.name);

    return matchesDepartment && matchesEmployee && matchesPriority;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const statusId = task.status.id;
    if (!acc[statusId]) {
      acc[statusId] = [];
    }
    acc[statusId].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  for (const statusId in groupedTasks) {
    groupedTasks[statusId].reverse();
  }

  const statusOrder = [1, 2, 3, 4];

  return (
    <div className="flex mx-[120px] mt-[40px] justify-between gap-[30px]">
      {statusOrder.map((statusId) => (
        <div key={statusId} className="">
          {groupedTasks[statusId]?.length > 0 ? (
            groupedTasks[statusId].map((task) => (
              <div
                key={task.id}
                className="mt-[30px] cursor-pointer"
                onClick={() => navigate(`/taskpage/${task.id}`)}
              >
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <div className="mt-[30px] w-[380px] h-[217px]"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;