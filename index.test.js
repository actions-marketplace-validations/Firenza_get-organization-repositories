const getRepositories = require('./get-repositories');
const core = require('@actions/core');
const fetch = require('node-fetch')

jest.mock('node-fetch');
jest.mock("@actions/core");

test('Processes one repo batch properly', async () => {
  // Arrange
  let organization = 'testorg'
  let githubToken = 'ImAGithubToken'
  let expectedJson = JSON.stringify([
    'repo1',
    'repo2'
  ])

  fetch.mockReturnValueOnce({
    ok: true,
    status: 200,
    json: function () {
      return {
        data: {
          organization: {
            repositories : {
              nodes: [
                {name: 'repo1'},
                {name: 'repo2'}
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: '23423423'
              }
            }
          }
        }
      }
    }
  });

  // Act
  let repositoryJson = await getRepositories(githubToken, organization);

  // Assert
  expect(repositoryJson).toBe(expectedJson);
  expect(core.setFailed).not.toHaveBeenCalled();
});

test('Processes two repo batches properly', async () => {
  // Arrange
  let organization = 'testorg'
  let githubToken = 'ImAGithubToken'
  let expectedJson = JSON.stringify([
    'repo1',
    'repo2',
    'repo3',
    'repo4'
  ])

  fetch.mockReturnValueOnce({
    ok: true,
    status: 200,
    json: function () {
      return {
        data: {
          organization: {
            repositories : {
              nodes: [
                {name: 'repo1'},
                {name: 'repo2'}
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: 'endCursor1'
              }
            }
          }
        }
      }
    }
  }).mockReturnValueOnce({
    ok: true,
    status: 200,
    json: function () {
      return {
        data: {
          organization: {
            repositories : {
              nodes: [
                {name: 'repo3'},
                {name: 'repo4'}
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: 'endCursor2'
              }
            }
          }
        }
      }
    }
  });

  // Act
  let repositoryJson = await getRepositories(githubToken, organization);

  // Assert
  expect(repositoryJson).toBe(expectedJson);
  expect(core.setFailed).not.toHaveBeenCalled();
});

test('Handle graphql error', async () => {
  // Arrange
  let organization = 'testorg'
  let githubToken = 'ImAGithubToken'

  fetch.mockReturnValueOnce({
    ok: false,
    status: 400,
    json: function () {
      return {
        errors: [
          {
            "message": "Something done went wrong"
          }
        ]
      }
    }
  });

  // Act
  await getRepositories(githubToken, organization);

  // Assert
  expect(core.setFailed).toHaveBeenCalled();
});