addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(window.location.search);
    let status = params.get("status");
    if (status === 1) {
        alert("Login successful!");
    }
})