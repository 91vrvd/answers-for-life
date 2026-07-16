"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { tasks } from "@/src/data/tasks";

export type Answer = "skip" | "done" | "want";
export type Page = "home" | "name" | "intro" | "questions" | "personal" | "invite" | "couple" | "things";

export type LoveState = {
  page: Page;
  partnerName: string;
  currentIndex: number;
  answers: Record<number, Answer>;
  partnerAnswers: Record<number, Answer>;
  firstTaskId: number | null;
  hydrated: boolean;
};

const STORAGE_KEY = "little-things-about-love:v1";
const initialState: LoveState = { page: "home", partnerName: "", currentIndex: 0, answers: {}, partnerAnswers: {}, firstTaskId: null, hydrated: false };

type Action =
  | { type: "hydrate"; payload: Partial<LoveState> }
  | { type: "navigate"; page: Page }
  | { type: "setName"; name: string }
  | { type: "answer"; taskId: number; answer: Answer }
  | { type: "previousQuestion" }
  | { type: "simulatePartner" }
  | { type: "setFirstTask"; taskId: number }
  | { type: "restart" };

function reducer(state: LoveState, action: Action): LoveState {
  switch (action.type) {
    case "hydrate": {
      const saved = action.payload;
      const answered = Object.keys(saved.answers ?? {}).length;
      const safeIndex = Math.min(saved.currentIndex ?? answered, tasks.length);
      let safePage = saved.page ?? "home";
      if (safePage === "questions" && safeIndex >= tasks.length) safePage = "personal";
      return { ...state, ...saved, page: safePage, currentIndex: safeIndex, hydrated: true };
    }
    case "navigate": return { ...state, page: action.page };
    case "setName": return { ...state, partnerName: action.name.trim(), page: "intro" };
    case "answer": {
      const nextAnswers = { ...state.answers, [action.taskId]: action.answer };
      const nextIndex = Math.min(state.currentIndex + 1, tasks.length);
      return { ...state, answers: nextAnswers, currentIndex: nextIndex, page: nextIndex >= tasks.length ? "personal" : "questions" };
    }
    case "previousQuestion": return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };
    case "simulatePartner": {
      const pattern: Answer[] = ["want", "done", "want", "skip", "done", "done", "want", "want", "skip", "done", "done", "want", "skip", "want", "done"];
      const partnerAnswers = Object.fromEntries(tasks.map((task, index) => [task.id, pattern[index]])) as Record<number, Answer>;
      return { ...state, partnerAnswers, page: "couple" };
    }
    case "setFirstTask": return { ...state, firstTaskId: action.taskId, page: "things" };
    case "restart": return { ...initialState, hydrated: true, partnerName: state.partnerName, page: "intro" };
    default: return state;
  }
}

type LoveContextValue = { state: LoveState; dispatch: React.Dispatch<Action> };
const LoveContext = createContext<LoveContextValue | null>(null);

export function LoveBookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", payload: raw ? JSON.parse(raw) : {} });
    } catch {
      dispatch({ type: "hydrate", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const persisted = {
      page: state.page,
      partnerName: state.partnerName,
      currentIndex: state.currentIndex,
      answers: state.answers,
      partnerAnswers: state.partnerAnswers,
      firstTaskId: state.firstTaskId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <LoveContext.Provider value={value}>{children}</LoveContext.Provider>;
}

export function useLoveBook() {
  const context = useContext(LoveContext);
  if (!context) throw new Error("useLoveBook must be used inside LoveBookProvider");
  return context;
}
