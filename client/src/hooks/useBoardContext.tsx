import type { Task } from "@/types/task";
import type { Column } from "@/types/column";
import { useContext } from "react";
import { createContext } from "react";

type TBoardContext = {
  columns: Column[];
  tasks: Task[];
  getTaskById: (taskId: string) => Task | undefined;
  getColumnById: (columnId: string) => Column | undefined;
  getColumnTasks: (columnId: string) => Task[];
};

export const BoardContext = createContext<TBoardContext | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
