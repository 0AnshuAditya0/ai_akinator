import { supabase } from './supabase';
import playersData from './players.json';

export async function initDb() {
  try {
    const { count, error: countError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking players table:', countError);
      return false;
    }

    if (count && count >= 50) {
      console.log('DB already seeded.');
      return true;
    }

    console.log('Seeding DB with 100+ players...');
    const { error: insertError } = await supabase
      .from('players')
      .insert(playersData);

    if (insertError) {
      console.error('Error seeding players:', insertError);
      return false;
    }

    console.log('Successfully seeded database!');
    return true;
  } catch (error) {
    console.error('Fatal error in initDb:', error);
    return false;
  }
}
