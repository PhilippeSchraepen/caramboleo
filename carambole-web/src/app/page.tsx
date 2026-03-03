import { Redis } from '@upstash/redis';
import MatchDisplay from '@/components/MatchDisplay';
import { Match } from '@/types';
import { DEFAULT_MATCH } from '@/lib/constants';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function Home() {
  let initialMatch = DEFAULT_MATCH;

  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const cloudMatch = await redis.get<Match>(`match:${DEFAULT_MATCH.id}`);
      if (cloudMatch) {
        initialMatch = cloudMatch;
      }
    } catch (e) {
      console.error('Failed to fetch initial match from Redis', e);
    }
  }

  return <MatchDisplay initialMatch={initialMatch} />;
}
