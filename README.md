# Automated Free Visual Regression

## How to automate visual regression tests for FREE

Visual regression testing is powerful, but paid solutions like Percy and Chromatic can get expensive as your team scales. This repo shows a free alternative using Storybook, Playwright, and GitHub Actions.

Instead of committing snapshots manually or trusting every contributor to align OS settings, this setup:

- automates snapshot updates with GitHub Actions
- reduces developer snapshot maintenance
- keeps `main` safe by enforcing up-to-date branch checks

This project is a hybrid solution: free like Playwright/BackstopJS, but with the team workflow and artifact feedback of a paid service.

## What you will learn

- How to use GitHub Actions to update snapshots on your behalf
- How to remove snapshot maintenance burden from developers
- How to keep the main branch stable with repository checks
- How to generate and download Playwright artifacts from Actions

By the end, you will have a working repo you can clone and adapt for your own projects.

## Project setup

This project demonstrates:

- Storybook for UI rendering
- Playwright for visual regression tests
- GitHub Actions to run tests and produce reports

The goal is a workflow where Playwright tests run in CI and update snapshots automatically.

### Local development

```bash
npm install
npm start
```

Open Storybook locally and make changes to the UI before running tests.

## Automating changes

This repo solves inconsistencies from developers using different OS environments by centralizing snapshot generation in GitHub Actions.

The workflow:

1. Github actions will run Playwright tests against Storybook in CI
2. Generate visual results and HTML report artifacts
3. Post a PR comment with status and artifact links
4. Update snapshots automatically using a PAT-powered bot script

## GitHub repo setup

Recommended repo configuration:

- Enable required status checks for PRs
- Require branches to be up to date before merging
- Use branch protection rules and squash PR merges

A good workflow is:

1. Create a feature branch
2. Update UI or snapshots locally
3. Open a PR
4. GitHub Actions runs visual regression tests
5. Review the report and merge when green

## Conclusion

This solution worked by moving visual regression maintenance into CI and giving teams a straightforward review process.

It keeps snapshots consistent across environments, reduces manual snapshot churn, and uses GitHub Actions to automate reporting and updates.

If you want, apply this pattern to your own apps and extend it with additional browser coverage, more strict repo checks, or auto-approved snapshot updates.
