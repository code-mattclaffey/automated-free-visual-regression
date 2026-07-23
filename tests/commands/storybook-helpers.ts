import { Page } from "@playwright/test";

/**
 * Shared helpers for Storybook testing
 *
 * These utilities are used by both accessibility and visual regression tests
 * to interact with Storybook stories.
 */

export const STORYBOOK_URL =
  process.env.STORYBOOK_URL || "http://localhost:6006";

export interface Story {
  id: string;
  title: string;
  name: string;
  importPath: string;
  tags?: string[];
  type: string;
}

interface StoriesJson {
  v: number;
  entries: Record<string, Story>;
}

/**
 * Fetch all stories from Storybook's index.json manifest
 */
export async function fetchStories(): Promise<Story[]> {
  const response = await fetch(`${STORYBOOK_URL}/index.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch index.json from ${STORYBOOK_URL}. Status: ${response.status}`,
    );
  }

  const data: StoriesJson = await response.json();
  return Object.values(data.entries).filter((entry) => entry.type === "story");
}

/**
 * Navigate to a story and wait for it to render
 */
export async function navigateToStory(page: Page, story: Story): Promise<void> {
  const storyUrl = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;

  try {
    await page.goto(storyUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for story content to be ready - try multiple possible selectors
    await page.waitForFunction(
      () => {
        const root = document.querySelector("#storybook-root, #root, body > *");
        return root && root.children.length > 0;
      },
      { timeout: 20000 },
    );

    // Wait for animations/content to settle
    await page.waitForTimeout(1000);
  } catch (error) {
    throw new Error(
      `Failed to navigate to story "${story.title} > ${story.name}" ` +
        // @ts-expect-error - error typing is inconsistent
        `(${story.id}): ${error.message}`,
    );
  }
}

/**
 * Get sanitized story name for screenshots
 */
export function getStoryName(story: Story): string {
  return `${story.title}--${story.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

/**
 * Get story display name for logging
 */
export function getStoryDisplayName(story: Story): string {
  return `${story.title} > ${story.name}`;
}
