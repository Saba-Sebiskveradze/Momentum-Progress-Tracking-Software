import { useEffect, useState } from "react";
import {
  getPriority,
  getStatuses,
  getDepartment,
  getEmployee,
  createTask,
} from "../api/data";
import vector from "../assets/img/vector.svg";
import calendarLine from "../assets/img/calendar-line.svg";
import Calendar from "./Calendar";
import checkModal from "../assets/img/checkModal.svg";
import greenCheckModal from "../assets/img/greenCheckModal.svg";
import redCheckModal from "../assets/img/redCheckModal.svg";
import { useNavigate } from "react-router";

export interface Status {
  id: number;
  name: string;
}
export interface Priority {
  id: number;
  name: string;
  icon: string;
}
export interface Department {
  id: number;
  name: string;
}
export interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  department: {
    id: number;
  };
}

interface ValidationState {
  valid: boolean;
  touched: boolean;
  [key: string]: boolean;
}

interface FormValidation {
  title: ValidationState & {
    minLength: boolean;
    maxLength: boolean;
  };
  description: ValidationState & {
    minWords: boolean;
    maxLength: boolean;
  };
  priority: ValidationState;
  status: ValidationState;
  department: ValidationState;
  employee: ValidationState;
  deadline: ValidationState & {
    isFutureDate: boolean;
    isValidFormat: boolean;
  };
}
const CreateTask = () => {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [validation, setValidation] = useState<FormValidation>({
    title: {
      valid: false,
      minLength: false,
      maxLength: true,
      touched: false,
    },
    description: {
      valid: true,
      minWords: true,
      maxLength: true,
      touched: false,
    },
    priority: {
      valid: false,
      touched: false,
    },
    status: {
      valid: false,
      touched: false,
    },
    department: {
      valid: false,
      touched: false,
    },
    employee: {
      valid: false,
      touched: false,
    },
    deadline: {
      valid: false,
      isFutureDate: false,
      isValidFormat: false,
      touched: false,
    },
  });

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const year = tomorrow.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    setInputValue(formattedDate);

    validateDeadline(formattedDate);
  }, []);

  const handleCalendarClick = (): void => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: Date): void => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    setInputValue(formattedDate);
    validateDeadline(formattedDate);
    setShowCalendar(false);
  };

  const handleCloseCalendar = (): void => {
    setShowCalendar(false);
  };

  const validateDeadline = (dateString: string): void => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    const isValidFormat = dateRegex.test(dateString);

    let isFutureDate = false;
    if (isValidFormat) {
      const [day, month, year] = dateString.split(".").map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      isFutureDate = selectedDate > today;
    }

    const isValid = isValidFormat && isFutureDate;

    setValidation((prev) => ({
      ...prev,
      deadline: {
        ...prev.deadline,
        valid: isValid,
        isFutureDate: isFutureDate,
        isValidFormat: isValidFormat,
        touched: true,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);
    validateDeadline(value);
  };

  const validateTitle = (value: string): void => {
    const isMinLength = value.length >= 3;
    const isMaxLength = value.length <= 255;
    const isValid = isMinLength && isMaxLength;

    setValidation((prev) => ({
      ...prev,
      title: {
        ...prev.title,
        valid: isValid,
        minLength: isMinLength,
        maxLength: isMaxLength,
        touched: true,
      },
    }));
  };

  const validateDescription = (value: string): void => {
    if (value.trim() === "") {
      setValidation((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          valid: true,
          minWords: true,
          maxLength: true,
          touched: true,
        },
      }));
      return;
    }

    const wordCount = value.trim().split(/\s+/).length;
    const isMinWords = wordCount >= 4;
    const isMaxLength = value.length <= 255;
    const isValid = isMinWords && isMaxLength;

    setValidation((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        valid: isValid,
        minWords: isMinWords,
        maxLength: isMaxLength,
        touched: true,
      },
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTitle(value);
    validateTitle(value);
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = e.target.value;
    setDescription(value);
    validateDescription(value);
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getStatuses();
        if (data && Array.isArray(data)) {
          setStatuses(data);
          if (data.length > 0) {
            const startingStatus =
              data.find((status) => status.name === "Starting") || data[0];
            setSelectedStatus(startingStatus.id);
            setValidation((prev) => ({
              ...prev,
              status: { valid: true, touched: true },
            }));
          }
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    const fetchPriorities = async () => {
      try {
        const data = await getPriority();
        if (data && Array.isArray(data)) {
          setPriorities(data);
          if (data.length > 0) {
            const mediumPriority =
              data.find((priority) => priority.name === "Medium") || data[1];
            setSelectedPriority(mediumPriority.id);
            setValidation((prev) => ({
              ...prev,
              priority: { valid: true, touched: true },
            }));
          }
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch priorities");
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const data = await getDepartment();
        if (data && Array.isArray(data)) {
          setDepartments(data);
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        if (data && Array.isArray(data)) {
          setEmployees(data);
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
    fetchPriorities();
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = employees.filter(
        (emp) => emp.department.id === selectedDepartment
      );

      setFilteredEmployees(filtered);

      if (
        selectedEmployee &&
        !filtered.some((emp) => emp.id === selectedEmployee)
      ) {
        setSelectedEmployee(null);
        setValidation((prev) => ({
          ...prev,
          employee: { valid: false, touched: true },
        }));
      }
    } else {
      setFilteredEmployees([]);
    }
  }, [selectedDepartment, employees, selectedEmployee]);

  const toggleDropdown = (dropdownType: string) => {
    setIsStatusDropdownOpen(dropdownType === "status" && !isStatusDropdownOpen);
    setIsPriorityDropdownOpen(
      dropdownType === "priority" && !isPriorityDropdownOpen
    );
    setIsDepartmentDropdownOpen(
      dropdownType === "department" && !isDepartmentDropdownOpen
    );
    setIsEmployeeDropdownOpen(
      dropdownType === "employee" && !isEmployeeDropdownOpen
    );
  };

  const handleStatusChange = (statusId: number) => {
    setSelectedStatus(statusId);
    setValidation((prev) => ({
      ...prev,
      status: { valid: true, touched: true },
    }));
    setIsStatusDropdownOpen(false);
  };

  const handlePriorityChange = (priorityId: number) => {
    setSelectedPriority(priorityId);
    setValidation((prev) => ({
      ...prev,
      priority: { valid: true, touched: true },
    }));
    setIsPriorityDropdownOpen(false);
  };

  const handleDepartmentChange = (departmentId: number) => {
    setSelectedDepartment(departmentId);
    setValidation((prev) => ({
      ...prev,
      department: { valid: true, touched: true },
    }));

    setSelectedEmployee(null);
    setValidation((prev) => ({
      ...prev,
      employee: { valid: false, touched: false },
    }));

    setIsDepartmentDropdownOpen(false);
  };

  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setValidation((prev) => ({
      ...prev,
      employee: { valid: true, touched: true },
    }));
    setIsEmployeeDropdownOpen(false);
  };

  const isFormValid = () => {
    return (
      validation.title.valid &&
      validation.description.valid &&
      validation.status.valid &&
      validation.priority.valid &&
      validation.department.valid &&
      validation.employee.valid &&
      validation.deadline.valid
    );
  };
  const convertDate = (dateString: string): string => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const touchedValidation: FormValidation = {
      title: { ...validation.title, touched: true },
      description: { ...validation.description, touched: true },
      priority: { ...validation.priority, touched: true },
      status: { ...validation.status, touched: true },
      department: { ...validation.department, touched: true },
      employee: { ...validation.employee, touched: true },
      deadline: { ...validation.deadline, touched: true },
    };

    setValidation(touchedValidation);

    if (isFormValid()) {
      try {
        const formattedDeadline = convertDate(inputValue);

        const response = await createTask(
          title,
          description,
          selectedPriority!,
          selectedStatus!,
          selectedDepartment!,
          selectedEmployee!,
          formattedDeadline
        );

        console.log("Task created successfully:", response);

        resetForm();
        navigate("/");
      } catch (error) {
        console.error("Failed to create task:", error);
        setError("Failed to create task. Please try again.");
      }
    } else {
      setError("Please fill all required fields correctly.");
    }
  };

  const resetForm = (): void => {
    setTitle("");
    setDescription("");
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSelectedDepartment(null);
    setSelectedEmployee(null);
    setInputValue("");
    setError(null);
    setValidation({
      title: {
        valid: false,
        minLength: false,
        maxLength: true,
        touched: false,
      },
      description: {
        valid: true,
        minWords: true,
        maxLength: true,
        touched: false,
      },
      priority: {
        valid: false,
        touched: false,
      },
      status: {
        valid: false,
        touched: false,
      },
      department: {
        valid: false,
        touched: false,
      },
      employee: {
        valid: false,
        touched: false,
      },
      deadline: {
        valid: false,
        isFutureDate: false,
        isValidFormat: false,
        touched: false,
      },
    });
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem("createTaskFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setTitle(parsedData.title || "");
      setDescription(parsedData.description || "");
      setSelectedStatus(parsedData.status);
      setSelectedPriority(parsedData.priority);
      setSelectedDepartment(parsedData.department);
      setSelectedEmployee(parsedData.employee);
      setInputValue(parsedData.deadline || "");

      if (parsedData.title) validateTitle(parsedData.title);
      if (parsedData.description) validateDescription(parsedData.description);
      if (parsedData.deadline) validateDeadline(parsedData.deadline);
      if (parsedData.status)
        setValidation((prev) => ({
          ...prev,
          status: { valid: true, touched: true },
        }));
      if (parsedData.priority)
        setValidation((prev) => ({
          ...prev,
          priority: { valid: true, touched: true },
        }));
      if (parsedData.department)
        setValidation((prev) => ({
          ...prev,
          department: { valid: true, touched: true },
        }));
      if (parsedData.employee)
        setValidation((prev) => ({
          ...prev,
          employee: { valid: true, touched: true },
        }));
    }
  }, []);

  useEffect(() => {
    const formData = {
      title,
      description,
      status: selectedStatus,
      priority: selectedPriority,
      department: selectedDepartment,
      employee: selectedEmployee,
      deadline: inputValue,
    };
    localStorage.setItem("createTaskFormData", JSON.stringify(formData));
  }, [
    title,
    description,
    selectedStatus,
    selectedPriority,
    selectedDepartment,
    selectedEmployee,
    inputValue,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#FBF9FFA6] h-[1000px] border-[0.3px] border-[#DDD2FF] rounded-[4px] mx-[120px] relative">
      <div className="flex flex-col gap-[55px] absolute left-[55px] top-[65px] w-[550px]">
        <div className="flex flex-col">
          <div className="flex">
            <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
              სათაური
              <sup className="text-xs">*</sup>
            </h2>
          </div>
          <div className="flex flex-col gap-[4px]">
            <input
              type="text"
              className={`w-[full] h-[45px] bg-[#FFFFFF] border p-[14px] flex gap-[10px] rounded-[5px] ${
                validation.title.touched && !validation.title.valid
                  ? "border-[#FA4D4D]"
                  : "border-[#DEE2E6]"
              }`}
              value={title}
              onChange={handleTitleChange}
            />
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-[2px]">
                <img
                  src={
                    !validation.title.touched
                      ? checkModal
                      : validation.title.minLength
                      ? greenCheckModal
                      : redCheckModal
                  }
                  alt="check"
                  className="w-4 h-4"
                />
                <div
                  className={`firaGO-font text-[350] text-[10px] ${
                    !validation.title.touched
                      ? "text-[#6C757D]"
                      : validation.title.minLength
                      ? "text-[#08A508]"
                      : "text-[#FA4D4D]"
                  }`}
                >
                  მინიმუმ 3 სიმბოლო
                </div>
              </div>
              <div className="flex items-center gap-[2px]">
                <img
                  src={
                    !validation.title.touched
                      ? checkModal
                      : validation.title.maxLength
                      ? greenCheckModal
                      : redCheckModal
                  }
                  alt="check"
                  className="w-4 h-4"
                />
                <div
                  className={`firaGO-font text-[350] text-[10px] ${
                    !validation.title.touched
                      ? "text-[#6C757D]"
                      : validation.title.maxLength
                      ? "text-[#08A508]"
                      : "text-[#FA4D4D]"
                  }`}
                >
                  მაქსიმუმ 255 სიმბოლო
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
            აღწერა
          </h2>
          <textarea
            className={`w-full h-[133px] bg-[#FFFFFF] border p-[14px] rounded-[5px] resize-none ${
              validation.description.touched && !validation.description.valid
                ? "border-[#FA4D4D]"
                : "border-[#DEE2E6]"
            }`}
            value={description}
            onChange={handleDescriptionChange}
            placeholder=""
            style={{ textAlign: "left", verticalAlign: "top" }}
          />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-[2px]">
              <img
                src={
                  !validation.description.touched || description.trim() === ""
                    ? checkModal
                    : validation.description.minWords
                    ? greenCheckModal
                    : redCheckModal
                }
                alt="check"
                className="w-4 h-4"
              />
              <div
                className={`firaGO-font text-[350] text-[10px] ${
                  !validation.description.touched || description.trim() === ""
                    ? "text-[#6C757D]"
                    : validation.description.minWords
                    ? "text-[#08A508]"
                    : "text-[#FA4D4D]"
                }`}
              >
                მინიმუმ 4 სიტყვა
              </div>
            </div>
            <div className="flex items-center gap-[2px]">
              <img
                src={
                  !validation.description.touched
                    ? checkModal
                    : validation.description.maxLength
                    ? greenCheckModal
                    : redCheckModal
                }
                alt="check"
                className="w-4 h-4"
              />
              <div
                className={`firaGO-font text-[350] text-[10px] ${
                  !validation.description.touched
                    ? "text-[#6C757D]"
                    : validation.description.maxLength
                    ? "text-[#08A508]"
                    : "text-[#FA4D4D]"
                }`}
              >
                მაქსიმუმ 255 სიმბოლო
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[32px]">
          <div className="flex flex-col">
            <div className="flex">
              <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
                პრიორიტეტი
                <sup className="text-xs">*</sup>
              </h2>
            </div>
            <div className="relative">
              <div
                className={`flex bg-[#FFF] items-center justify-between gap-[10px] border rounded-[5px] w-[260px] h-[45px] p-[14px] cursor-pointer focus:outline-none ${
                  validation.priority.touched && !validation.priority.valid
                    ? "border-[#FA4D4D]"
                    : "border-[#CED4DA]"
                }`}
                onClick={() => toggleDropdown("priority")}
                tabIndex={0}
              >
                <div className="flex">
                  <span className="firaGO-font text-[300] text-[14px] text-[#0D0F10] flex items-center gap-[3px]">
                    <img
                      src={
                        priorities.find(
                          (priority) => priority.id === selectedPriority
                        )?.icon || ""
                      }
                      alt=""
                    />
                    {priorities.find(
                      (priority) => priority.id === selectedPriority
                    )?.name || "Select an option"}
                  </span>
                </div>
                <img
                  src={vector}
                  alt="chevron"
                  className={`transition-transform duration-200 ${
                    isPriorityDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isPriorityDropdownOpen && (
                <div className="absolute bg-[#FFF] top-full left-0 w-full bg-[#FFF] border border-[#CED4DA] rounded-[6px] mt-1 z-10">
                  {priorities.map((priority) => (
                    <div
                      key={priority.id}
                      className="p-[10px] cursor-pointer firaGO-font text-[300] text-[14px] text-[#0D0F10] flex items-center gap-[3px]"
                      onClick={() => handlePriorityChange(priority.id)}
                    >
                      <img src={priority.icon} alt="icon" />
                      {priority.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
                სტატუსი
                <sup className="text-xs">*</sup>
              </h2>
            </div>
            <div className="relative">
              <div
                className={`flex bg-[#FFF] items-center justify-between gap-[10px] border rounded-[5px] w-[260px] h-[45px] p-[14px] cursor-pointer focus:outline-none ${
                  validation.status.touched && !validation.status.valid
                    ? "border-[#FA4D4D]"
                    : "border-[#CED4DA]"
                }`}
                onClick={() => toggleDropdown("status")}
                tabIndex={0}
              >
                <span className="firaGO-font text-[300] text-[14px] text-[#0D0F10]">
                  {statuses.find((status) => status.id === selectedStatus)
                    ?.name || "Select an option"}
                </span>
                <img
                  src={vector}
                  alt="chevron"
                  className={`transition-transform duration-200 ${
                    isStatusDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isStatusDropdownOpen && (
                <div className="absolute bg-[#FFF] top-full left-0 w-full bg-[#FFF] border border-[#CED4DA] rounded-[6px] mt-1 z-10">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="p-[10px] cursor-pointer firaGO-font text-[300] text-[14px] text-[#0D0F10]"
                      onClick={() => handleStatusChange(status.id)}
                    >
                      {status.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[550px] left-[766px] top-[65px] gap-[80px] absolute">
        <div className="flex flex-col">
          <div className="flex">
            <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
              დეპარტამენტი
              <sup className="text-xs">*</sup>
            </h2>
          </div>
          <div className="relative">
            <div
              className={`flex bg-[#FFF] items-center justify-between gap-[10px] border rounded-[5px] w-[550px] h-[45px] p-[14px] cursor-pointer focus:outline-none ${
                validation.department.touched && !validation.department.valid
                  ? "border-[#FA4D4D]"
                  : "border-[#CED4DA]"
              }`}
              onClick={() => toggleDropdown("department")}
              tabIndex={0}
            >
              <span className="firaGO-font text-[300] text-[14px] text-[#0D0F10]">
                {departments.find(
                  (department) => department.id === selectedDepartment
                )?.name || ""}
              </span>
              <img
                src={vector}
                alt="chevron"
                className={`transition-transform duration-200 ${
                  isDepartmentDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {isDepartmentDropdownOpen && (
              <div className="absolute bg-[#FFF] top-full left-0 w-full bg-[#FFF] border border-[#CED4DA] rounded-[6px] mt-1 z-10 max-h-[150px] overflow-y-auto">
                {departments.map((department) => (
                  <div
                    key={department.id}
                    className="p-[10px] cursor-pointer firaGO-font text-[300] text-[14px] text-[#0D0F10]"
                    onClick={() => handleDepartmentChange(department.id)}
                  >
                    {department.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedDepartment && (
          <div className="flex flex-col">
            <div className="flex">
              <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
                პასუხისმგებელი თანამშრომელი
                <sup className="text-xs">*</sup>
              </h2>
            </div>
            <div className="relative">
              <div
                className={`flex bg-[#FFF] items-center justify-between gap-[10px] border rounded-[5px] w-[550px] h-[45px] p-[14px] cursor-pointer focus:outline-none ${
                  validation.employee.touched && !validation.employee.valid
                    ? "border-[#FA4D4D]"
                    : "border-[#CED4DA]"
                }`}
                onClick={() => toggleDropdown("employee")}
                tabIndex={0}
              >
                <span className="firaGO-font text-[300] text-[14px] text-[#0D0F10]">
                  {filteredEmployees.find(
                    (employee) => employee.id === selectedEmployee
                  )
                    ? `${
                        filteredEmployees.find(
                          (employee) => employee.id === selectedEmployee
                        )?.name
                      } ${
                        filteredEmployees.find(
                          (employee) => employee.id === selectedEmployee
                        )?.surname
                      }`
                    : ""}
                </span>
                <img
                  src={vector}
                  alt="chevron"
                  className={`transition-transform duration-200 ${
                    isEmployeeDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isEmployeeDropdownOpen && (
                <div className="absolute z-50 bg-white top-full left-0 w-full border border-[#CED4DA] rounded-[6px] mt-1 max-h-[150px] overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="p-[10px] cursor-pointer firaGO-font text-[300] text-[14px] text-[#0D0F10] flex items-center gap-[3px]"
                        onClick={() => handleEmployeeChange(employee.id)}
                      >
                        <img
                          src={employee.avatar}
                          alt="avatar"
                          className="w-[20px] h-[20px] rounded-[100px]"
                        />
                        <span>
                          {employee.name} {employee.surname}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-[10px] firaGO-font text-[300] text-[14px] text-[#6C757D]">
                      No employees found for this department
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute flex flex-col left-[766px] top-[479px]">
        <h2 className="firaGO-font text-[400] text-[16px] text-[#343A40]">
          დედლაინი
        </h2>
        <div
          className={`flex w-[314px] h-[45px] border rounded-[5px] p-[14px] gap-[6px] bg-[#FFFFFF] items-center ${
            validation.deadline.touched && !validation.deadline.valid
              ? "border-[#FA4D4D]"
              : "border-[#DEE2E6]"
          }`}
        >
          <img
            src={calendarLine}
            alt="calendarLine"
            className="w-[16px] h-[16px] cursor-pointer"
            onClick={handleCalendarClick}
          />
          {showCalendar && (
            <Calendar
              onDateSelect={handleDateSelect}
              onClose={handleCloseCalendar}
            />
          )}
          <input
            type="text"
            placeholder="DD.MM.YYYY"
            value={inputValue}
            onChange={handleInputChange}
            className="firaGO-font text-[300] text-[14px] text-[#ADB5BD] bg-transparent border-none outline-none w-full"
            style={{ letterSpacing: "-1.25%", lineHeight: "20px" }}
          />
        </div>

        {validation.deadline.touched && !validation.deadline.isValidFormat && (
          <div className="text-[#FA4D4D] text-[10px] mt-1">
            გთხოვთ შეიყვანოთ თარიღი ფორმატით: DD.MM.YYYY
          </div>
        )}
        {validation.deadline.touched &&
          validation.deadline.isValidFormat &&
          !validation.deadline.isFutureDate && (
            <div className="text-[#FA4D4D] text-[10px] mt-1">
              გთხოვთ შეიყვანოთ მომავალი თარიღი
            </div>
          )}
      </div>

      {error && (
        <div className="absolute top-[650px] left-[766px] text-[#FA4D4D]">
          {error}
        </div>
      )}

      <div
        className={`rounded-[5px] py-[5px] px-[10px] w-[208px] h-[42px] firaGO-font text-[400] text-[18px] text-[#FFF] absolute top-[700px] left-[1100px] flex items-center justify-center cursor-pointer ${
          isFormValid()
            ? "bg-[#8338EC] hover:bg-[#7028d8]"
            : "bg-[#a381d1] cursor-not-allowed"
        }`}
        onClick={handleSubmit}
      >
        დავალების შექმნა
      </div>
    </div>
  );
};

export default CreateTask;
