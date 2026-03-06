const { chromium } = require("playwright");

async function run() {
    console.log("Starting Playwright...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
    page.on("pageerror", err => console.error(`BROWSER ERROR: ${err.message}`));

    try {
        console.log("Visiting login page...");
        await page.goto("http://localhost:3000/login", { waitUntil: 'networkidle' });

        console.log("Filling credentials...");
        await page.fill('input[name="email"]', 'admin@grindsetcoaching.com');
        await page.fill('input[name="password"]', 'securepassword123');

        console.log("Submitting...");
        // The button doesn't have type="submit" explicitly in the source, so we use text
        await page.click('button:has-text("Sign In")');

        console.log("Waiting for navigation...");
        await page.waitForURL('**/dashboard/**', { timeout: 10000 });
        console.log("Current URL:", page.url());

        if (page.url().includes("/dashboard")) {
            console.log("Successfully logged in.");

            // Wait for potential client-side render
            await page.waitForTimeout(5000);

            console.log("Checking page content...");
            const content = await page.textContent('body');
            console.log("Page includes 'Admin Dashboard'?", content.includes("Admin Dashboard"));
            console.log("Page includes 'Total Revenue'?", content.includes("Total Revenue"));

            const mainContent = await page.innerHTML('main');
            console.log("Main content length:", mainContent.length);
            if (mainContent.length < 100) {
                console.log("Main content appears very short or empty!");
                console.log("HTML:", mainContent);
            }

            await page.screenshot({ path: 'admin_dashboard_debug.png' });
            console.log("Screenshot saved as admin_dashboard_debug.png");
        } else {
            console.log("Login failed or didn't redirect to dashboard.");
        }

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
}

run();
