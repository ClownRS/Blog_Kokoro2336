/**
 * 检查登录是否成功
 */
addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(window.location.search);
    let status = params.get("status");
    if (status == 1) {
        window.location.assign("http://localhost:8080/sys.html?status=" + status);
    } else if (status == 2) {
        alert("User doesn't exist!");
    } else if (status == 3) {
        alert("Wrong password!");
    }
})