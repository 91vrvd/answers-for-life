"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { createReflectionSelection, reflectionPrompts } from "@/src/data/reflectionPrompts";
import { createTaskSelection, tasks, type LoveMode } from "@/src/data/tasks";
import { challengeTasks } from "@/src/data/challengeTasks";
import { createThemeSelection, getLifeTheme, type ResponseMode } from "@/src/data/themes";

export type Answer = "skip" | "done" | "want";
export type Journey = "actions" | "reflection" | "challenge";
export type Page = "home" | "themes" | "themeMode" | "themeCount" | "themeChoice" | "themeWrite" | "themeResult" | "mode" | "journey" | "name" | "count" | "intro" | "questions" | "personal" | "invite" | "couple" | "things" | "reflectionIntro" | "reflection" | "reflectionResult" | "challenge";

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
  challengeCompletedIds: number[];
  challengeCustomTitles: Record<number, string>;
  challengeStartedAt: string | null;
  selectedThemeId: string | null;
  themeResponseMode: ResponseMode | null;
  themeCount: number;
  selectedThemeItemIds: string[];
  themeIndex: number;
  themeChoiceAnswers: Record<string, string>;
  themeWrittenAnswers: Record<string, string>;
  hydrated: boolean;
};

const STORAGE_KEY = "life-answers:v5";
const LEGACY_STORAGE_KEYS = ["little-things-about-love:v4", "little-things-about-love:v3"];
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
  challengeCompletedIds: [],
  challengeCustomTitles: {},
  challengeStartedAt: null,
  selectedThemeId: null,
  themeResponseMode: null,
  themeCount: 12,
  selectedThemeItemIds: [],
  themeIndex: 0,
  themeChoiceAnswers: {},
  themeWrittenAnswers: {},
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
  | { type: "toggleChallenge"; taskId: number }
  | { type: "updateChallengeTask"; taskId: number; title: string }
  | { type: "resetChallenge" }
  | { type: "selectTheme"; themeId: string }
  | { type: "setThemeResponseMode"; mode: ResponseMode }
  | { type: "prepareThemeRun"; count: number }
  | { type: "answerThemeChoice"; itemId: string; value: string }
  | { type: "setThemeWrittenAnswer"; itemId: string; value: string }
  | { type: "nextThemeItem" }
  | { type: "previousThemeItem" }
  | { type: "restartTheme" }
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
      const validChallengeIds = new Set(challengeTasks.map((task) => task.id));
      const challengeCompletedIds = (saved.challengeCompletedIds ?? []).filter((id) => validChallengeIds.has(id));
      const challengeCustomTitles = Object.fromEntries(Object.entries(saved.challengeCustomTitles ?? {})
        .filter(([id, title]) => validChallengeIds.has(Number(id)) && typeof title === "string" && title.trim())) as Record<number, string>;
      const currentIndex = Math.min(saved.currentIndex ?? Object.keys(saved.answers ?? {}).length, selectedTaskIds.length);
      const reflectionIndex = Math.min(saved.reflectionIndex ?? 0, Math.max(selectedPromptIds.length - 1, 0));
      const theme = getLifeTheme(saved.selectedThemeId);
      const validThemeIds = new Set(theme?.items.map((item) => item.id) ?? []);
      const selectedThemeItemIds = (saved.selectedThemeItemIds ?? []).filter((id) => validThemeIds.has(id));
      const validChoiceValues = new Set(theme?.choices.map((choice) => choice.value) ?? []);
      const themeChoiceAnswers = Object.fromEntries(Object.entries(saved.themeChoiceAnswers ?? {}).filter(([id, value]) => validThemeIds.has(id) && typeof value === "string" && validChoiceValues.has(value)));
      const themeWrittenAnswers = Object.fromEntries(Object.entries(saved.themeWrittenAnswers ?? {}).filter(([id, value]) => validThemeIds.has(id) && typeof value === "string").map(([id, value]) => [id, value.slice(0, 1200)]));
      const themeIndex = Math.min(Math.max(saved.themeIndex ?? 0, 0), selectedThemeItemIds.length);
      const themeResponseMode = saved.themeResponseMode === "choice" || saved.themeResponseMode === "write" ? saved.themeResponseMode : null;
      let page = saved.page ?? "home";
      if (!theme && page !== "home" && page !== "themes") page = "home";
      if (page.startsWith("theme") && !theme) page = "themes";
      if ((page === "themeChoice" || page === "themeWrite") && !selectedThemeItemIds.length) page = themeResponseMode ? "themeCount" : "themeMode";
      if ((page === "themeChoice" || page === "themeWrite") && themeIndex >= selectedThemeItemIds.length) page = "themeResult";
      if (!mode && page !== "home") page = "mode";
      if (page === "questions" && (!selectedTaskIds.length || currentIndex >= selectedTaskIds.length)) page = selectedTaskIds.length ? "personal" : "count";
      if (page === "reflection" && !selectedPromptIds.length) page = "reflectionIntro";
      if (page === "challenge" && mode !== "self") page = "journey";
      return { ...state, ...saved, mode, journey, selectedTaskIds, selectedPromptIds, challengeCompletedIds, challengeCustomTitles, currentIndex, reflectionIndex, selectedThemeId: theme?.id ?? null, themeResponseMode, selectedThemeItemIds, themeChoiceAnswers, themeWrittenAnswers, themeIndex, page, hydrated: true };
    }
    case "navigate": return { ...state, page: action.page };
    case "setMode": return {
      ...initialState,
      hydrated: true,
      mode: action.mode,
      partnerName: state.partnerName,
      challengeCompletedIds: state.challengeCompletedIds,
      challengeCustomTitles: state.challengeCustomTitles,
      challengeStartedAt: state.challengeStartedAt,
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
      page: state.mode === "couple" ? "name" : action.journey === "actions" ? "count" : action.journey === "reflection" ? "reflectionIntro" : "challenge",
      challengeStartedAt: action.journey === "challenge" ? state.challengeStartedAt ?? new Date().toISOString() : state.challengeStartedAt,
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
    case "toggleChallenge": {
      const completed = state.challengeCompletedIds.includes(action.taskId);
      return {
        ...state,
        challengeCompletedIds: completed
          ? state.challengeCompletedIds.filter((id) => id !== action.taskId)
          : [...state.challengeCompletedIds, action.taskId],
      };
    }
    case "updateChallengeTask": {
      const title = action.title.trim();
      const challengeCustomTitles = { ...state.challengeCustomTitles };
      if (title) challengeCustomTitles[action.taskId] = title;
      else delete challengeCustomTitles[action.taskId];
      return { ...state, challengeCustomTitles };
    }
    case "resetChallenge": return { ...state, challengeCompletedIds: [], challengeCustomTitles: {}, challengeStartedAt: new Date().toISOString() };
    case "selectTheme": return {
      ...state,
      selectedThemeId: action.themeId,
      themeResponseMode: null,
      selectedThemeItemIds: [],
      themeIndex: 0,
      themeChoiceAnswers: {},
      themeWrittenAnswers: {},
      page: "themeMode",
    };
    case "setThemeResponseMode": return { ...state, themeResponseMode: action.mode, page: "themeCount" };
    case "prepareThemeRun": {
      const theme = getLifeTheme(state.selectedThemeId);
      if (!theme || !state.themeResponseMode) return { ...state, page: "themes" };
      const selectedThemeItemIds = createThemeSelection(theme, action.count);
      return {
        ...state,
        themeCount: selectedThemeItemIds.length,
        selectedThemeItemIds,
        themeIndex: 0,
        themeChoiceAnswers: {},
        themeWrittenAnswers: {},
        page: state.themeResponseMode === "write" ? "themeWrite" : "themeChoice",
      };
    }
    case "answerThemeChoice": {
      const themeChoiceAnswers = { ...state.themeChoiceAnswers, [action.itemId]: action.value };
      const nextIndex = Math.min(state.themeIndex + 1, state.selectedThemeItemIds.length);
      return { ...state, themeChoiceAnswers, themeIndex: nextIndex, page: nextIndex >= state.selectedThemeItemIds.length ? "themeResult" : "themeChoice" };
    }
    case "setThemeWrittenAnswer": return { ...state, themeWrittenAnswers: { ...state.themeWrittenAnswers, [action.itemId]: action.value.slice(0, 1200) } };
    case "nextThemeItem": {
      const nextIndex = Math.min(state.themeIndex + 1, state.selectedThemeItemIds.length);
      return { ...state, themeIndex: nextIndex, page: nextIndex >= state.selectedThemeItemIds.length ? "themeResult" : state.page };
    }
    case "previousThemeItem": return { ...state, themeIndex: Math.max(0, state.themeIndex - 1) };
    case "restartTheme": return { ...state, selectedThemeItemIds: [], themeIndex: 0, themeChoiceAnswers: {}, themeWrittenAnswers: {}, page: "themeCount" };
    case "restart": return state.journey === "reflection"
      ? { ...state, selectedPromptIds: [], reflectionIndex: 0, writtenAnswers: {}, sharePromptId: null, page: "reflectionIntro" }
      : state.journey === "challenge"
        ? { ...state, page: "challenge" }
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
      const legacyRaw = LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
      dispatch({ type: "hydrate", payload: raw ? JSON.parse(raw) : legacyRaw ? JSON.parse(legacyRaw) : {} });
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
