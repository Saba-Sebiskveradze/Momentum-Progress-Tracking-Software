import React, { JSX, useState } from "react";
import up from "../assets/img/up.svg";
import down from "../assets/img/down.svg";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  onClose: () => void; // Add a prop to handle closing the calendar
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth();
  const days: number = daysInMonth(year, month);
  const firstDay: number = firstDayOfMonth(year, month);

  const prevMonth = (): void => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number): void => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  const handleOkClick = (): void => {
    if (selectedDate) {
      onDateSelect(selectedDate); // Pass the selected date to the parent
    }
    onClose(); // Close the calendar
  };

  const handleCancelClick = (): void => {
    onClose(); // Close the calendar without saving
  };

  const renderDays = (): JSX.Element[] => {
    const daysArray: JSX.Element[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(
        <div key={`empty-${i}`} className="text-center p-2"></div>
      );
    }
    // Add days of the month
    for (let i = 1; i <= days; i++) {
      const isToday: boolean =
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const isSelected: boolean =
        selectedDate !== null &&
        i === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      daysArray.push(
        <div
          key={i}
          className={`flex items-center justify-center p-2 rounded ${
            isToday
              ? "bg-[#8338EC] text-[#FFF] font-bold"
              : isSelected
              ? "bg-[#8338EC] text-[#FFF] font-bold"
              : "hover:bg-[#8338EC] hover:text-[#FFF] cursor-pointer"
          }`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="bg-[#FFF] p-[16px] w-[318px] h-[336px] absolute z-90 top-[92px] left-[0px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="firaGO-font text-[700] text-[13px] text-[#000000]">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-[2px]">
          <img
            src={down}
            alt="down"
            onClick={prevMonth}
            className="cursor-pointer"
          />
          <img
            src={up}
            alt="up"
            onClick={nextMonth}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="w-[224px] h-[224px]">
        {/* Days of the Week */}
        <div className="grid grid-cols-7 gap-2 mb-2 w-[224px] h-[32px]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-[#6C757D]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 w-[224px] h-[192px]">
          {renderDays()}
        </div>
        <div className="flex justify-between mt-[20px]">
          <div
            className="firaGO-font text-[400] text-[13px] text-[#8338EC] cursor-pointer"
            onClick={handleCancelClick} // Close the calendar on cancel
          >
            cancel
          </div>
          <div
            className="firaGO-font text-[400] text-[13px] text-[#8338EC] cursor-pointer"
            onClick={handleOkClick} // Close the calendar and save the selected date
          >
            ok
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;