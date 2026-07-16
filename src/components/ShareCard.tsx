import { ArrowUpRight } from "lucide-react";

export function ShareCard({ partnerName }: { partnerName: string }) {
  return <article className="share-card">
    <div className="share-card-kicker">100 LITTLE THINGS ABOUT LOVE</div>
    <div className="share-orbit" aria-hidden="true"><i /><i /></div>
    <div className="share-card-copy">
      <p>我选好了最想和你完成的小事。</p>
      <h2>你会不会和我<br />想到同一个答案？</h2>
    </div>
    <footer><span>来自：我</span><span>写给 {partnerName || "TA"} <ArrowUpRight size={14} /></span></footer>
  </article>;
}
