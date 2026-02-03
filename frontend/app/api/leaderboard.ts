export type LeaderboardEntry = {
  rank: number;
  userId: number;
  displayName: string;
  avatarUrl: string;
  score: number;
  achievedAt: string;
};

export type UserPosition = {
  rank: number;
  score: number;
};

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
  total: number;
  userPosition: UserPosition;
};

export async function fetchLeaderboard(
  page: number = 1,
  limit: number = 10,
  signal?: AbortSignal
): Promise<LeaderboardResponse> {
  const res = await fetch(
    `http://localhost:8080/leaderboard?page=${page}&limit=${limit}`,
    {
      signal,
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}

export async function submitScore(
  score: number,
  signal?: AbortSignal
): Promise<{ newHighScore: boolean }> {
  const res = await fetch("http://localhost:8080/user/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
    credentials: "include",
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to submit score");
  }

  return res.json();
}
