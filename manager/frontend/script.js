import { signin, signup, refreshToken, fetchProtected, logout } from "./api.js";

const signinForm = document.getElementById('signin-form');
const signinButton = document.getElementById('signin-button');

signinButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = new FormData(signinForm);
    const formObject = Object.fromEntries(formData.entries());
    const success = await signin(formObject);

    if (success) {
        checkAndRedirect();
    }
})

async function checkAndRedirect() {
    try {
        const isAuthenticated = await fetchProtected();

        if (isAuthenticated) {
            window.location.href = './dashboard.html';
        } else {
            alert("login failed, please try again.");
        }
    } catch (error) {
        console.error("authentication check failed:", error);
        alert("an error occurred, please try again.");
    }
}