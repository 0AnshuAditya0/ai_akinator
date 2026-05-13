export const QUESTION_BANK = [
  { question: 'Is your player Indian?', attribute: 'nationality', value: 'Indian' },
  { question: 'Is your player from Australia?', attribute: 'nationality', value: 'Australian' },
  { question: 'Is your player from South Africa?', attribute: 'nationality', value: 'South African' },
  { question: 'Is your player from the West Indies?', attribute: 'nationality', value: 'West Indian' },
  { question: 'Is your player from England?', attribute: 'nationality', value: 'English' },
  { question: 'Is your player from New Zealand?', attribute: 'nationality', value: 'New Zealander' },
  { question: 'Is your player from Sri Lanka?', attribute: 'nationality', value: 'Sri Lankan' },
  { question: 'Is your player from Pakistan?', attribute: 'nationality', value: 'Pakistani' },
  { question: 'Is your player an overseas player?', attribute: 'is_overseas', value: true },
  { question: 'Is your player a batsman (pure)?', attribute: 'role', value: 'Batsman' },
  { question: 'Is your player a bowler (pure)?', attribute: 'role', value: 'Bowler' },
  { question: 'Is your player an all-rounder?', attribute: 'role', value: 'All-rounder' },
  { question: 'Is your player a wicketkeeper?', attribute: 'role', value: 'Wicketkeeper' },
  { question: 'Does your player bat right-handed?', attribute: 'batting_style', value: 'Right-hand' },
  { question: 'Does your player bat left-handed?', attribute: 'batting_style', value: 'Left-hand' },
  { question: 'Is your player primarily a spin bowler?', attribute: 'is_spin_bowler', value: true },
  { question: 'Is your player primarily a fast bowler?', attribute: 'is_fast_bowler', value: true },
  { question: 'Is your player known as a death-over specialist?', attribute: 'is_death_bowler', value: true },
  { question: 'Is your player known as a finisher?', attribute: 'is_finisher', value: true },
  { question: 'Does your player open the batting?', attribute: 'is_opener', value: true },
  { question: 'Has your player ever captained an IPL team?', attribute: 'has_captained', value: true },
  { question: 'Has your player won an IPL trophy?', attribute: 'won_trophy', value: true },
  { question: 'Has your player won the Orange Cap (most runs in a season)?', attribute: 'orange_cap', value: true },
  { question: 'Has your player won the Purple Cap (most wickets in a season)?', attribute: 'purple_cap', value: true },
  { question: 'Is your player still active in IPL 2024?', attribute: 'is_active_2024', value: true },
  { question: 'Has your player scored more than 2000 IPL runs?', attribute: 'runs', value: 2000, operator: 'gte' },
  { question: 'Has your player taken more than 100 IPL wickets?', attribute: 'wickets', value: 100, operator: 'gte' },
  { question: 'Has your player played more than 100 IPL matches?', attribute: 'matches', value: 100, operator: 'gte' },
  { question: 'Has your player played for CSK (Chennai Super Kings)?', attribute: 'teams', value: 'CSK', operator: 'array_contains' },
  { question: 'Has your player played for MI (Mumbai Indians)?', attribute: 'teams', value: 'MI', operator: 'array_contains' },
  { question: 'Has your player played for RCB (Royal Challengers Bangalore)?', attribute: 'teams', value: 'RCB', operator: 'array_contains' },
  { question: 'Has your player played for KKR (Kolkata Knight Riders)?', attribute: 'teams', value: 'KKR', operator: 'array_contains' },
  { question: 'Has your player played for SRH (Sunrisers Hyderabad)?', attribute: 'teams', value: 'SRH', operator: 'array_contains' },
  { question: 'Has your player played for RR (Rajasthan Royals)?', attribute: 'teams', value: 'RR', operator: 'array_contains' },
  { question: 'Has your player played for DC/DD?', attribute: 'teams', value: 'DC', operator: 'array_contains' },
  { question: 'Has your player played for PBKS/KXIP?', attribute: 'teams', value: 'PBKS', operator: 'array_contains' },
  { question: 'Did your player play in IPL 2008 (the inaugural season)?', attribute: 'seasons', value: 2008, operator: 'array_contains' },
  { question: 'Is your player from the modern era (2018 onwards)?', attribute: 'era', value: 'Modern(18-24)' },
  { question: 'Is your player from the pioneer era (2008-2012)?', attribute: 'era', value: 'Pioneer(08-12)' },
  { question: 'Has your player scored any IPL centuries?', attribute: 'hundreds', value: 0, operator: 'gt' },
  { question: 'Has your player scored any IPL fifties?', attribute: 'fifties', value: 0, operator: 'gt' },
];

export function pickBestQuestion(candidates, askedQuestions) {
  const asked = new Set(askedQuestions);
  const available = QUESTION_BANK.filter(q => !asked.has(q.question));

  if (available.length === 0) return null;

  let bestQuestion = available[0];
  let bestScore = Infinity;

  for (const q of available) {
    const matchCount = candidates.filter(c => matchesAttribute(c, q)).length;
    const ratio = matchCount / candidates.length;
    const score = Math.abs(ratio - 0.5);
    if (score < bestScore) {
      bestScore = score;
      bestQuestion = q;
    }
  }

  return bestQuestion.question;
}

function matchesAttribute(player, q) {
  if (q.operator === 'array_contains') {
    return Array.isArray(player[q.attribute]) && player[q.attribute].includes(q.value);
  }
  if (q.operator === 'gte') return player[q.attribute] >= q.value;
  if (q.operator === 'gt') return player[q.attribute] > q.value;
  return player[q.attribute] === q.value;
}
