const core = require('@actions/core');
const getRepositories = require('./get-repositories');
require('dotenv').config();

// most @actions toolkit packages have async methods
async function run() {

  try {
    const githubToken = core.getInput('github_token') || process.env.GITHUB_TOKEN;
    const organization = core.getInput('organization') || process.env.GITHUB_ORG;

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    let repositoriesJson = await getRepositories(githubToken, organization);
    core.info((new Date()).toTimeString());

    core.setOutput('repositories_json', repositoriesJson);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
