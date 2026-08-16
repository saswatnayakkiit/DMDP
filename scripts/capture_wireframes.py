"""Capture Renewly prototype wireframe screenshots (360x800, light + dark)."""
import asyncio, os
from playwright.async_api import async_playwright

BASE = "https://upi-tracker-app-1.preview.emergentagent.com"
OUT = "/app/screenshots"
os.makedirs(OUT, exist_ok=True)

async def shot(page, name):
    await page.screenshot(path=f"{OUT}/{name}.png", full_page=False)
    print("saved", name)

async def goto(page, path):
    await page.goto(BASE + path, wait_until="networkidle")

async def set_theme(page, theme):
    await goto(page, "/settings")
    await page.wait_for_selector(f'[data-testid="theme-{theme}"]', timeout=30000)
    await page.click(f'[data-testid="theme-{theme}"]', force=True)
    await page.wait_for_timeout(400)

async def swipe_left(page, ctx, test_id):
    """ReanimatedSwipeable needs trusted touch events — use CDP dispatchTouchEvent."""
    box = await page.locator(f'[data-testid="{test_id}"]').bounding_box()
    y = box["y"] + box["height"] / 2
    x0 = box["x"] + box["width"] * 0.85
    cdp = await ctx.new_cdp_session(page)
    await cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y}]})
    for i in range(1, 16):
        await cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 - i * 11, "y": y}]})
        await page.wait_for_timeout(16)
    await cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    await cdp.detach()
    await page.wait_for_timeout(800)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 360, "height": 800}, has_touch=True)
        page = await ctx.new_page()

        # ---------- LIGHT MODE ----------
        await set_theme(page, "light")

        await goto(page, "/")
        await page.wait_for_selector('[data-testid="brand-name"]', timeout=30000)
        await shot(page, "01_landing")

        await page.click('[data-testid="landing-signup"]', force=True)
        await page.wait_for_selector('[data-testid="auth-name"]', timeout=15000)
        await shot(page, "02_auth_signup")

        await page.click('[data-testid="auth-switch"]', force=True)
        await page.wait_for_timeout(300)
        await shot(page, "03_auth_signin")

        await goto(page, "/onboarding")
        await page.wait_for_selector('[data-testid="onboarding-cta-0"]', timeout=15000)
        await shot(page, "04_onboarding_1")
        await page.click('[data-testid="onboarding-cta-0"]', force=True)
        await page.wait_for_timeout(600)
        await shot(page, "05_onboarding_2")
        await page.click('[data-testid="onboarding-cta-1"]', force=True)
        await page.wait_for_timeout(600)
        await shot(page, "06_onboarding_3")

        await goto(page, "/home")
        await page.wait_for_selector('[data-testid="hero-total"]', timeout=15000)
        await shot(page, "07_home")

        await swipe_left(page, ctx, "sub-row-spotify")
        await shot(page, "08_home_swipe_actions")
        await page.mouse.click(180, 100)  # close swipe
        await page.wait_for_timeout(400)

        await goto(page, "/calendar")
        await page.wait_for_selector('[data-testid="cal-day-19"]', timeout=15000)
        await shot(page, "09_calendar")
        await page.click('[data-testid="cal-day-19"]', force=True)
        await page.wait_for_timeout(600)
        await shot(page, "10_calendar_day_sheet")

        await goto(page, "/add")
        await page.wait_for_selector('[data-testid="add-search"]', timeout=15000)
        await shot(page, "11_add_pick_service")

        await goto(page, "/add-details?id=netflix")
        await page.wait_for_selector('[data-testid="save-sub"]', timeout=15000)
        await shot(page, "12_add_details")

        await goto(page, "/detail?id=netflix")
        await page.wait_for_selector('[data-testid="family-split"]', timeout=15000)
        await shot(page, "13_detail_family_split")
        await page.click('[data-testid="how-to-cancel"]', force=True)
        await page.wait_for_selector('[data-testid="mark-cancelled"]', timeout=15000)
        await page.wait_for_timeout(400)
        await shot(page, "14_detail_cancel_sheet")

        await goto(page, "/alerts")
        await page.wait_for_selector('[data-testid="alert-hotstar"]', timeout=15000)
        await shot(page, "15_alerts")

        await goto(page, "/savings")
        await page.wait_for_selector('[data-testid="savings-hero"]', timeout=15000)
        await shot(page, "16_savings")

        await goto(page, "/settings")
        await page.wait_for_selector('[data-testid="theme-segment"]', timeout=15000)
        await shot(page, "17_settings")

        await goto(page, "/paywall")
        await page.wait_for_selector('[data-testid="start-trial"]', timeout=15000)
        await shot(page, "18_paywall")

        # ---------- DARK MODE ----------
        await set_theme(page, "dark")

        await goto(page, "/")
        await page.wait_for_selector('[data-testid="brand-name"]', timeout=15000)
        await shot(page, "19_dark_landing")

        await goto(page, "/auth?mode=signup")
        await page.wait_for_selector('[data-testid="auth-submit"]', timeout=15000)
        await shot(page, "20_dark_auth")

        await goto(page, "/home")
        await page.wait_for_selector('[data-testid="hero-total"]', timeout=15000)
        await shot(page, "21_dark_home")

        await goto(page, "/calendar")
        await page.wait_for_selector('[data-testid="cal-day-19"]', timeout=15000)
        await shot(page, "22_dark_calendar")

        await goto(page, "/detail?id=netflix")
        await page.wait_for_selector('[data-testid="family-split"]', timeout=15000)
        await shot(page, "23_dark_detail")

        await goto(page, "/savings")
        await page.wait_for_selector('[data-testid="savings-hero"]', timeout=15000)
        await shot(page, "24_dark_savings")

        await goto(page, "/settings")
        await page.wait_for_selector('[data-testid="theme-segment"]', timeout=15000)
        await shot(page, "25_dark_settings")

        await goto(page, "/paywall")
        await page.wait_for_selector('[data-testid="start-trial"]', timeout=15000)
        await shot(page, "26_dark_paywall")

        # reset to light for the user
        await set_theme(page, "light")

        await browser.close()
        print("DONE")

asyncio.run(main())
