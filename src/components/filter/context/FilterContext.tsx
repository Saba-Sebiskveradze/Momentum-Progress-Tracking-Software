import React, { createContext, useContext, useState } from "react";

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

interface FilterContextType {
  selectedDepartments: Department[];
  setSelectedDepartments: (departments: Department[]) => void;
  selectedEmployees: Employee[];
  setSelectedEmployees: (employees: Employee[]) => void;
  selectedPriorities: string[];
  setSelectedPriorities: (priorities: string[]) => void;
  tempSelectedDepartments: Department[];
  setTempSelectedDepartments: (departments: Department[]) => void;
  tempSelectedEmployees: Employee[];
  setTempSelectedEmployees: (employees: Employee[]) => void;
  tempSelectedPriorities: string[];
  setTempSelectedPriorities: (priorities: string[]) => void;
  applyFilters: () => void;
  clearAllFilters: () => void;
  removeFilter: (type: 'department' | 'employee' | 'priority', id: number | string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDepartments, setSelectedDepartmentsState] = useState<Department[]>(
    loadFromStorage<Department[]>('selectedDepartments', [])
  );
  const [selectedEmployees, setSelectedEmployeesState] = useState<Employee[]>(
    loadFromStorage<Employee[]>('selectedEmployees', [])
  );
  const [selectedPriorities, setSelectedPrioritiesState] = useState<string[]>(
    loadFromStorage<string[]>('selectedPriorities', [])
  );

  const [tempSelectedDepartments, setTempSelectedDepartments] = useState<Department[]>(
    loadFromStorage<Department[]>('selectedDepartments', [])
  );
  const [tempSelectedEmployees, setTempSelectedEmployees] = useState<Employee[]>(
    loadFromStorage<Employee[]>('selectedEmployees', [])
  );
  const [tempSelectedPriorities, setTempSelectedPriorities] = useState<string[]>(
    loadFromStorage<string[]>('selectedPriorities', [])
  );

  const setSelectedDepartments = (departments: Department[]) => {
    setSelectedDepartmentsState(departments);
    saveToStorage('selectedDepartments', departments);
  };

  const setSelectedEmployees = (employees: Employee[]) => {
    setSelectedEmployeesState(employees);
    saveToStorage('selectedEmployees', employees);
  };

  const setSelectedPriorities = (priorities: string[]) => {
    setSelectedPrioritiesState(priorities);
    saveToStorage('selectedPriorities', priorities);
  };

  const applyFilters = () => {
    setSelectedDepartments(tempSelectedDepartments);
    setSelectedEmployees(tempSelectedEmployees);
    setSelectedPriorities(tempSelectedPriorities);
  };

  const clearAllFilters = () => {
    setSelectedDepartments([]);
    setSelectedEmployees([]);
    setSelectedPriorities([]);
    setTempSelectedDepartments([]);
    setTempSelectedEmployees([]);
    setTempSelectedPriorities([]);
    
    localStorage.removeItem('selectedDepartments');
    localStorage.removeItem('selectedEmployees');
    localStorage.removeItem('selectedPriorities');
  };

  const removeFilter = (type: 'department' | 'employee' | 'priority', id: number | string) => {
    switch (type) {
      case 'department': {
        const updatedDepts = selectedDepartments.filter(dept => dept.id !== id);
        setSelectedDepartments(updatedDepts);
        setTempSelectedDepartments(updatedDepts);
        break;
      }
      case 'employee': {
        const updatedEmps = selectedEmployees.filter(emp => emp.id !== id);
        setSelectedEmployees(updatedEmps);
        setTempSelectedEmployees(updatedEmps);
        break;
      }
      case 'priority': {
        const updatedPriorities = selectedPriorities.filter(priority => priority !== id);
        setSelectedPriorities(updatedPriorities);
        setTempSelectedPriorities(updatedPriorities);
        break;
      }
      default:
        break;
    }
  };

  return (
    <FilterContext.Provider
      value={{
        selectedDepartments,
        setSelectedDepartments,
        selectedEmployees,
        setSelectedEmployees,
        selectedPriorities,
        setSelectedPriorities,
        tempSelectedDepartments,
        setTempSelectedDepartments,
        tempSelectedEmployees,
        setTempSelectedEmployees,
        tempSelectedPriorities,
        setTempSelectedPriorities,
        applyFilters,
        clearAllFilters,
        removeFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};