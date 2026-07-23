const { execSync } = require('child_process');

const token = process.env.PAT_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const headRef = process.env.GITHUB_HEAD_REF || '';
const ref = process.env.GITHUB_REF || '';

const missingVars = [];
if (!token) missingVars.push('PAT_TOKEN');
if (!repository) missingVars.push('GITHUB_REPOSITORY');
if (!headRef && !ref) missingVars.push('GITHUB_HEAD_REF or GITHUB_REF');

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const [owner, repo] = repository.split('/');
const branch = headRef || ref.replace('refs/heads/', '');
const remoteUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;

function run(cmd) {
  return execSync(cmd, { stdio: 'inherit' });
}

try {
  const status = execSync('git status --porcelain').toString().trim();
  if (!status) {
    console.log('No updated snapshots or files to commit.');
    process.exit(0);
  }

  console.log('Changes detected, committing updated snapshots...');
    const gitUserName = process.env.GIT_USER_NAME || 'github-actions[bot]';
    const gitUserEmail = process.env.GIT_USER_EMAIL || 'github-actions[bot]@users.noreply.github.com';
    console.log(`Setting git user: ${gitUserName} <${gitUserEmail}>`);
    run(`git config user.name "${gitUserName}"`);
    run(`git config user.email "${gitUserEmail}"`);
  run('git add -A');
  run('git commit -m "chore: update snapshots [skip ci]"');

  // Ensure the correct branch is checked out before pushing.
  run(`git branch --show-current || git checkout -b ${branch}`);
  run(`git remote set-url origin ${remoteUrl}`);
  run(`git push origin HEAD:${branch}`);

  console.log('Snapshot commit pushed successfully.');
} catch (error) {
  console.error('Failed to commit or push snapshot updates.');
  console.error(error);
  process.exit(1);
}
