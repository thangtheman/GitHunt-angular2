import RedditScore from 'reddit-score';

const redditScore = new RedditScore;

function updateVotes(ups, downs, vote, revert = false) {
  const status = {
    ups,
    downs,
  };

  if (vote === 1) {
    status.ups = revert ? ups - 1 : ups + 1;
  } else if (vote === -1) {
    status.downs = revert ? downs - 1 : downs + 1;
  }

  return status;
}

export function newScoring({
  ups,
  downs,
  previousVote,
  vote,
  createdAt,
}) {
  let updatedVotes = {
    ups,
    downs,
  };

  if (previousVote) {
    updatedVotes = updateVotes(updatedVotes.ups, updatedVotes.downs, previousVote, true);
  }

  updatedVotes = updateVotes(updatedVotes.ups, updatedVotes.downs, vote);

  const hotScore = redditScore.hot(updatedVotes.ups, updatedVotes.downs, new Date(createdAt));

  return {
    hotScore,
    ups: updatedVotes.ups,
    downs: updatedVotes.downs,
    score: updatedVotes.ups - updatedVotes.downs,
  };
}
