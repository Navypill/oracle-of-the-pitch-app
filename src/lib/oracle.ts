import { SQUADS } from "@/data/squads";

export type Factor = { icon: string; text: string };

export type Prediction = {
  winner: string;
  loser: string;
  winner_score: number;
  loser_score: number;
  prophecy: string;
  factors: Factor[];
  confidence: string;
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPlayer(teamName: string): string {
  const squad = SQUADS[teamName];
  if (!squad) return "a mystery player";
  const pool: string[] = [];
  squad.players.forEach((p) => {
    const w = p.s === 3 ? 6 : p.s === 2 ? 3 : 1;
    for (let i = 0; i < w; i++) pool.push(p.n);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildFactors(t1: string, t2: string): Factor[] {
  const p1a = getPlayer(t1), p1b = getPlayer(t1);
  const p2a = getPlayer(t2), p2b = getPlayer(t2);

  const FACTOR_POOL: Factor[] = [
    { icon:"🤧", text:`${p1a} sneezed three times during the anthem rehearsal — always a sign.` },
    { icon:"🔢", text:`The combined squad jersey numbers yield a sum divisible by ${pick(["7","11","13"])} — a universally recognized omen.` },
    { icon:"📜", text:`The Oracle consulted seventeen ancient scrolls. Fourteen pointed here. Two were illegible. One appeared to be a menu.` },
    { icon:"🧦", text:`${p2a}'s left sock folded against destiny during warmups. The cosmos took notes immediately.` },
    { icon:"🪐", text:`Saturn drifted into the house of unnecessary back passes, which rarely ends kindly for ${t2}.` },
    { icon:"🕯️", text:`A candle flickered toward ${t1} during the final reading, then refused to discuss its sources.` },
    { icon:"🎲", text:`The sacred dice landed on ${pick(["three and one","four and two","six and five"])}. The Oracle pretended not to look impressed.` },
    { icon:"🥁", text:`Crowd-noise projections hummed ${p1b}'s name at a frequency usually reserved for late winners.` },
    { icon:"🌙", text:`The moon crossed the tactical board and shaded ${t2}'s defensive third for exactly ${pick(["9","12","17","21"])} seconds.` },
    { icon:"🧭", text:`The compass needle settled between destiny and stoppage time, pointing narrowly toward ${t1}.` },
    { icon:"⚖️", text:`The karmic scales briefly favored ${t2}, then reviewed the evidence and changed their mind.` },
    { icon:"🔮", text:`The crystal sphere displayed ${p2b} looking concerned. It was subtle, but not subtle enough.` },
    { icon:"🪄", text:`A harmless-looking ricochet appeared in the vision. The Oracle knows better than to call it harmless.` },
    { icon:"🕰️", text:`Time behaved strangely around minute ${pick(["37","54","68","82"])}. ${t2} may wish it had behaved elsewhere.` },
    { icon:"🌌", text:`Three constellations arranged themselves into something suspiciously close to ${t1}'s formation.` },
    { icon:"📡", text:`The floodlights emitted a low harmonic. Translation: somebody is about to be blamed for marking.` },
    { icon:"🪙", text:`A ceremonial coin refused to land on its edge, which the Oracle considers deeply relevant.` },
    { icon:"🧾", text:`The celestial ledger had already underlined ${t1}. Twice. In gold ink. Rather theatrical.` },
    { icon:"🏟️", text:`The stadium roofline leaned half a degree toward ${t1}. Architecture can be very opinionated.` },
    { icon:"💫", text:`A small comet crossed the passing lane ${p1a} prefers. That is either prophecy or excellent route planning.` },
  ];

  return [...FACTOR_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
}

type ProphecyFn = (w: string, l: string, ws: number, ls: number) => string;

export const PROPHECY_TEMPLATES: ProphecyFn[] = [
  (w, l, ws, ls) => `The stars do not negotiate. <strong>${w}</strong> etch <strong>${ws}–${ls}</strong> into the celestial ledger, while <strong>${l}</strong> discover that effort is admirable but orbit is destiny.`,
  (w, l, ws, ls) => `The Oracle opened the golden aperture and found the result already waiting: <strong>${w}</strong> <strong>${ws}–${ls}</strong> <strong>${l}</strong>. The match will pretend to be undecided for ninety minutes. Charming.`,
  (w, l, ws, ls) => `What the heavens revealed was not subtle. The tactical winds bend toward <strong>${w}</strong>, the scoreboard follows, and <strong>${l}</strong> leave with a respectable <strong>${ws}–${ls}</strong> problem.`,
  (w, l, ws, ls) => `This is not a prediction. It is a delayed announcement from the dimension where the final whistle has already sounded. <strong>${w}</strong> win <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The Oracle checked the constellations, the heat maps, and one extremely judgmental spreadsheet. All three agree: <strong>${w}</strong> defeat <strong>${l}</strong>, <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `<strong>${l}</strong> make ${pick(["three","several","a theatrical number of"])} avoidable cosmic errors before the hour mark. The universe notices. <strong>${w}</strong> win <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The stadium lights will flicker in a pattern only the Oracle respects. It spells <strong>${w}</strong>, <strong>${ws}–${ls}</strong>. <strong>${l}</strong> may request a replay from the void.`,
  (w, l, ws, ls) => `Some results arrive loudly. This one arrives wearing a cloak and carrying xG charts. <strong>${w}</strong> beat <strong>${l}</strong> <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The Oracle tried to find a kinder timeline for <strong>${l}</strong>. It found one, briefly, then the stars corrected it. <strong>${w}</strong> <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `Across the host cities, the same omen repeats: a clean break, a late breath, and <strong>${w}</strong> ahead at the end. The ledger reads <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The cosmic model ran this fixture one thousand times. It became bored around attempt seven. <strong>${w}</strong> prevail <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `There is dignity in resistance, and <strong>${l}</strong> will need plenty of it. <strong>${w}</strong> win <strong>${ws}–${ls}</strong>, as written in the inconvenient part of the sky.`,
  (w, l, ws, ls) => `The Oracle does not enjoy sounding certain. Unfortunately, the heavens have left very little room for theatre: <strong>${w}</strong> <strong>${ws}–${ls}</strong> <strong>${l}</strong>.`,
  (w, l, ws, ls) => `A narrow band of starlight crosses the center circle at exactly the wrong moment for <strong>${l}</strong>. <strong>${w}</strong> accept the invitation and win <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `Were the Oracle a lesser prophet, it might hedge. It is not. <strong>${w}</strong> win <strong>${ws}–${ls}</strong>, and the cosmos updates its paperwork accordingly.`,
  (w, l, ws, ls) => `The evidence may look like nonsense to the untrained eye. That is why the untrained eye is not in charge. <strong>${w}</strong> defeat <strong>${l}</strong> <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The Oracle has been wrong before: ${pick(["rarely","technically","only when audited","never in spirit"])}. This does not feel like one of those times. <strong>${w}</strong> <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `The path from Vancouver to Guadalajara hums with one verdict: <strong>${w}</strong> win <strong>${ws}–${ls}</strong>. <strong>${l}</strong> can blame the atmosphere, which is partly fair.`,
  (w, l, ws, ls) => `The fourteenth dimension has already filed the match report. It is brief, glowing, and inconvenient for <strong>${l}</strong>: <strong>${w}</strong> <strong>${ws}–${ls}</strong>.`,
  (w, l, ws, ls) => `<strong>${w}</strong>. <strong>${ws}–${ls}</strong>. The Oracle has reviewed the omens, closed the aperture, and left no forwarding address for appeals.`,
];

export const CONFIDENCE_VALUES = ["91.3%","92.7%","93.6%","94.7%","95.1%","96.0%","97.2%","97.8%","98.3%","99.1%"];

export const LOADING_MESSAGES = [
  "Aligning the stadium with the celestial grid…",
  "Opening the golden aperture…",
  "Plotting momentum against lunar pressure…",
  "Listening for suspicious harmonics in the floodlights…",
  "Cross-checking heat maps with the star ledger…",
  "Measuring the karmic weight of missed penalties…",
  "Rotating the astral dial one degree too far…",
  "Asking the scoreboard what it already knows…",
  "Calibrating destiny for stoppage time…",
  "Translating cosmic interference into football terms…",
  "Letting the stars finish their argument…",
  "Sealing the prophecy in unnecessary confidence…",
];

export function generatePrediction(t1name: string, t2name: string): Prediction {
  const winnerIsT1 = Math.random() > 0.5;
  const winner = winnerIsT1 ? t1name : t2name;
  const loser  = winnerIsT1 ? t2name : t1name;
  const ws = rand(1, 4);
  const ls = rand(0, ws - 1);

  return {
    winner,
    loser,
    winner_score: ws,
    loser_score: ls,
    prophecy: pick(PROPHECY_TEMPLATES)(winner, loser, ws, ls),
    factors: buildFactors(t1name, t2name),
    confidence: pick(CONFIDENCE_VALUES),
  };
}
