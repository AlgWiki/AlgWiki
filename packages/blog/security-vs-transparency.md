One of my goals when I started AlgWiki was to make it as _open_ as possible. Open source _and infrastructure_, meaning anyone can see exactly what's running on the backend, giving them complete knowledge of how their data is being used. Some things will need obviously need to be private (write access tokens, solutions to problems, analytics data of other users', etc.) but everything else should be visible.

This openness makes feel good, but from a security perspective it makes me want to scream in anguish. To top things off, the whole codebase (runtime code, development scripts and infrastructure) is in a single repository to make development as easy as possible.

So what can we do about this conflict? Can openness, development experience and security exist in harmony or are they mutually exclusive? I think we can have all of them and here are my plans to solve the security issues with our approach:

## Exfiltration of data from GitHub actions

Attackers can open PRs to the GitHub actions workflow files (eg. `.github/workflows/ci.yml`) and have them send sensitive data like AWS tokens back to themselves.

In AlgWiki PR actions need access to AWS and GitHub so that Pulumi can make a diff of the infrastructure in the PR. AWS contains all the infrastructure and secrets are stored there (eg. Twitter account password, GitHub admin access token, etc). An attacker able to leak this data would have access to _everything_.

In GitHub you can require PR actions to be manually run. This is a good, logical solution to this problem. However it relies on admins knowing if it's safe to run actions on a PR or not. Attackers can cleverly hide their changes so they look inoculous, obfuscated or complicated so it's not obvious what the effect is.

You might think it should be easy to spot a change to an actions workflow file, but because the workflows frequently delegate their logic to node scripts, changes to a JS file somewhere in the repo can be made to attack actions. For example, the database types file is imported by the infrastructure package which is run by actions.

They could even do supply chain attacks by installing or "updating" an npm dependency to a version they control. You can overwrite packages on the npm registry so there's no way to even find out if a package was compromised if they update it as soon as the action finishes running.

Ultimately some PRs are simply too dangerous to run actions in, whether or not there really is an attack in it. We should consider a policy for deciding whether to run actions or not:

- Are there changes to npm packages (ie. changes to `yarn.lock`)?
  - Is the PR author untrusted (ie. not an admin of the repo)?
    - Was a package updated to a different location or was a new package added?
      - Is the package untrustworthy (eg. not popular and not a package from the monorepo)?
        - Do not run actions
- Is it not clear what the PR is doing?
  - Do not run actions
- Does it look like it's doing something malicious?
  - Do not run actions

In every situation above where actions are not run, the reviewer should provide feedback so the PR author can make the PR trustworthy.

This policy can be automated to an extent. A webhook could be triggered on push which runs an action from a different repo that checks the `yarn.lock` for those conditions. It's not possible to programmatically check if the PR is doing something malicious or not so that will always be up to the reviewer to remember.

## Blast radius after a leak

The problem with keeping all the infrastructure and frontend/backend code in the same repository is that the CI now contains **all secrets**. A PR intended to change the frontend goes through the same CI pipeline that has admin access to AWS. Typically a repository would only have AWS access to one specific service so the potential impact is clear for a PR to the code runner vs a PR to the user authentication service. If an attacker did manage to compromise the CI for the code runner they would not have admin access to CI and wouldn't have things like the GitHub OAuth secret. In a monorepo, compromising the CI means they have access to everything.

Possible mitigations for this are:

- Having an automated and regularly scheduled rotation of all security tokens. Ideally each CI run would get its own single-use tokens.
  - This won't stop them from compromising the CI, but if they only get a single token they won't have much time to use it before it expires.
  - However if all CI tokens are being sent to the attacker this is not much help.
  - The single-use token generator would also need to be secure.
- Limit access to the internet to prevent sending data to an attacker's server.
  - Could be achieved by running node scripts inside a Docker container where all network requests are proxied through an explicit allowlist (if GitHub lets actions start Docker containers).
  - Critical actions could also be run in a private repo to prevent non-members from viewing logs.

Other than that I don't have many ideas if I want to keep the monorepo structure with code sharing between packages.

## Conclusion

So these are my ideas for extra tools to enhance security:

- npm supply chain safety analyser
- Single-use token generator for AWS + GitHub actions
- Private actions (maybe could use `pull_request_target` instead)

Right now I need to focus on getting AlgWiki working but after that I'll tackle these security challenges.
