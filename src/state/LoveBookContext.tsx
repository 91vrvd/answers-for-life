"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { createTaskSelection, tasks, type LoveMode } from "@/src/data/tasks";

export type Answer = "skip" | "done" | "want";
export type Page = "home" | "mode" | "name" | "count" | "intro" | "questions" | "personal" | "invite" | "couple" | "things";

export type LoveState = {
  page: Page;
  mode: LoveMode | null;
  partnerName: string;
  questionCount: number;
  selectedTaskIds: number[];
  currentIndex: number;
  answers: Record<number, Answer>;
  partnerAnswers: Record<number, Answer>;
  firstTaskId: number | null;
  hydrated: boolean;
};

const STORAGE_KEY = "little-things-about-love:v2";
const initialState: LoveState = {
  page: "home",
  mode: null,
  partnerName: "",
  questionCount: 15,
  selectedTaskIds: [],
  currentIndex: 0,
  answers: {},
  partnerAnswers: {},
  firstTaskId: null,
  hydrated: false,
};

type Action =
  | { type: "hydrate"; payload: Partial<LoveState> }
  | { type: "navigate"; page: Page }
  | { type: "setMode"; mode: LoveMode }
  | { type: "setName"; name: string }
  | { type: "prepareQuiz"; count: number }
  | { type: "answer"; taskId: number; answer: Answer }
  | { type: "previousQuestion" }
  | { type: "simulatePartner" }
  | { type: "setFirstTask"; taskId: number }
  | { type: "restart" };

function reducer(state: LoveState, action: Action): LoveState {
  switch (action.type) {
    case "hydrate": {
      const saved = action.payload;
      const selectedTaskIds = (saved.selectedTaskIds ?? []).filter((id) => tasks.some((task) => task.id === id));
      const total = selectedTaskIds.length;
      const safeIndex = Math.min(saved.currentIndex ?? Object.keys(saved.answers ?? {}).length, total);
      let safePage = saved.page ?? "home";
      if (!saved.mode && safePage !== "home") safePage = "mode";
      if (safePage === "questions" && (!total || safeIndex >= total)) safePage = total ? "personal" : "count";
      return { ...state, ...saved, selectedTaskIds, page: safePage, currentIndex: safeIndex, hydrated: true };
    }
    case "navigate": return { ...state, page: action.page };
    case "setMode": return {
      ...initialState,
      hydrated: true,
      mode: action.mode,
      partnerName: state.partnerName,
      page: action.mode === "couple" ? "name" : "count",
    };
    case "setName": return { ...state, partnerName: action.name.trim(), page: "count" };
    case "prepareQuiz": {
      const mode = state.mode ?? "couple";
      return {
        ...state,
        questionCount: action.count,
        selectedTaskIds: createTaskSelection(action.count, mode),
        currentIndex: 0,
        answers: {},
        partnerAnswers: {},
        firstTaskId: null,
        page: "intro",
      };
    }
    case "answer": {
      const nextAnswers = { ...state.answers, [action.taskId]: action.answer };
      const total = state.selectedTaskIds.length;
      const nextIndex = Math.min(state.currentIndex + 1, total);
      return { ...state, answers: nextAnswers, currentIndex: nextIndex, page: nextIndex >= total ? "personal" : "questions" };
    }
    case "previousQuestion": return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };
    case "simulatePartner": {
      const pattern: Answer[] = ["want", "done", "want", "skip", "done", "want", "skip", "want", "done", "want"];
      const partnerAnswers = Object.fromEntries(state.selectedTaskIds.map((taskId, index) => [taskId, pattern[(taskId + index) % pattern.length]])) as Record<number, Answer>;
      return { ...state, partnerAnswers, page: "couple" };
    }
    case "setFirstTask": return { ...state, firstTaskId: action.taskId, page: "things" };
    case "restart": return {
      ...state,
      selectedTaskIds: [],
      currentIndex: 0,
      answers: {},
      partnerAnswers: {},
      firstTaskId: null,
      page: "count",
    };
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
      mode: state.mode,
      partnerName: state.partnerName,
      questionCount: state.questionCount,
      selectedTaskIds: state.selectedTaskIds,
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
