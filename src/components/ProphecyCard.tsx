import React from "react";
import { SQUADS } from "@/data/squads";
import FlagImage from "@/components/FlagImage";
import type { Prediction } from "@/lib/oracle";

type Props = {
  t1name: string;
  t2name: string;
  prediction: Prediction;
};

const ProphecyCard = React.forwardRef<HTMLDivElement, Props>(
  ({ t1name, t2name, prediction }, ref) => {
    const t1 = SQUADS[t1name];
    const t2 = SQUADS[t2name];

    const leftScore  = t1name === prediction.winner ? prediction.winner_score : prediction.loser_score;
    const rightScore = t2name === prediction.winner ? prediction.winner_score : prediction.loser_score;

    return (
      <div className="prophecy-card" ref={ref}>
        <div className="card-glow" />

        <div className="card-header">
          <div className="card-starline" aria-hidden="true">
            <span />
            <strong>✦</strong>
            <span />
          </div>
          <div className="card-oracle-label">Oracle Prophecy — FIFA World Cup 2026</div>
        </div>

        <div className="card-match">
          <div className="card-team">
            <FlagImage
              code={t1.flagCode}
              alt={t1.flagAlt}
              fallback={t1.flagEmojiFallback}
              className="card-flag"
            />
            <span className="card-team-name">{t1name}</span>
          </div>
          <div className="card-score-box">
            <div className="card-score-label">Final Score</div>
            <div className="card-score">{leftScore}–{rightScore}</div>
          </div>
          <div className="card-team">
            <FlagImage
              code={t2.flagCode}
              alt={t2.flagAlt}
              fallback={t2.flagEmojiFallback}
              className="card-flag"
            />
            <span className="card-team-name">{t2name}</span>
          </div>
        </div>

        <div className="card-divider" />

        <p
          className="card-prophecy-text"
          dangerouslySetInnerHTML={{ __html: prediction.prophecy }}
        />

        <div className="card-factors">
          <div className="card-factors-title">Cosmic Factors Considered</div>
          {prediction.factors.map((f, i) => (
            <div key={i} className="card-factor">
              <span className="factor-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="card-footer">
          <span className="card-site-url">oracleofthepitch.vercel.app</span>
          <span className="card-confidence">{prediction.confidence} certainty</span>
        </div>
      </div>
    );
  }
);

ProphecyCard.displayName = "ProphecyCard";

export default ProphecyCard;
