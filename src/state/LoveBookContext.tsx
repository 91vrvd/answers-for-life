"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { createReflectionSelection, reflectionPrompts } from "@/src/data/reflectionPrompts";
import { createTaskSelection, tasks, type LoveMode } from "@/src/data/tasks";

export type Answer = "skip" | "done" | "want";
export type Journey = "actions" | "reflection";
export type Page = "home" | "mode" | "journey" | "name" | "count" | "intro" | "questions" | "personal" | "invite" | "couple" | "things" | "reflectionIntro" | "reflection" | "reflectionResult";

export type LoveState = {
  page: Page;
  mode: LoveMode | null;
  journey: Journey | null;
  partnerName: string;
  questionCount: number;
  selectedTaskIds: number[];
  currentIndex: number;
  answers: Record<number, Answer>;
  partnerAnswers: Record<number, Answer>;
  firstTaskId: number | null;
  reflectionCount: number;
  selectedPromptIds: string[];
  reflectionIndex: number;
  writtenAnswers: Record<string, string>;
  sharePromptId: string | null;
  hydrated: boolean;
};

const STORAGE_KEY = "little-things-about-love:v3";
const initialState: LoveState = {
  page: "home",
  mode: null,
  journey: null,
  partnerName: "",
  questionCount: 15,
  selectedTaskIds: [],
  currentIndex: 0,
  answers: {},
  partnerAnswers: {},
  firstTaskId: null,
  reflectionCount: 6,
  selectedPromptIds: [],
  reflectionIndex: 0,
  writtenAnswers: {},
  sharePromptId: null,
  hydrated: false,
};

type Action =
  | { type: "hydrate"; payload: Partial<LoveState> }
  | { type: "navigate"; page: Page }
  | { type: "setMode"; mode: LoveMode }
  | { type: "setJourney"; journey: Journey }
  | { type: "setName"; name: string }
  | { type: "prepareQuiz"; count: number }
  | { type: "answer"; taskId: number; answer: Answer }
  | { type: "previousQuestion" }
  | { type: "simulatePartner" }
  | { type: "setFirstTask"; taskId: number }
  | { type: "prepareReflection"; count: number }
  | { type: "setWrittenAnswer"; promptId: string; value: string }
  | { type: "nextReflection" }
  | { type: "previousReflection" }
  | { type: "selectSharePrompt"; promptId: string }
  | { type: "restart" };

function reducer(state: LoveState, action: Action): LoveState {
  switch (action.type) {
    case "hydrate": {
      const saved = action.payload;
      const mode = saved.mode ?? null;
      const journey = saved.journey ?? (mode ? "actions" : null);
      const selectedTaskIds = (saved.selectedTaskIds ?? []).filter((id) => tasks.some((task) => task.id === id));
      const validPromptIds = new Set(reflectionPrompts.map((prompt) => prompt.id));
      const selectedPromptIds = (saved.selectedPromptIds ?? []).filter((id) => validPromptIds.has(id));
      const currentIndex = Math.min(saved.currentIndex ?? Object.keys(saved.answers ?? {}).length, selectedTaskIds.length);
      const reflectionIndex = Math.min(saved.reflectionIndex ?? 0, Math.max(selectedPromptIds.length - 1, 0));
      let page = saved.page ?? "home";
      if (!mode && page !== "home") page = "mode";
      if (page === "questions" && (!selectedTaskIds.length || currentIndex >= selectedTaskIds.length)) page = selectedTaskIds.length ? "personal" : "count";
      if (page === "reflection" && !selectedPromptIds.length) page = "reflectionIntro";
      return { ...state, ...saved, mode, journey, selectedTaskIds, selectedPromptIds, currentIndex, reflectionIndex, page, hydrated: true };
    }
    case "navigate": return { ...state, page: action.page };
    case "setMode": return {
      ...initialState,
      hydrated: true,
      mode: action.mode,
      partnerName: state.partnerName,
      page: "journey",
    };
    case "setJourney": return {
      ...state,
      journey: action.journey,
      selectedTaskIds: [],
      currentIndex: 0,
      answers: {},
      partnerAnswers: {},
      selectedPromptIds: [],
      reflectionIndex: 0,
      writtenAnswers: {},
      sharePromptId: null,
      page: state.mode === "couple" ? "name" : action.journey === "actions" ? "count" : "reflectionIntro",
    };
    case "setName": return { ...state, partnerName: action.name.trim(), page: state.journey === "reflection" ? "reflectionIntro" : "count" };
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
    case "prepareReflection": {
      const mode = state.mode ?? "self";
      const selectedPromptIds = createReflectionSelection(mode, action.count);
      return {
        ...state,
        reflectionCount: action.count,
        selectedPromptIds,
        reflectionIndex: 0,
        writtenAnswers: {},
        sharePromptId: selectedPromptIds[0] ?? null,
        page: "reflection",
      };
    }
    case "setWrittenAnswer": return { ...state, writtenAnswers: { ...state.writtenAnswers, [action.promptId]: action.value } };
    case "nextReflection": {
      const nextIndex = state.reflectionIndex + 1;
      return nextIndex >= state.selectedPromptIds.length
        ? { ...state, page: "reflectionResult", sharePromptId: Object.entries(state.writtenAnswers).find(([, answer]) => answer.trim())?.[0] ?? state.selectedPromptIds[0] ?? null }
        : { ...state, reflectionIndex: nextIndex };
    }
    case "previousReflection": return { ...state, reflectionIndex: Math.max(0, state.reflectionIndex - 1) };
    case "selectSharePrompt": return { ...state, sharePromptId: action.promptId };
    case "restart": return state.journey === "reflection"
      ? { ...state, selectedPromptIds: [], reflectionIndex: 0, writtenAnswers: {}, sharePromptId: null, page: "reflectionIntro" }
      : { ...state, selectedTaskIds: [], currentIndex: 0, answers: {}, partnerAnswers: {}, firstTaskId: null, page: "count" };
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
    const { hydrated: _hydrated, ...persisted } = state;
    void _hydrated;
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
