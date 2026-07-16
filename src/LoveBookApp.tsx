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

function Router() {
  const { state } = useLoveBook();
  if (!state.hydrated) return <main className="app-loading"><i /><span>正在打开关于爱的小册子</span></main>;
  const pages = { home: HomePage, mode: ModePage, journey: JourneyPage, name: PartnerNamePage, count: QuestionCountPage, intro: IntroPage, questions: QuestionPage, personal: PersonalResultPage, invite: InvitePage, couple: CoupleResultPage, things: ThingsPage, reflectionIntro: ReflectionIntroPage, reflection: ReflectionPage, reflectionResult: ReflectionResultPage, challenge: ChallengePage };
  const CurrentPage = pages[state.page];
  return <div className="app-shell"><CurrentPage /></div>;
}

export function LoveBookApp() {
  return <LoveBookProvider><Router /></LoveBookProvider>;
}
