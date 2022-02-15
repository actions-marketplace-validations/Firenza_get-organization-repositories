# firenza/get-organization-repositories

A GitHub Action to return a list of repositories in a given organization.

## Usage

Sending in all the secret information

```yml
- name: Get Organization Repositories
  id: get_org_repos
  uses: firenza/get-organization-repositories@v1
  with:
    github_token: ${{ secrets.YOUR_GITHUB_TOKEN }}
    organization: 'actions'

- name: Show org repos
  shell: bash
  run: echo ${{ steps.get_org_repos.outputs.repositories_json }}

```

the output in this case would be 

```json
["heroku","github","labeler","toolkit","runner","setup-node","virtual-environments","setup-go","setup-dotnet","setup-python","upload-artifact","download-artifact","typescript-action","container-action","setup-ruby","setup-java","checkout","starter-workflows","container-toolkit-action","first-interaction","hello-world-javascript-action","stale","hello-world-docker-action","example-services","setup-elixir","github-script","javascript-action","create-release","upload-release-asset","setup-haskell",".github","cache","humans.txt","http-client","virtual-environments-packages","delete-package-versions","python-versions","versions-package-tools","node-versions","boost-versions","go-versions","actions-sync","publish-action","deploy-pages","jekyll-build-pages","add-to-project"]
```