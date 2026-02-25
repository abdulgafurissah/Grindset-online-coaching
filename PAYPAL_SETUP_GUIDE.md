# PayPal Subscription Setup Guide

This guide will walk you through the process of generating a **PayPal Plan ID** so that your Grindset Coaching application can process real subscription payments.

## Prerequisites
Before you begin, ensure you have:
1. A **PayPal Business Account**. (If you only have a personal account, you will need to upgrade it or create a new business account).
2. Access to the **PayPal Developer Dashboard** at [developer.paypal.com](https://developer.paypal.com).

---

## Step 1: Access the Dashboard & Set to LIVE Mode
By default, the Developer Dashboard usually opens in "Sandbox" (testing) mode. If you are ready to accept real payments, you must switch to LIVE mode.

1. Go to [developer.paypal.com](https://developer.paypal.com) and log in with your PayPal Business account credentials.
2. In the top-right corner of the dashboard, locate the toggle switch.
3. Switch it from **Sandbox** to **Live**.

---

## Step 2: Create a Product
PayPal requires you to create a "Product" (the service you are selling) before you can attach a pricing "Plan" to it.

1. In the left-hand sidebar, click on **Catalogs / Products**.
   *Note: Depending on your dashboard version, this might also be located under **Apps & Credentials** -> **Subscriptions**.*
2. Click the **Create Product** button.
3. Fill in the details for your coaching service:
   - **Product Name:** (e.g., "Grindset Premium Coaching")
   - **Product Type:** "Service"
   - **Category:** "Health & Fitness", "Education", or "Coaching"
   - **Product Description:** (Optional) A brief description of what the client gets.
4. Click **Save Product** or **Next**.

---

## Step 3: Create a Payment Plan
Now that you have your Product, you need to define how much it costs and how often the client is billed. This is the **Plan**.

1. On the Product page you just created, click the **Create Plan** button.
2. Under **Pricing Details**:
   - Select **Fixed Pricing** (this means a flat recurring rate).
   - Enter your price (e.g., **$99.00 USD**).
   - Set the billing cycle to **Monthly** (or whatever interval you prefer, such as Weekly or Yearly).
3. If you want to offer a free trial, you can set that up in the "Trial Period" section. Otherwise, skip it.
4. Review the final details and click **Turn On Plan** or **Save Plan**.

---

## Step 4: Locate and Copy Your Plan ID
Once your Plan is officially "Active" or "Turned On", PayPal will assign it a unique tracking ID.

1. You should be automatically redirected to the **Plan Details** page.
2. Look near the top of the page under the Plan Name. You will see an ID string that starts with the letter **P-**.
   - *Example:* `P-9MA81234AB567890CDEF1234`
3. **Copy this entire ID string** (including the `P-`).

---

## Step 5: Link the Plan ID to Your Grindset App
Now you just need to tell your application to use this Plan ID when a client clicks "Subscribe".

1. Log in to your Grindset Coaching web app using your **Admin** account.
2. In the left sidebar navigation, click on **Finances**, then select **Subscription Plans**.
3. Find the plan you want to attach this payment to (e.g., the "$99 Premium" plan) and click **Edit**.
    - If you don't have a plan yet, click **Create Plan**.
4. In the dialog box that appears, look for the field named **"PayPal Plan ID (Optional)"**.
5. **Paste your copied `P-` ID** into this field.
6. Click **Save Changes**.

### 🎉 You're Done!
Your gray "Not Available" button for clients will instantly turn into a shiny gold PayPal checkout button. When a client clicks it, PayPal will open and process their $99/monthly subscription automatically.
