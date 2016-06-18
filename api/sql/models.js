import knex from './connector';


import {
  newScoring,
} from '../helpers';

function addSelectToEntryQuery(query) {
  query.select('entries.*', knex.raw('SUM(votes.vote_value) as score'))
    .leftJoin('votes', 'entries.id', 'votes.entry_id')
    .groupBy('entries.id');
}

function convertNullColsToZero(row) {
  row.score = row.score || 0;
  return row;
}

function mapNullColsToZero(query) {
  return query.then((rows) => {
    if (rows.length) {
      return rows.map(convertNullColsToZero);
    }

    return convertNullColsToZero(rows);
  });
}

export class Entries {
  getForFeed(type) {
    const query = knex('entries')
      .modify(addSelectToEntryQuery);

    if (type === 'NEW') {
      query.orderBy('created_at', 'desc');
    } else if (type === 'TOP') {
      query.orderBy('score', 'desc');
    } else if (type === 'HOT') {
      query.orderBy('hotScore', 'desc');
    } else {
      throw new Error(`Feed type ${type} not implemented.`);
    }

    return mapNullColsToZero(query);
  }

  getByRepoFullName(name) {
    // No need to batch
    const query = knex('entries')
      .modify(addSelectToEntryQuery)
      .where({ repository_name: name })
      .first();

    return mapNullColsToZero(query);
  }

  voteForEntry(repoFullName, voteValue, username) {
    let entry_id;
    const current = {};

    return Promise.resolve()

    // First, get some data from repoFullName
    .then(() => {
      return knex('entries')
        .where({ repository_name: repoFullName })
        .select([
          'id',
          'score',
          'ups',
          'downs',
          'created_at'
        ])
        .first()
        .then(({
          id,
          score,
          ups,
          downs,
          created_at
        }) => {
          entry_id = id;

          current.score = score || 0;
          current.ups = ups || 0;
          current.downs = downs || 0;
          current.createdAt = created_at;
        });
    })

    // Get previous vote_value
    .then(() => {
      return knex('votes')
        .where({
          entry_id,
          username,
        })
        .select(['vote_value'])
        .first()
        .then((result) => {
          current.previousVote = result ? result.vote_value : undefined;
        });
    })

    // Remove any previous votes by this person
    .then(() => {
      return knex('votes')
        .where({
          entry_id,
          username,
        })
        .delete();
    })

    // Then, insert a vote
    .then(() => {
      return knex('votes')
        .insert({
          entry_id,
          username,
          vote_value: voteValue,
        });
    })

    // Then update UPs, DOWNs and HOT score
    .then(() => {
      const result = newScoring({
        ups: current.ups,
        downs: current.downs,
        previousVote: current.previousVote,
        vote: voteValue,
        createdAt: current.createdAt,
      });


      return knex('entries')
        .where({
          id: entry_id
        })
        .update({
          score: result.score,
          ups: result.ups,
          downs: result.downs,
          hot_score: result.hotScore
        });
    });
  }

  haveVotedForEntry(repoFullName, username) {
    let entry_id;

    return Promise.resolve()

    // First, get the entry_id from repoFullName
    .then(() => {
      return knex('entries')
        .where({ repository_name: repoFullName })
        .select(['id'])
        .first()
        .then(({ id }) => {
          entry_id = id;
        });
    })

    .then(() => {
      return knex('votes')
        .where({ entry_id, username })
        .select(['id', 'vote_value'])
        .first();
    })

    .then((vote) => vote || { vote_value: 0 });
  }

  submitRepository(repoFullName, username) {
    const rateLimitMs = 60 * 60 * 1000;
    const rateLimitThresh = 3;

    // Rate limiting logic
    return knex.transaction((trx) => {
      return trx('entries')
        .count()
        .where('posted_by', '=', username)
        .where('created_at', '>', Date.now() - rateLimitMs)
        .then((obj) => {
          // If the user has already submitted too many times, we don't
          // post the repo.
          const postCount = obj[0]['count(*)'];
          if (postCount > rateLimitThresh) {
            throw new Error('Too many repos submitted in the last hour!');
          } else {
            return trx('entries')
              .insert({
                created_at: Date.now(),
                updated_at: Date.now(),
                repository_name: repoFullName,
                posted_by: username,
                ups: 0,
                downs: 0,
                score: 0,
                hot_score: 0,
              });
          }
        });
    });
  }
}

export class Comments {
  getAllByEntryId(entryId) {
    // No need to batch
  }
}
