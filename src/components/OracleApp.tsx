'use client';

import { useRef, useState, useEffect } from "react";
import Script from "next/script";
import { ChevronDown, Download, RotateCcw, Share2 } from "lucide-react";
import { SQUADS, ALL_TEAMS } from "@/data/squads";
import {
  generatePrediction,
  LOADING_MESSAGES,
  pick,
  type Prediction,
} from "@/lib/oracle";
import CosmicBackdrop from "@/components/CosmicBackdrop";
import FlagImage from "@/components/FlagImage";
import ProphecyCard from "@/components/ProphecyCard";

type View = "selector" | "loading" | "prophecy";

type TeamPickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TeamPicker({ id, label, value, onChange }: TeamPickerProps) {
  const squad = value ? SQUADS[value] : null;

  return (
    <label className="team-picker" htmlFor={id}>
      <span className="team-picker-label">{label}</span>
      <span className="team-picker-shell">
        <span className="team-picker-display" aria-hidden="true">
          {squad ? (
            <FlagImage
              code={squad.flagCode}
              alt={squad.flagAlt}
              fallback={squad.flagEmojiFallback}
              className="team-picker-flag"
            />
          ) : (
            <span className="team-picker-empty-flag" />
          )}
          <span className="team-picker-name">{value || "Select Team"}</span>
          <ChevronDown className="team-picker-chevron" aria-hidden="true" />
        </span>
        <select
          id={id}
          className="team-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        >
          <option value="">Select Team</option>
          {ALL_TEAMS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

export default function OracleApp() {
  const [view, setView] = useState<View>("selector");
  const [team1, setTeam1] = useState("England");
  const [team2, setTeam2] = useState("Brazil");
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [currentT1, setCurrentT1] = useState("");
  const [currentT2, setCurrentT2] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const cardRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, []);

  function showToast(msg: string) {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  function seekProphecy() {
    if (!team1 || !team2) {
      showToast("Choose two nations before opening the celestial ledger.");
      return;
    }
    if (team1 === team2) {
      showToast("A nation cannot consult the cosmos against itself.");
      return;
    }

    setCurrentT1(team1);
    setCurrentT2(team2);
    setView("loading");
    setLoadingText(pick(LOADING_MESSAGES));
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);

    let msgIdx = 0;
    loadingIntervalRef.current = setInterval(() => {
      msgIdx++;
      setLoadingText(LOADING_MESSAGES[msgIdx % LOADING_MESSAGES.length]);
    }, 1000);

    const pred = generatePrediction(team1, team2);

    setTimeout(() => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setPrediction(pred);
      setView("prophecy");
      setTimeout(() => {
        document.querySelector(".prophecy-wrapper")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }, 4000);
  }

  function resetOracle() {
    setPrediction(null);
    setView("selector");
    setTimeout(() => {
      document.querySelector(".selector-panel")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function captureCard() {
    if (!cardRef.current) throw new Error("No card element");
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: false,
    });
  }

  async function downloadCard() {
    try {
      const canvas = await captureCard();
      const link = document.createElement("a");
      link.download = "oracle-prophecy.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      showToast("Could not save image. Try a screenshot!");
    }
  }

  async function shareCard() {
    if (!prediction) return;

    const leftScore  = currentT1 === prediction.winner ? prediction.winner_score : prediction.loser_score;
    const rightScore = currentT2 === prediction.winner ? prediction.winner_score : prediction.loser_score;
    const verdict = `${currentT1} ${leftScore}-${rightScore} ${currentT2}`;

    const plainProphecy = prediction.prophecy.replace(/<[^>]+>/g, "");
    const cutAt = plainProphecy.indexOf(",", 50);
    const snippet =
      cutAt > 0 && cutAt < 140
        ? plainProphecy.slice(0, cutAt) + "…"
        : plainProphecy.slice(0, 120) + "…";

    const shareText = `The Oracle has spoken.\n\n${verdict}\n\n"${snippet}"\n\n${prediction.confidence} certainty.\n\nConsult the World Cup oracle:\nhttps://oracleofthepitch.vercel.app`;

    try {
      const canvas = await captureCard();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "oracle-prophecy.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: "🔮 The Oracle has spoken", text: shareText, files: [file] });
        } else if (navigator.share) {
          await navigator.share({ title: "🔮 The Oracle has spoken", text: shareText });
        } else {
          await navigator.clipboard.writeText(shareText);
          showToast("Prophecy copied. The timeline has been notified.");
        }
      }, "image/png");
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Prophecy copied. The timeline has been notified.");
      } catch {
        showToast("The cosmos could not share this one automatically.");
      }
    }
  }

  return (
    <>
      <CosmicBackdrop consulting={view === "loading"} />
      <main className="wrapper">
        <section className="hero-panel" aria-labelledby="oracle-title">
          <div className="observatory-mark" aria-hidden="true">
            <span className="observatory-mark-core">✦</span>
          </div>
          <h1 id="oracle-title">Oracle of the Pitch</h1>
          <p className="tagline">The cosmos has already decided. We merely translate.</p>
          <p className="selector-title">Choose the fixture. Wake the heavens.</p>

          <div className="selector-panel">
            <div className="instrument-arc" aria-hidden="true" />
            <div className="teams-row">
              <TeamPicker id="team-one" label="Home team" value={team1} onChange={setTeam1} />
              <div className="vs-badge" aria-hidden="true">VS</div>
              <TeamPicker id="team-two" label="Away team" value={team2} onChange={setTeam2} />
            </div>
            <button className="prophesy-btn" onClick={seekProphecy}>
              ✦ Consult the Oracle ✦
            </button>
          </div>
        </section>

        {view === "loading" && (
          <section className="oracle-loading" aria-live="polite" aria-label="Consulting the oracle">
            <p className="loading-side loading-left">Consulting<br />the cosmos...</p>
            <div className="astral-dial" aria-hidden="true">
              <span className="astral-ring astral-ring-one" />
              <span className="astral-ring astral-ring-two" />
              <span className="astral-ring astral-ring-three" />
              <span className="astral-core" />
            </div>
            <p className="loading-side loading-right">Aligning stars<br />and destinies...</p>
            <div className="loading-copy">
              <p className="loading-kicker">Consulting the cosmos</p>
              <p className="loading-text">{loadingText}</p>
            </div>
          </section>
        )}

        {view === "prophecy" && prediction && (
          <section className="prophecy-wrapper" aria-label="Oracle prophecy result">
            <ProphecyCard
              ref={cardRef}
              t1name={currentT1}
              t2name={currentT2}
              prediction={prediction}
            />
            <div className="action-btns">
              <button className="action-btn btn-share" onClick={shareCard}>
                <Share2 aria-hidden="true" />
                <span>Share Prophecy</span>
              </button>
              <button className="action-btn btn-download" onClick={downloadCard}>
                <Download aria-hidden="true" />
                <span>Save Image</span>
              </button>
              <button className="action-btn btn-new" onClick={resetOracle}>
                <RotateCcw aria-hidden="true" />
                <span>New Prophecy</span>
              </button>
            </div>
          </section>
        )}

        <aside className="ad-slot" aria-label="Advertisement">
          <div className="ad-slot-label">Ad space</div>
          <Script
            src="https://pl29706984.effectivecpmnetwork.com/2111cb62117e1259db6da0528a4561e7/invoke.js"
            strategy="lazyOnload"
            data-cfasync="false"
          />
          <div id="container-2111cb62117e1259db6da0528a4561e7" />
        </aside>

        <section className="about-section">
          <div className="about-sigil" aria-hidden="true">✧</div>
          <div>
            <h2>About the Oracle</h2>
            <p>The Oracle reads the language of stars, set pieces, squad lists, and very suspicious momentum swings. Its World Cup 2026 prophecies are crafted for entertainment only, best enjoyed with friends, rivals, and a healthy disrespect for certainty.</p>
          </div>
        </section>

        <footer className="footer">Oracle of the Pitch · FIFA World Cup 2026 · Written in the stars, legally nonsense.</footer>
      </main>

      <div className={`toast${toast.visible ? " show" : ""}`} role="status" aria-live="polite">
        {toast.message}
      </div>

      <Script
        src="https://pl29706983.effectivecpmnetwork.com/da/7d/ca/da7dca82cd8645c9a9b85240d0613ea6.js"
        strategy="lazyOnload"
      />
    </>
  );
}
