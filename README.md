![](https://github.com/gotdibbs/monikerz/workflows/Tests/badge.svg)

# Monikerz

Monikerz is a party game that is similar to Celebrity or Charades. Teams play against each other by trying to guess as many names as possible before time runs out.

## Tech Stack

* **React:** UI components
* **Redux:** Firestore state management
* **XState:** Game state machine
* **Firebase:** Backend / real-time updates
* **Fontawesome:** Icons
* **Fathom:** Analytics
* **Honeybadger:** Error Reporting

## Building

It is recommended to use VS Code for development. There are recommended extensions for this repository.

### Development

1. Ensure `node` and `yarn` are installed globally.
2. Clone this repository.
3. Copy `.env.example` to `.env` and configure the relevant environment variables.
4. Run `yarn install` from the root of the repository.
5. Run `yarn dev:dll` once to build the webpack dll of dependencies.
6. Run `yarn dev` to start webpack in watch mode.
7. Run `yarn test` to check that your tests pass ok.
8. Run `yarn test:coverage` to check that coverage has not decreased.
9. If you've built a shared component, create a story for it in Storybook.
9. When your changes are complete, ensure your branch is up to date, has no conflicts, and is squashed down to one commit.Then, push your change to a branch against this repository or your fork.
10. Create a pull request and ensure it passes CI (which should be equivalent to running `yarn test`). Only pull requests that pass the aforementioned checks will be accepted.

### Production

This workflow builds on the above, so ensure you're able to build locally in `dev` mode before trying to create a production release.

1. Ensure you're on `master` and have the latest commits checked out.
2. Ensure `.env` is up to date.
3. Ensure `firebase-tools` are installed globally.
4. Bump the version number in `package.json`.
4. Run `yarn prod:dll` once to build the webpack dll of dependencies.
5. Run `yarn prod` to create a release build. Note that running this command will upload sourcemaps to honeybadger.
6. Run `yarn deploy` to push the release up to firebase.
7. Commit to `master` with the updated version number and firebase cache file.