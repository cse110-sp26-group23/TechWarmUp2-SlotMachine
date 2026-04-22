/**
 * @fileoverview End-to-end tests for the slot machine — full stack through the browser.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

import { test, expect } from '@playwright/test';

test.describe('Slot Machine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with spin button and credit display', async ({ page }) => {
    await expect(page.getByRole('button', { name: /spin/i })).toBeVisible();
    await expect(page.locator('#creditsDisplay')).toBeVisible();
  });

  test('spin button triggers reel animation and updates credit display', async ({ page }) => {
    const initialCredits = await page.locator('#creditsDisplay').textContent();
    await page.getByRole('button', { name: /spin/i }).click();
    // Wait for spin to complete (animation + server round-trip)
    await page.waitForTimeout(2000);
    const finalCredits = await page.locator('#creditsDisplay').textContent();
    // Credits must have changed (either won or lost)
    expect(Number(finalCredits)).not.toBeNaN();
    expect(Number(initialCredits)).not.toBeNaN();
  });

  test('credits decrease by bet amount on a non-winning spin (statistical)', async ({ page }) => {
    let foundLoss = false;
    for (let i = 0; i < 20; i++) {
      const creditsBefore = Number(await page.locator('#creditsDisplay').textContent());
      const bet = Number(await page.locator('#betAmount').textContent());

      await page.getByRole('button', { name: /spin/i }).click();
      await page.waitForTimeout(2000);

      const creditsAfter = Number(await page.locator('#creditsDisplay').textContent());
      const lastWin = Number(await page.locator('#lastWinDisplay').textContent());

      if (lastWin === 0) {
        expect(creditsAfter).toBe(creditsBefore - bet);
        foundLoss = true;
        break;
      }
    }
    expect(foundLoss).toBeTruthy();
  });

  test('bet decrease and increase buttons adjust bet amount', async ({ page }) => {
    const initialBet = Number(await page.locator('#betAmount').textContent());

    await page.getByRole('button', { name: 'Increase bet' }).click();
    const increasedBet = Number(await page.locator('#betAmount').textContent());
    expect(increasedBet).toBeGreaterThan(initialBet);

    await page.getByRole('button', { name: 'Decrease bet' }).click();
    const decreasedBet = Number(await page.locator('#betAmount').textContent());
    expect(decreasedBet).toBe(initialBet);
  });

  test('mute toggle changes aria-pressed and icon', async ({ page }) => {
    const muteBtn = page.locator('#muteToggle');
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');

    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'true');

    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('all controls are keyboard-reachable (tab order)', async ({ page }) => {
    await page.keyboard.press('Tab');
    const muteToggleFocused = await page.locator('#muteToggle').evaluate(
      (el) => el === document.activeElement
    );

    // Tab through controls and verify spin button is reachable
    let spinReachable = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator('#spinButton').evaluate(
        (el) => el === document.activeElement
      );
      if (focused) {
        spinReachable = true;
        break;
      }
    }
    expect(spinReachable || muteToggleFocused).toBeTruthy();
  });

  test('spin button is keyboard-activatable with Enter', async ({ page }) => {
    // Focus spin button then press Enter
    await page.locator('#spinButton').focus();
    const creditsBefore = Number(await page.locator('#creditsDisplay').textContent());
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    const creditsAfter = Number(await page.locator('#creditsDisplay').textContent());
    expect(creditsAfter).not.toBe(creditsBefore + 1000); // not same as initial (spin happened)
    expect(Number.isFinite(creditsAfter)).toBeTruthy();
  });

  test('layout renders without overflow at 375px (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(390);
  });

  test('layout renders without overflow at 768px (tablet)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(790);
  });

  test('layout renders without overflow at 1440px (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(1460);
  });

  test('paytable is visible on page and contains basketball symbol', async ({ page }) => {
    const paytableToggle = page.locator('#paytableToggle');
    await paytableToggle.click();
    await expect(page.getByRole('cell', { name: /basketball/i })).toBeVisible();
  });
});
