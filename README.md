# Spotlight Card Library

A simple and powerful search tool for card games.

## Development

### Setup

- `npm i`

### Running

- `npm start`

## Contributing

Check out the [contributing guide](CONTRIBUTING.md) for more information.

## Setting Up Your Own Instance

1. Figure out where you want to dump your content. It should be either a fork of [this repository](https://github.com/LederCards/cards), or at minimum the output should be formatted the same as that repository.
1. Change `https://ledercardcdn.seiyria.com` to your desired URL. At this time, it can't be changed easily in one place, so a find+replace all will be necessary. The `cards` repository will also need a [script update](https://github.com/LederCards/cards/blob/master/scripts/build-card-data.ts#L20) to change the base URL of the images.
1. Make sure you have a `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` set per repo so they have somewhere to deploy to, if you want to use netlify.
1. If you're me (@seiyria), you're going to want to have two netlify apps set up for deployment. You'll want to configure those, the domains for those, as well as update any URLs in the GitHub actions workflows.
1. Make sure DNS entries exist for both applications.
1. Update the `cards` repo action to point to the new `Library` repo for cross-building. You'll also need a PAT with `repo` scope enabled, and added to `CROSS_REPO_UPDATE_PAT`.
