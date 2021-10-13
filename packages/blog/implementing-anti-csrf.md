Cross-Site Request Forgery (CSRF) is an attack where an attacker has users of some site visit their own site and makes requests to the target site as the user. For example, an attacker could post a link to a programming tips site they're building in the AlgWiki discord and get a bunch of people who are probably logged in to AlgWiki visit their site. Their site might look normal on the surface, but in the background they make requests to AlgWiki as the user by loading hidden iframes with POST forms pointing at endpoints which do things like delete their account or post spammy messages.

There are several solutions to this problem with a good summary of them on the [OWASP cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). This post is about how I decided to implement anti-CSRF measures for AlgWiki and goes through each of the approaches from the cheat with my thoughts on how they apply to AlgWiki.

#### Use Built-In Or Existing CSRF Implementations for CSRF Protection

AlgWiki uses a bespoke framework for the backend so this is not an option for us. We will need to implement it ourself.

#### Synchronizer token

Although the most strongly recommended by OWASP, this has a few of downsides:

1. It **complicates** the backend because it requires storing sessions (something I tried to avoid by using JWTs instead of session IDs).
1. The backend would add **costs** which I'm also trying to avoid by staying within the AWS free tier.
1. **Usability** is not ideal because anti-CSRF tokens will expire and going back on the page or leaving it open for a long time could stop the site from working.

For these reasons I'd like to use a _stateless_ method if possible.

#### Double Submit Cookie

This approach looks good, but we actually may not trust subdomains on AlgWiki because of _branch deploys_. A branch deploy is when someone contributes to AlgWiki and opens a PR. A copy of AlgWiki will be spun up on a subdomain (like `my-pr-id-123.dev.alg.wiki`). with changes from their PR to help us test the site with those changes. Similar to the attack described in the introduction, an attacker could tell people in the discord to check out their branch and then set the CSRF token for the main alg.wiki domain. It's a bit harder for the attacker because they have to get a maintainer to look at their code and approve their branch deploy to run, but if they obfuscate the exploit it could be easily missed in PR review (eg. "I included this minified library inline, I'll change it to use the npm module later").

But having said all that, this will not actually be problem because the cookie will only be set for the domain of the _API_. On AlgWiki the frontend and associated assets are accessed on `alg.wiki` but API requests go to `internal.api.alg.wiki`. The API cookies like `session` and `csrf` will only be set for the API domain and not accessible by any other `alg.wiki` domains.

The challenge with this approach though is that the `csrf` cookie cannot be read by the JS on the main `alg.wiki` domain so it will need to be loaded through some other mechanism. Since this will require another endpoint to fetch the anti-CSRF token I decided against this approach as well to reduce costs and load time (since this endpoint to fetch the token would be required before making any calls to the API or storing the token insecurely in local storage or similar).

#### SameSite Cookie Attribute

This is a useful security enhancement but will not solve the problem above (the `csrf` cookie only being accessible on the `internal.api.alg.wiki` domain and not `alg.wiki`).

#### Verifying Origin With Standard Headers

This is a very nice solution since it is stateless, requires no changes to frontend calls, and requires very little processing on the backend. According to the specification all CORS requests will have the `Origin` header set and CORS is required for the site to work (since the API is on a different domain to the main site).

The exceptions where the `Origin` header is not set do not apply because of the way the site works (pages are loaded from `alg.wiki` which only has public static assets and all endpoints are behind `internal.api.alg.wiki` and are called dynamically from pages on `alg.wiki`).

One consideration with this approach is that it will make it a little harder to manually make requests (eg. with curl) because you will need to correctly set the `Origin: alg.wiki` header, but this is only a minor concern for development. The API is only intended for internal use so this should not impact any other consumers.

#### Use of Custom Request Headers

If implementing the "Double Submit Cookie" solution above, this should also be used.

#### User Interaction Based CSRF Defense

More useful for confirmation on very sensitive operations rather than a CSRF prevention technique. Definitely need an alternative to this.

#### Login CSRF

Not applicable because we use third parties via OAuth for authentication.

## Conclusion

Overall the best approach seems to be "Verifying Origin With Standard Headers". It should work for all of AlgWiki's use-cases, has little overhead, no impact to user experience and no compromise to security. I'll make sure to log a warning when if the `Origin` header is ever missing along with the user agent so we can find out if there are any cases we missed.
