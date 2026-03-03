import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from './page';
import { Redis } from '@upstash/redis';
import { MatchProvider } from '@/context/MatchContext';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

// Mock MatchDisplay to simplify server component testing
vi.mock('@/components/MatchDisplay', () => ({
  default: ({ initialMatch }: any) => (
    <div data-testid="match-display">
      {initialMatch.teamHome} vs {initialMatch.teamAway}
    </div>
  ),
}));

describe('Home Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.UPSTASH_REDIS_REST_URL = 'https://fake-url.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';
  });

  it('should render with data from Redis when available', async () => {
    const mockMatch = {
      id: '1',
      teamHome: 'Cloud Home',
      teamAway: 'Cloud Away',
      games: [],
    };
    mockGet.mockResolvedValue(mockMatch);

    const Result = await Home();
    render(
        <MatchProvider>
            {Result}
        </MatchProvider>
    );

    expect(screen.getByTestId('match-display')).toHaveTextContent('Cloud Home vs Cloud Away');
  });

  it('should fallback to default data when Redis fetch fails', async () => {
    mockGet.mockRejectedValue(new Error('Redis Down'));

    const Result = await Home();
    render(
        <MatchProvider>
            {Result}
        </MatchProvider>
    );

    expect(screen.getByTestId('match-display')).toHaveTextContent('Kerkuilen vs Rooie bal 2');
  });

  it('should use default data if Redis is not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;

    const Result = await Home();
    render(
        <MatchProvider>
            {Result}
        </MatchProvider>
    );

    expect(screen.getByTestId('match-display')).toHaveTextContent('Kerkuilen vs Rooie bal 2');
  });
});
