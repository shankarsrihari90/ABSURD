# ABSURD release versioning

The release counter is an odometer-style three-part version: `major.minor.patch`.

- A normal change uses `node version.cjs patch`: `0.0.9` becomes `0.1.0`.
- A release group uses `node version.cjs minor`: `0.9.9` becomes `1.0.0`.
- A breaking rebuild uses `node version.cjs major`.

Before any push intended for a deployment:

1. Run the appropriate bump command from this folder.
2. Check `release-manifest.json` and the local header version.
3. Commit with the version in the message and create the matching Git tag, for example `v0.1.0`.
4. Push a work branch first for a Vercel Preview. Only merge/push the approved tagged release to the production branch.

This keeps the production URL on an explicit version while unfinished work has its own Vercel Preview URL.
