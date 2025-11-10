import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for the blocks-graph web component
 *
 * These tests capture PNG snapshots of the component in different states
 * and compare them against baseline images to detect visual regressions.
 */

test.describe('BlocksGraph Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto('/');

    // Wait for the page to be ready
    await page.waitForFunction(() => (window as typeof window & { testReady?: boolean }).testReady === true, { timeout: 10000 });

    // Give extra time for rendering
    await page.waitForTimeout(1000);
  });

  test('should match snapshot - default state', async ({ page }) => {
    // Find the default test case
    const testCase = page.locator('#test-default');

    // Take a screenshot of the test case
    await expect(testCase).toHaveScreenshot('blocks-graph-default.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match snapshot - custom dimensions', async ({ page }) => {
    const testCase = page.locator('#test-custom-dimensions');

    await expect(testCase).toHaveScreenshot('blocks-graph-custom-dimensions.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match snapshot - prerequisites hidden', async ({ page }) => {
    const testCase = page.locator('#test-no-prerequisites');

    await expect(testCase).toHaveScreenshot('blocks-graph-no-prerequisites.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match snapshot - after clicking first block', async ({ page }) => {
    // Use page.evaluate to interact with the shadow DOM
    await page.evaluate(() => {
      const graph = document.querySelector('#graph-default') as HTMLElement & { shadowRoot?: ShadowRoot | null };
      if (graph?.shadowRoot) {
        const firstBlock = graph.shadowRoot.querySelector('g[data-block-id]') as SVGGElement;
        if (firstBlock) {
          firstBlock.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      }
    });

    // Wait for re-render after click
    await page.waitForTimeout(500);

    const testCase = page.locator('#test-default');
    await expect(testCase).toHaveScreenshot('blocks-graph-first-block-selected.png', {
      maxDiffPixels: 100,
    });
  });
});
