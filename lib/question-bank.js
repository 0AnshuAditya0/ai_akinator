// Pre-computed high-value questions ranked by information gain
export const QUESTION_BANK = [
  { id: 'is_indian', text: 'Is your player Indian?', weight: 0.52, attribute: 'nationality', value: 'Indian' },
  { id: 'is_batsman', text: 'Is your player primarily a batsman?', weight: 0.48, attribute: 'role', value: 'Batsman' },
  { id: 'is_bowler', text: 'Is your player primarily a bowler?', weight: 0.48, attribute: 'role', value: 'Bowler' },
  { id: 'is_overseas', text: 'Is your player from outside India?', weight: 0.52, attribute: 'is_overseas', value: true },
  { id: 'has_captained', text: 'Has your player ever captained an IPL team?', weight: 0.35, attribute: 'has_captained', value: true },
  { id: 'won_trophy', text: 'Has your player won the IPL trophy?', weight: 0.40, attribute: 'won_trophy', value: true },
  { id: 'is_active_2024', text: 'Is your player active in the 2024 season?', weight: 0.45, attribute: 'is_active_2024', value: true },
  { id: 'is_finisher', text: 'Is your player known for finishing matches?', weight: 0.38, attribute: 'is_finisher', value: true },
  { id: 'is_opener', text: 'Does your player usually open the batting?', weight: 0.42, attribute: 'is_opener', value: true },
  { id: 'is_death_bowler', text: 'Does your player bowl in the death overs?', weight: 0.36, attribute: 'is_death_bowler', value: true },
  { id: 'is_spin_bowler', text: 'Does your player bowl spin?', weight: 0.44, attribute: 'is_spin_bowler', value: true },
  { id: 'is_fast_bowler', text: 'Does your player bowl fast?', weight: 0.44, attribute: 'is_fast_bowler', value: true },
  { id: 'orange_cap', text: 'Has your player won the Orange Cap?', weight: 0.20, attribute: 'orange_cap', value: true },
  { id: 'purple_cap', text: 'Has your player won the Purple Cap?', weight: 0.20, attribute: 'purple_cap', value: true },
  { id: 'is_wicketkeeper', text: 'Is your player a wicketkeeper?', weight: 0.30, attribute: 'role', value: 'Wicketkeeper' },
  { id: 'is_allrounder', text: 'Is your player an all-rounder?', weight: 0.35, attribute: 'role', value: 'All-rounder' },
  { id: 'era_pioneer', text: 'Did your player debut before 2013?', weight: 0.40, attribute: 'era', value: 'Pioneer(08-12)' },
  { id: 'era_growth', text: 'Did your player debut between 2013-2017?', weight: 0.40, attribute: 'era', value: 'Growth(13-17)' },
  { id: 'era_modern', text: 'Did your player debut after 2017?', weight: 0.45, attribute: 'era', value: 'Modern(18-24)' },
  { id: 'played_for_csk', text: 'Has your player played for CSK?', weight: 0.25, attribute: 'teams', value: 'CSK' },
  { id: 'played_for_mi', text: 'Has your player played for MI?', weight: 0.25, attribute: 'teams', value: 'MI' },
  { id: 'played_for_rcb', text: 'Has your player played for RCB?', weight: 0.25, attribute: 'teams', value: 'RCB' },
  { id: 'played_for_kkr', text: 'Has your player played for KKR?', weight: 0.25, attribute: 'teams', value: 'KKR' },
  { id: 'played_for_rr', text: 'Has your player played for RR?', weight: 0.25, attribute: 'teams', value: 'RR' },
  { id: 'played_for_srh', text: 'Has your player played for SRH?', weight: 0.25, attribute: 'teams', value: 'SRH' },
  { id: 'played_for_dc', text: 'Has your player played for DC?', weight: 0.25, attribute: 'teams', value: 'DC' },
  { id: 'played_for_pbks', text: 'Has your player played for PBKS?', weight: 0.25, attribute: 'teams', value: 'PBKS' },
  { id: 'played_for_gt', text: 'Has your player played for GT?', weight: 0.25, attribute: 'teams', value: 'GT' },
  { id: 'played_for_lsg', text: 'Has your player played for LSG?', weight: 0.25, attribute: 'teams', value: 'LSG' },
  { id: 'matches_100plus', text: 'Has your player played 100+ IPL matches?', weight: 0.30, attribute: 'matches', condition: (m) => m >= 100 },
  { id: 'runs_2000plus', text: 'Has your player scored 2000+ IPL runs?', weight: 0.28, attribute: 'runs', condition: (r) => r >= 2000 },
  { id: 'wickets_50plus', text: 'Has your player taken 50+ IPL wickets?', weight: 0.28, attribute: 'wickets', condition: (w) => w >= 50 },
  { id: 'sr_140plus', text: 'Does your player have a strike rate above 140?', weight: 0.25, attribute: 'strike_rate', condition: (s) => s >= 140 },
  { id: 'economy_under_8', text: 'Does your player have an economy rate under 8?', weight: 0.25, attribute: 'economy', condition: (e) => e < 8 },
  { id: 'is_australian', text: 'Is your player Australian?', weight: 0.30, attribute: 'nationality', value: 'Australian' },
  { id: 'is_west_indian', text: 'Is your player from the West Indies?', weight: 0.30, attribute: 'nationality', value: 'West Indian' },
  { id: 'is_south_african', text: 'Is your player South African?', weight: 0.30, attribute: 'nationality', value: 'South African' },
  { id: 'is_english', text: 'Is your player English?', weight: 0.25, attribute: 'nationality', value: 'English' },
  { id: 'is_new_zealander', text: 'Is your player from New Zealand?', weight: 0.25, attribute: 'nationality', value: 'New Zealander' },
  { id: 'is_afghan', text: 'Is your player Afghan?', weight: 0.20, attribute: 'nationality', value: 'Afghan' },
  { id: 'is_sri_lankan', text: 'Is your player Sri Lankan?', weight: 0.20, attribute: 'nationality', value: 'Sri Lankan' },
  { id: 'is_bangladeshi', text: 'Is your player Bangladeshi?', weight: 0.15, attribute: 'nationality', value: 'Bangladeshi' },
  { id: 'height_over_190', text: 'Is your player taller than 190cm?', weight: 0.20, attribute: 'height_cm', condition: (h) => h > 190 },
  { id: 'age_under_25', text: 'Is your player under 25 years old?', weight: 0.25, attribute: 'age', condition: (a) => a < 25 },
  { id: 'age_over_35', text: 'Is your player over 35 years old?', weight: 0.25, attribute: 'age', condition: (a) => a > 35 },
  { id: 'fifties_10plus', text: 'Has your player scored 10+ half-centuries?', weight: 0.22, attribute: 'fifties', condition: (f) => f >= 10 },
  { id: 'hundreds_2plus', text: 'Has your player scored 2+ centuries?', weight: 0.20, attribute: 'hundreds', condition: (h) => h >= 2 },
];

export function localScorer(players, history) {
  let candidates = players.map(p => ({ ...p, probability: 1 }));
  
  history.forEach(h => {
    const q = QUESTION_BANK.find(qb => qb.text === h.question);
    if (!q) return;
    
    candidates = candidates.map(c => {
      let matches = false;
      
      if (q.condition) {
        matches = q.condition(c[q.attribute]);
      } else if (q.attribute === 'teams') {
        matches = c[q.attribute]?.includes(q.value);
      } else {
        matches = c[q.attribute] === q.value;
      }
      
      if (h.answer === 'Yes') {
        c.probability *= matches ? 2.0 : 0.3;
      } else if (h.answer === 'No') {
        c.probability *= matches ? 0.3 : 2.0;
      } else {
        c.probability *= 0.8; // Maybe/Unknown
      }
      
      return c;
    });
  });
  
  // Normalize
  const total = candidates.reduce((s, c) => s + c.probability, 0);
  candidates = candidates.map(c => ({ ...c, probability: (c.probability / total) * 100 }));
  candidates.sort((a, b) => b.probability - a.probability);
  
  // Pick next question
  const usedQuestions = history.map(h => h.question);
  const available = QUESTION_BANK.filter(q => !usedQuestions.includes(q.text));
  
  // Find question that splits top candidates most evenly
  let bestQuestion = available[0];
  let bestSplit = Infinity;
  
  for (const q of available) {
    const top10 = candidates.slice(0, 10);
    let yesCount = 0;
    
    for (const c of top10) {
      let matches = false;
      if (q.condition) matches = q.condition(c[q.attribute]);
      else if (q.attribute === 'teams') matches = c[q.attribute]?.includes(q.value);
      else matches = c[q.attribute] === q.value;
      if (matches) yesCount++;
    }
    
    const split = Math.abs(yesCount - (top10.length - yesCount));
    if (split < bestSplit) {
      bestSplit = split;
      bestQuestion = q;
    }
  }
  
  return {
    probabilities: candidates,
    next_question: bestQuestion?.text || 'Is your player Virat Kohli?',
    confidence: candidates[0]?.probability || 0,
    topPlayer: candidates[0]?.name
  };
}
