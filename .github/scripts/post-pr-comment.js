const token = process.env.PAT_TOKEN;
const runId = process.env.GITHUB_RUN_ID;
const repository = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER;

if (!token || !runId || !repository || !prNumber) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const [owner, repo] = repository.split('/');
const actionsUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
const artifactUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}#artifacts`;

const body = `## 🎭 E2E Test Results

### 📊 Test Report Available

The Playwright HTML report has been generated and is available as an artifact.

**How to view:**
1. [Go to the Actions run](${actionsUrl})
2. Scroll to the bottom and download \`playwright-report\`
3. Extract the zip and open \`index.html\` in your browser

**Quick Links:**
- 📦 [Download Report Artifact](${artifactUrl})
- 🔍 [View GitHub Actions Run](${actionsUrl})

---
*Run #${runId.slice(-8)}*`;

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'github-action-post-pr-comment',
};

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { headers, ...options });
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`Request failed: ${response.status} ${message}`);
  }

  return data;
}

async function run() {
  const comments = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`
  );

  const botComment = comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body.includes('E2E Test Results')
  );

  if (botComment) {
    await fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/issues/comments/${botComment.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ body }),
      }
    );
    return;
  }

  await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ body }),
    }
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
