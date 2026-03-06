import { authenticate } from "./src/app/actions/auth";

async function run() {
    const formData = new FormData();
    formData.append("email", "admin@grindhub.com");
    formData.append("password", "wrongpassword123");

    try {
        const result = await authenticate(undefined, formData);
        console.log("Result:", result);
    } catch (e) {
        console.log("Error caught tightly in script:", e);
    }
}
run();
