import { useState, useCallback } from "react";
import dayjs from "dayjs";

export const useMonthNavigation = (initialMonth?: string) => {
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth || dayjs().format("MMMM")
  );

  const handleMonthChange = useCallback((direction: "prev" | "next") => {
    const newMonth = direction === "prev" 
      ? dayjs(currentMonth, "MMMM").subtract(1, "month") 
      : dayjs(currentMonth, "MMMM").add(1, "month");
    
    setCurrentMonth(newMonth.format("MMMM"));
  }, [currentMonth]);

  const goToCurrentMonth = useCallback(() => {
    setCurrentMonth(dayjs().format("MMMM"));
  }, []);

  const goToSpecificMonth = useCallback((month: string) => {
    setCurrentMonth(month);
  }, []);

  return {
    currentMonth,
    handleMonthChange,
    goToCurrentMonth,
    goToSpecificMonth,
    setCurrentMonth
  };
};
