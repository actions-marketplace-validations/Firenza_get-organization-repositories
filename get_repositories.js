const core = require('@actions/core');
const fetch = require('node-fetch')

let get_repositories = async function (github_token, organization) {

  let GRAPHQL_URL = 'https://api.github.com/graphql'

  let repositoryNames = [];
  let moreRepositoriesToRead = true;
  let endCursor = null;
  let batchNum = 1;

  while (moreRepositoriesToRead) {
    core.info(`Reading batch ${batchNum} of 100 repositories`);

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `BEARER ${github_token}`
      },
      body: JSON.stringify({
        variables: { organization, endCursor },
        query: `
          query ($organization: String!, $endCursor: String) {
            organization(login: $organization) {
              repositories(first: 100, after: $endCursor) {
                nodes {
                  name
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,
      }),
    });
  
    const response_json = await response.json();
  
    response_json.data.organization.repositories.nodes.forEach(node => {
        repositoryNames.push(node.name);
    });

    moreRepositoriesToRead = response_json.data.organization.repositories.pageInfo.hasNextPage;
    endCursor = response_json.data.organization.repositories.pageInfo.endCursor;
    batchNum ++;
  }

  return JSON.stringify(repositoryNames);

};

module.exports = get_repositories;
