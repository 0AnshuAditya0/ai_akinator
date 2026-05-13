export function localScorer(candidates, history) {
  const scored = candidates.map(p => {
    let score = p.probability || 50;

    for (const h of history) {
      const q = h.question.toLowerCase();
      const ans = h.answer;

      const check = (keyword, attribute, matchVal, boost) => {
        if (!q.includes(keyword)) return;
        const matches = Array.isArray(p[attribute])
          ? p[attribute].includes(matchVal)
          : p[attribute] === matchVal;
        if (ans === 'Yes') score += matches ? boost : -boost;
        else if (ans === 'No') score += matches ? -boost : boost * 0.3;
        else score *= 0.9;
      };

      check('indian', 'nationality', 'Indian', 15);
      check('australian', 'nationality', 'Australian', 15);
      check('south african', 'nationality', 'South African', 15);
      check('west ind', 'nationality', 'West Indian', 15);
      check('english', 'nationality', 'English', 15);
      check('new zealand', 'nationality', 'New Zealander', 15);
      check('sri lanka', 'nationality', 'Sri Lankan', 15);
      check('overseas', 'is_overseas', true, 12);
      check('batsman', 'role', 'Batsman', 12);
      check('bowler', 'role', 'Bowler', 12);
      check('all-rounder', 'role', 'All-rounder', 12);
      check('wicketkeeper', 'role', 'Wicketkeeper', 12);
      check('right-hand', 'batting_style', 'Right-hand', 8);
      check('left-hand', 'batting_style', 'Left-hand', 8);
      check('spin bowler', 'is_spin_bowler', true, 10);
      check('fast bowler', 'is_fast_bowler', true, 10);
      check('death', 'is_death_bowler', true, 10);
      check('finisher', 'is_finisher', true, 10);
      check('opener', 'is_opener', true, 10);
      check('captain', 'has_captained', true, 10);
      check('trophy', 'won_trophy', true, 8);
      check('orange cap', 'orange_cap', true, 8);
      check('purple cap', 'purple_cap', true, 8);
      check('active', 'is_active_2024', true, 8);
      check('csk', 'teams', 'CSK', 10);
      check('mi', 'teams', 'MI', 10);
      check('rcb', 'teams', 'RCB', 10);
      check('kkr', 'teams', 'KKR', 10);
      check('srh', 'teams', 'SRH', 10);
      check('rr', 'teams', 'RR', 10);
      check('dc', 'teams', 'DC', 10);
      check('pbks', 'teams', 'PBKS', 10);

      if (q.includes('2000 ipl runs')) {
        const matches = p.runs >= 2000;
        if (ans === 'Yes') score += matches ? 12 : -12;
        else if (ans === 'No') score += matches ? -12 : 4;
      }
      if (q.includes('100 ipl wickets')) {
        const matches = p.wickets >= 100;
        if (ans === 'Yes') score += matches ? 12 : -12;
        else if (ans === 'No') score += matches ? -12 : 4;
      }
      if (q.includes('100 ipl matches')) {
        const matches = p.matches >= 100;
        if (ans === 'Yes') score += matches ? 10 : -10;
        else if (ans === 'No') score += matches ? -10 : 3;
      }
    }

    return { ...p, probability: Math.max(0.1, score) };
  });

  const total = scored.reduce((s, p) => s + p.probability, 0);
  const normalized = scored.map(p => ({
    ...p,
    probability: (p.probability / total) * 100,
  }));

  return normalized.sort((a, b) => b.probability - a.probability);
}
