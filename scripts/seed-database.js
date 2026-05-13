require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let kaggleData = [];
try {
  const csvFile = fs.readFileSync('cricket_data_2026.csv', 'utf8');
  kaggleData = parse(csvFile, { columns: true, skip_empty_lines: true });
} catch (e) {
  // Silent fail
}

// COMPREHENSIVE PLAYER METADATA (Pre-built, no guessing)
const PLAYER_META = {
  // Indian Batsmen
  'Virat Kohli': { nationality: 'Indian', role: 'Batsman', teams: ['RCB'], is_overseas: false, has_captained: true, won_trophy: false, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: null, height_cm: 175, age: 35 },
  'Rohit Sharma': { nationality: 'Indian', role: 'Batsman', teams: ['MI'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: null, height_cm: 174, age: 36 },
  'Shubman Gill': { nationality: 'Indian', role: 'Batsman', teams: ['KKR', 'GT'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-opener-modern', height_cm: 178, age: 24 },
  'Yashasvi Jaiswal': { nationality: 'Indian', role: 'Batsman', teams: ['RR'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-opener-modern', height_cm: 183, age: 22 },
  
  // Indian All-rounders
  'Hardik Pandya': { nationality: 'Indian', role: 'All-rounder', teams: ['MI', 'GT'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-allrounder-finisher', height_cm: 183, age: 30 },
  'Ravindra Jadeja': { nationality: 'Indian', role: 'All-rounder', teams: ['RR', 'CSK'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-spin-allrounder', height_cm: 173, age: 35 },
  'Axar Patel': { nationality: 'Indian', role: 'All-rounder', teams: ['KXIP', 'DC'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-spin-allrounder', height_cm: 183, age: 30 },
  'Washington Sundar': { nationality: 'Indian', role: 'All-rounder', teams: ['RCB', 'SRH'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-spin-allrounder', height_cm: 175, age: 24 },
  
  // Indian Bowlers
  'Jasprit Bumrah': { nationality: 'Indian', role: 'Bowler', teams: ['MI'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-death-bowler', height_cm: 178, age: 30 },
  'Mohammed Shami': { nationality: 'Indian', role: 'Bowler', teams: ['KXIP', 'GT'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-fast-bowler', height_cm: 178, age: 33 },
  'Mohammed Siraj': { nationality: 'Indian', role: 'Bowler', teams: ['RCB', 'GT'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-fast-bowler', height_cm: 178, age: 30 },
  'Arshdeep Singh': { nationality: 'Indian', role: 'Bowler', teams: ['PBKS'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-death-bowler', height_cm: 189, age: 25 },
  
  // Indian Spinners
  'Yuzvendra Chahal': { nationality: 'Indian', role: 'Bowler', teams: ['MI', 'RCB', 'RR'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: true, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-legspinner', height_cm: 168, age: 33 },
  'Kuldeep Yadav': { nationality: 'Indian', role: 'Bowler', teams: ['KKR', 'DC'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-chinaman', height_cm: 168, age: 29 },
  'Ravi Bishnoi': { nationality: 'Indian', role: 'Bowler', teams: ['PBKS', 'LSG'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-legspinner', height_cm: 173, age: 23 },
  'Rahul Chahar': { nationality: 'Indian', role: 'Bowler', teams: ['MI', 'PBKS'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-legspinner', height_cm: 178, age: 25 },
  
  // Wicketkeepers
  'MS Dhoni': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['CSK', 'RPS'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: null, height_cm: 180, age: 42 },
  'Rishabh Pant': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['DC', 'LSG'], is_overseas: false, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-wk-finisher', height_cm: 170, age: 26 },
  'KL Rahul': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['RCB', 'KXIP', 'LSG'], is_overseas: false, has_captained: true, won_trophy: false, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-wk-opener', height_cm: 180, age: 31 },
  'Sanju Samson': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['RR'], is_overseas: false, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-wk-finisher', height_cm: 170, age: 29 },
  'Ishan Kishan': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['MI'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-wk-opener', height_cm: 173, age: 25 },
  
  // Overseas Batsmen
  'David Warner': { nationality: 'Australian', role: 'Batsman', teams: ['DD', 'SRH', 'DC'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'aus-opener', height_cm: 170, age: 37 },
  'Travis Head': { nationality: 'Australian', role: 'Batsman', teams: ['SRH'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-opener', height_cm: 183, age: 30 },
  'Jake Fraser-McGurk': { nationality: 'Australian', role: 'Batsman', teams: ['DC'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-opener', height_cm: 180, age: 22 },
  
  // Overseas All-rounders
  'Andre Russell': { nationality: 'West Indian', role: 'All-rounder', teams: ['KKR'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Growth(13-17)', tricky_pair_tag: 'wi-finisher', height_cm: 185, age: 35 },
  'Glenn Maxwell': { nationality: 'Australian', role: 'All-rounder', teams: ['KXIP', 'MI', 'RCB'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-finisher', height_cm: 182, age: 35 },
  'Marcus Stoinis': { nationality: 'Australian', role: 'All-rounder', teams: ['KXIP', 'DC', 'LSG'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-finisher', height_cm: 185, age: 34 },
  'Sam Curran': { nationality: 'English', role: 'All-rounder', teams: ['KXIP', 'CSK', 'PBKS'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'eng-allrounder', height_cm: 175, age: 25 },
  'Liam Livingstone': { nationality: 'English', role: 'All-rounder', teams: ['KXIP', 'PBKS'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'eng-allrounder', height_cm: 188, age: 30 },
  
  // Overseas Bowlers (Fast)
  'Pat Cummins': { nationality: 'Australian', role: 'Bowler', teams: ['KKR', 'SRH'], is_overseas: true, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-fast-bowler', height_cm: 192, age: 30 },
  'Mitchell Starc': { nationality: 'Australian', role: 'Bowler', teams: ['RCB', 'KKR'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-fast-bowler', height_cm: 197, age: 34 },
  'Jofra Archer': { nationality: 'English', role: 'Bowler', teams: ['RR', 'MI'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'eng-fast-bowler', height_cm: 182, age: 29 },
  'Kagiso Rabada': { nationality: 'South African', role: 'Bowler', teams: ['DC', 'PBKS'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'sa-fast-bowler', height_cm: 191, age: 29 },
  'Anrich Nortje': { nationality: 'South African', role: 'Bowler', teams: ['DC'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'sa-fast-bowler', height_cm: 193, age: 30 },
  'Lockie Ferguson': { nationality: 'New Zealander', role: 'Bowler', teams: ['KKR', 'GT'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'nz-fast-bowler', height_cm: 185, age: 32 },
  
  // Overseas Bowlers (Spin)
  'Rashid Khan': { nationality: 'Afghan', role: 'Bowler', teams: ['SRH', 'GT'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'afg-legspinner', height_cm: 178, age: 25 },
  'Sunil Narine': { nationality: 'West Indian', role: 'All-rounder', teams: ['KKR'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'wi-offspinner', height_cm: 180, age: 35 },
  'Varun Chakaravarthy': { nationality: 'Indian', role: 'Bowler', teams: ['KKR'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-mystery-spinner', height_cm: 180, age: 32 },
  'Noor Ahmad': { nationality: 'Afghan', role: 'Bowler', teams: ['GT'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'afg-leftarm-spinner', height_cm: 178, age: 19 },
  'Moeen Ali': { nationality: 'English', role: 'All-rounder', teams: ['RCB', 'CSK'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'eng-offspinner', height_cm: 183, age: 36 },
  
  // More Tricky Pairs
  'Trent Boult': { nationality: 'New Zealander', role: 'Bowler', teams: ['MI', 'RR'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'nz-swing-bowler', height_cm: 185, age: 34 },
  'Tim Southee': { nationality: 'New Zealander', role: 'Bowler', teams: ['CSK', 'MI', 'KKR', 'RR'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Growth(13-17)', tricky_pair_tag: 'nz-swing-bowler', height_cm: 191, age: 35 },
  'Bhuvneshwar Kumar': { nationality: 'Indian', role: 'Bowler', teams: ['PWI', 'SRH'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: true, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Growth(13-17)', tricky_pair_tag: 'ind-swing-bowler', height_cm: 178, age: 34 },
  'Deepak Chahar': { nationality: 'Indian', role: 'Bowler', teams: ['CSK', 'PBKS'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-swing-bowler', height_cm: 180, age: 31 },
  
  // Pioneer Era Legends
  'Sachin Tendulkar': { nationality: 'Indian', role: 'Batsman', teams: ['MI'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: null, height_cm: 165, age: 50 },
  'Adam Gilchrist': { nationality: 'Australian', role: 'Wicketkeeper', teams: ['DC'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: 'aus-wk-pioneer', height_cm: 186, age: 52 },
  'Shane Warne': { nationality: 'Australian', role: 'Bowler', teams: ['RR'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: 'aus-legspinner-pioneer', height_cm: 183, age: 52 },
  'Gautam Gambhir': { nationality: 'Indian', role: 'Batsman', teams: ['DD', 'KKR'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: null, height_cm: 168, age: 42 },
  'Chris Gayle': { nationality: 'West Indian', role: 'Batsman', teams: ['KKR', 'RCB', 'PBKS'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: 'wi-opener-pioneer', height_cm: 188, age: 44 },
  'AB de Villiers': { nationality: 'South African', role: 'Batsman', teams: ['DD', 'RCB'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'sa-batsman-growth', height_cm: 180, age: 40 },
  'Brendon McCullum': { nationality: 'New Zealander', role: 'Wicketkeeper', teams: ['KKR', 'CSK', 'GL', 'RCB'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: 'nz-wk-pioneer', height_cm: 170, age: 42 },
  
  // Growth Era
  'Suresh Raina': { nationality: 'Indian', role: 'Batsman', teams: ['CSK', 'GL'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Pioneer(08-12)', tricky_pair_tag: 'ind-finisher-growth', height_cm: 173, age: 37 },
  'Dwayne Bravo': { nationality: 'West Indian', role: 'All-rounder', teams: ['CSK', 'GL', 'MI'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: true, is_finisher: true, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Growth(13-17)', tricky_pair_tag: 'wi-allrounder-growth', height_cm: 175, age: 40 },
  'Shikhar Dhawan': { nationality: 'Indian', role: 'Batsman', teams: ['DC', 'MI', 'SRH', 'PBKS'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'ind-opener-growth', height_cm: 180, age: 38 },
  'Robin Uthappa': { nationality: 'Indian', role: 'Wicketkeeper', teams: ['MI', 'RCB', 'PWI', 'KKR', 'RR', 'CSK'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'ind-wk-growth', height_cm: 178, age: 38 },
  'Ajinkya Rahane': { nationality: 'Indian', role: 'Batsman', teams: ['RR', 'MI', 'DC', 'CSK', 'KKR'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Growth(13-17)', tricky_pair_tag: 'ind-opener-growth', height_cm: 168, age: 35 },
  
  // Modern Era - More players
  'Suryakumar Yadav': { nationality: 'Indian', role: 'Batsman', teams: ['KKR', 'MI'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-batsman-modern', height_cm: 180, age: 33 },
  'Ruturaj Gaikwad': { nationality: 'Indian', role: 'Batsman', teams: ['CSK'], is_overseas: false, has_captained: true, won_trophy: true, orange_cap: true, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-opener-modern', height_cm: 183, age: 27 },
  'Tilak Varma': { nationality: 'Indian', role: 'Batsman', teams: ['MI'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-batsman-modern', height_cm: 170, age: 21 },
  'Nitish Kumar Reddy': { nationality: 'Indian', role: 'All-rounder', teams: ['SRH'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-allrounder-modern', height_cm: 183, age: 21 },
  'Rinku Singh': { nationality: 'Indian', role: 'Batsman', teams: ['KKR'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'ind-finisher-modern', height_cm: 173, age: 26 },
  'Shivam Dube': { nationality: 'Indian', role: 'All-rounder', teams: ['RCB', 'CSK'], is_overseas: false, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-allrounder-modern', height_cm: 183, age: 30 },
  'Harshal Patel': { nationality: 'Indian', role: 'Bowler', teams: ['RCB', 'PBKS'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: true, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-death-bowler-modern', height_cm: 175, age: 33 },
  'T Natarajan': { nationality: 'Indian', role: 'Bowler', teams: ['SRH', 'DC'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-death-bowler-modern', height_cm: 178, age: 32 },
  'Mayank Yadav': { nationality: 'Indian', role: 'Bowler', teams: ['LSG'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-fast-bowler-modern', height_cm: 183, age: 22 },
  'Mohsin Khan': { nationality: 'Indian', role: 'Bowler', teams: ['LSG'], is_overseas: false, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ind-fast-bowler-modern', height_cm: 193, age: 25 },
  
  // Overseas - More
  'Jos Buttler': { nationality: 'English', role: 'Wicketkeeper', teams: ['RR'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: true, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'eng-wk-modern', height_cm: 180, age: 33 },
  'Quinton de Kock': { nationality: 'South African', role: 'Wicketkeeper', teams: ['RCB', 'LSG', 'KKR'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sa-wk-modern', height_cm: 170, age: 31 },
  'Heinrich Klaasen': { nationality: 'South African', role: 'Wicketkeeper', teams: ['SRH'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sa-wk-modern', height_cm: 183, age: 32 },
  'Phil Salt': { nationality: 'English', role: 'Wicketkeeper', teams: ['KKR'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'eng-wk-modern', height_cm: 170, age: 27 },
  'Nicholas Pooran': { nationality: 'West Indian', role: 'Wicketkeeper', teams: ['KXIP', 'LSG'], is_overseas: true, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'wi-wk-modern', height_cm: 173, age: 29 },
  'Kane Williamson': { nationality: 'New Zealander', role: 'Batsman', teams: ['SRH', 'GT'], is_overseas: true, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'nz-batsman-modern', height_cm: 173, age: 33 },
  'Steve Smith': { nationality: 'Australian', role: 'Batsman', teams: ['PWI', 'RR', 'DC'], is_overseas: true, has_captained: true, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-batsman-modern', height_cm: 179, age: 34 },
  'Cameron Green': { nationality: 'Australian', role: 'All-rounder', teams: ['MI', 'RCB'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-allrounder-modern', height_cm: 193, age: 25 },
  'Will Jacks': { nationality: 'English', role: 'All-rounder', teams: ['RCB'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'eng-allrounder-modern', height_cm: 183, age: 25 },
  'Tim David': { nationality: 'Australian', role: 'Batsman', teams: ['RCB', 'MI'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-finisher-modern', height_cm: 196, age: 28 },
  'Tristan Stubbs': { nationality: 'South African', role: 'Wicketkeeper', teams: ['DC'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sa-wk-modern', height_cm: 180, age: 24 },
  'Faf du Plessis': { nationality: 'South African', role: 'Batsman', teams: ['CSK', 'RCB'], is_overseas: true, has_captained: true, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sa-batsman-modern', height_cm: 178, age: 39 },
  'Devon Conway': { nationality: 'New Zealander', role: 'Batsman', teams: ['CSK'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'nz-batsman-modern', height_cm: 183, age: 32 },
  'Rilee Rossouw': { nationality: 'South African', role: 'Batsman', teams: ['RCB'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sa-batsman-modern', height_cm: 185, age: 34 },
  'Daryl Mitchell': { nationality: 'New Zealander', role: 'All-rounder', teams: ['CSK'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: true, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'nz-allrounder-modern', height_cm: 180, age: 32 },
  'Rachin Ravindra': { nationality: 'New Zealander', role: 'All-rounder', teams: ['CSK'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: true, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'nz-allrounder-modern', height_cm: 183, age: 24 },
  'Spencer Johnson': { nationality: 'Australian', role: 'Bowler', teams: ['GT'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-fast-bowler', height_cm: 193, age: 28 },
  'Nandre Burger': { nationality: 'South African', role: 'Bowler', teams: ['RR'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'sa-fast-bowler', height_cm: 193, age: 28 },
  'Reece Topley': { nationality: 'English', role: 'Bowler', teams: ['RCB'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'eng-fast-bowler', height_cm: 196, age: 30 },
  'Jason Behrendorff': { nationality: 'Australian', role: 'Bowler', teams: ['MI'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'aus-fast-bowler', height_cm: 193, age: 34 },
  'Adam Zampa': { nationality: 'Australian', role: 'Bowler', teams: ['RCB', 'RR'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'aus-legspinner', height_cm: 173, age: 32 },
  'Maheesh Theekshana': { nationality: 'Sri Lankan', role: 'Bowler', teams: ['CSK'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: false, is_spin_bowler: true, is_fast_bowler: false, era: 'Modern(18-24)', tricky_pair_tag: 'sl-mystery-spinner', height_cm: 185, age: 24 },
  'Matheesha Pathirana': { nationality: 'Sri Lankan', role: 'Bowler', teams: ['CSK'], is_overseas: true, has_captained: false, won_trophy: true, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'sl-fast-bowler', height_cm: 183, age: 21 },
  'Mustafizur Rahman': { nationality: 'Bangladeshi', role: 'Bowler', teams: ['SRH', 'RR', 'DC', 'CSK'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ban-fast-bowler', height_cm: 180, age: 29 },
  'Taskin Ahmed': { nationality: 'Bangladeshi', role: 'Bowler', teams: ['DC'], is_overseas: true, has_captained: false, won_trophy: false, orange_cap: false, purple_cap: false, is_finisher: false, is_opener: false, is_death_bowler: true, is_spin_bowler: false, is_fast_bowler: true, era: 'Modern(18-24)', tricky_pair_tag: 'ban-fast-bowler', height_cm: 183, age: 29 },
};

function mergeStats(playerName, meta) {
  const kaggle = kaggleData.find(p => 
    p.Player_Name?.toLowerCase().includes(playerName.toLowerCase()) ||
    playerName.toLowerCase().includes(p.Player_Name?.toLowerCase())
  );
  
  if (!kaggle) return {
    ...meta,
    matches: 50,
    runs: 1000,
    wickets: 20,
    strike_rate: 130.00,
    economy: meta.role === 'Bowler' ? 8.00 : null,
    fifties: 5,
    hundreds: meta.role === 'Batsman' ? 2 : 0,
    best_score: meta.role === 'Batsman' ? 75 : 0,
    catches: 10,
    stumpings: meta.role === 'Wicketkeeper' ? 15 : 0
  };
  
  return {
    ...meta,
    matches: parseInt(kaggle.Matches_Batted) || 50,
    runs: parseInt(kaggle.Runs_Scored) || 1000,
    wickets: parseInt(kaggle.Wickets_Taken) || 20,
    strike_rate: parseFloat(kaggle.Batting_Strike_Rate) || 130.00,
    economy: parseFloat(kaggle.Economy_Rate) || 8.00,
    fifties: parseInt(kaggle.Half_Centuries) || 5,
    hundreds: parseInt(kaggle.Centuries) || 0,
    best_score: parseInt(kaggle.Highest_Score) || 75,
    catches: parseInt(kaggle.Catches_Taken) || 10,
    stumpings: parseInt(kaggle.Stumpings) || 0
  };
}

async function seedDatabase() {
  const { count, error: countError } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    process.exit(1);
  }
  
  if (count && count > 0) {
    process.exit(0);
  }
  
  const players = Object.entries(PLAYER_META).map(([name, meta]) => {
    const merged = mergeStats(name, meta);
    return {
      name,
      nationality: merged.nationality,
      role: merged.role,
      batting_style: 'Right-hand',
      bowling_style: merged.role === 'Bowler' && merged.is_spin_bowler ? 'Right-arm legbreak' : 
                     merged.role === 'Bowler' && merged.is_fast_bowler ? 'Right-arm fast' : 'None',
      is_overseas: merged.is_overseas,
      teams: merged.teams,
      seasons: Array.from({ length: 5 }, (_, i) => 2020 + i),
      is_active_2024: true,
      has_captained: merged.has_captained,
      won_trophy: merged.won_trophy,
      orange_cap: merged.orange_cap,
      purple_cap: merged.purple_cap,
      matches: merged.matches,
      runs: merged.runs,
      wickets: merged.wickets,
      strike_rate: merged.strike_rate,
      economy: merged.economy,
      catches: merged.catches,
      stumpings: merged.stumpings,
      fifties: merged.fifties,
      hundreds: merged.hundreds,
      best_score: merged.best_score,
      is_finisher: merged.is_finisher,
      is_opener: merged.is_opener,
      is_death_bowler: merged.is_death_bowler,
      is_spin_bowler: merged.is_spin_bowler,
      is_fast_bowler: merged.is_fast_bowler,
      era: merged.era,
      height_cm: merged.height_cm,
      age: merged.age,
      debut_year: 2015,
      last_year: 2024,
      description: `${merged.nationality} ${merged.role.toLowerCase()}, ${merged.era}`,
      photo_url: null,
      tricky_pair_tag: merged.tricky_pair_tag
    };
  });
  
  const BATCH_SIZE = 25;
  for (let i = 0; i < players.length; i += BATCH_SIZE) {
    const batch = players.slice(i, i + BATCH_SIZE);
    await supabase.from('players').insert(batch);
  }
}

seedDatabase().catch(console.error);
