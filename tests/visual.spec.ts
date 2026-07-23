import { test, expect } from "@playwright/test";
import {
  fetchStories,
  navigateToStory,
  getStoryName,
  getStoryDisplayName,
  Story,
} from "./commands/storybook-helpers";

/**
 * Storybook Visual Regression Tests
 *
 * Takes screenshots of all Storybook stories across multiple browsers and devices.
 * Runs on: Chromium, Firefox, WebKit (Desktop, Tablet, Mobile)
 */

let stories: Story[] = [];

test.beforeAll(async () => {
  stories = await fetchStories();
  console.log(
    `✓ Found ${stories.length} stories for visual regression testing`,
  );
});

test.describe("Visual Regression", () => {
  test("should match screenshots", async ({ page }) => {
    test.skip(stories.length === 0, "No stories found");

    for (const story of stories) {
      await test.step(getStoryDisplayName(story), async () => {
        await navigateToStory(page, story);

        // Locate the story container - try multiple possible selectors
        await page.waitForTimeout(2000); // Wait for 1 second to ensure the story is loaded

        const storyName = getStoryName(story);

        await expect(page).toHaveScreenshot(`${storyName}.png`, {
          maxDiffPixels: 100,
          threshold: 0.2, // Allow up to 20% pixel difference (0.0 = exact match, 1.0 = 100% difference)
          timeout: 30000,
          animations: "disabled", // Disable CSS animations for faster/consistent screenshots
          fullPage: true, // Capture entire page, not just viewport
        });
      });
    }
  });
});
