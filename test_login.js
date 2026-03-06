const { chromium } = require("playwright");

async function run() {
    console.log("Starting Playwright...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("pageerror", error => {
        console.error("PAGE ERROR CAUGHT:", error);
    });
    page.on("console", msg => {
        if (msg.type() === "error") {
            console.error("BROWSER CONSOLE ERROR:", msg.text());
        }
    });

    try {
        console.log("Navigating to login...");
        await page.goto("http://localhost:3000/login");
        await page.fill('input[name="email"]', "admin@grindsetcoaching.com");
        await page.fill('input[name="password"]', "a7d226252618b0dfd8af37e19fd53059!A1");

        console.log("Clicking Sign In...");
        await page.click('button:has-text("Sign In")');

        console.log("Waiting for network/redirects...");
        await page.waitForTimeout(4000);

        const pageText = await page.evaluate(() => document.body.innerText);
        const authErrorMatch = pageText.match(/AuthError:.*|Invalid credentials\.|Something went wrong\.|Error: .*/);

        if (authErrorMatch) {
            console.log("Found error on page:", authErrorMatch[0]);
        } else {
            console.log("Login successful or no error found. Current URL:", page.url());
        }
    } catch (e) {
        console.error("Test script failed:", e);
    } finally {
        await browser.close();
    }
}
run();
