import { GitHubConnector } from './github/connector';
import { Repositories, Users } from './github/models';
import { Entries } from './sql/models';

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

const gitHubConnector = new GitHubConnector({
  client_id: GITHUB_CLIENT_ID,
  client_secret: GITHUB_CLIENT_SECRET,
});

export default {
  Repositories: new Repositories({ connector: gitHubConnector }),
  Users: new Users({ connector: gitHubConnector }),
  Entries: new Entries(),
};
