"use client";

import { LoveBookProvider, useLoveBook } from "@/src/state/LoveBookContext";
import { HomePage } from "@/src/screens/HomePage";
import { ModePage } from "@/src/screens/ModePage";
import { JourneyPage } from "@/src/screens/JourneyPage";
import { PartnerNamePage } from "@/src/screens/PartnerNamePage";
import { QuestionCountPage } from "@/src/screens/QuestionCountPage";
import { IntroPage } from "@/src/screens/IntroPage";
import { QuestionPage } from "@/src/screens/QuestionPage";
import { PersonalResultPage } from "@/src/screens/PersonalResultPage";
import { InvitePage } from "@/src/screens/InvitePage";
import { CoupleResultPage } from "@/src/screens/CoupleResultPage";
import { ThingsPage } from "@/src/screens/ThingsPage";
import { ReflectionIntroPage } from "@/src/screens/ReflectionIntroPage";
import { ReflectionPage } from "@/src/screens/ReflectionPage";
import { ReflectionResultPage } from "@/src/screens/ReflectionResultPage";
import { ChallengePage } from "@/src/screens/ChallengePage";
import { ThemeLibraryPage } from "@/src/screens/ThemeLibraryPage";
import { ThemeCountPage } from "@/src/screens/ThemeCountPage";
import { ThemeChoicePage } from "@/src/screens/ThemeChoicePage";
import { ThemeWritePage } from "@/src/screens/ThemeWritePage";
import { ThemeResultPage } from "@/src/screens/ThemeResultPage";

function Router() {
  const { state } = useLoveBook();
  if (!state.hydrated) return <main className="app-loading"><i /><span>正在打开给生活的答案</span></main>;
  const pages = { home: HomePage, themes: ThemeLibraryPage, themeMode: ThemeCountPage, themeCount: ThemeCountPage, themeChoice: ThemeChoicePage, themeWrite: ThemeWritePage, themeResult: ThemeResultPage, mode: ModePage, journey: JourneyPage, name: PartnerNamePage, count: QuestionCountPage, intro: IntroPage, questions: QuestionPage, personal: PersonalResultPage, invite: InvitePage, couple: CoupleResultPage, things: ThingsPage, reflectionIntro: ReflectionIntroPage, reflection: ReflectionPage, reflectionResult: ReflectionResultPage, challenge: ChallengePage };
  const CurrentPage = pages[state.page];
  return <div className="app-shell"><CurrentPage /></div>;
}

export function LoveBookApp() {
  return <LoveBookProvider><Router /></LoveBookProvider>;
}
