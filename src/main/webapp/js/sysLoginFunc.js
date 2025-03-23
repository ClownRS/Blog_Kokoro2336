let url = "http://localhost:8080";
let login = document.getElementById("login");
function userLogin(user) {
    let params = {
        "username": user.username,
        "password": user.password
    }
    let urlParams = new URLSearchParams(params);
    let loginURL = url + "/user/login?" + urlParams.toString();

    fetch(loginURL, {
        method: "POST",
    })
    .then(Response => {
        if (Response.ok) {
            return Response.json();
        }
        throw new Error("HTTP error! status: ${response.status}");
    })
    .then(data => {
        let accessToken = data.accessToken;
        let refreshToken = data.refreshToken;
        if (accessToken && refreshToken) {
            alert("Login successful!");
            //store tokens to localStorage
            console.log(localStorage.getItem("accessToken"));
            console.log(localStorage.getItem("refreshToken"));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            console.log(localStorage.getItem("accessToken"));
            console.log(localStorage.getItem("refreshToken"));
            window.location.assign(url + "/sys.html");
        } else {
            window.location.assign(url + "/sys_login.html?state=" + data.state);
        }
    })
    .catch(error => {
        console.log(error);
    })
}

/**
 * 检查登录是否成功
 */
addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(window.location.search);
    let state = params.get("state");
    if (state == 2) {
        alert("User doesn't exist!");
    } else if (state == 3) {
        alert("Wrong password!");
    } else if (state == 4) {
        alert("Auth failed!Please login again!");
    }
})

async function sha256(message) {
  // 将字符串转换为UTF-8编码的字节序列
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // 使用Web Crypto API计算SHA-256哈希值
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // 将哈希值转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

login.addEventListener("submit", async (event) => {
    event.preventDefault();  //阻止默认提交行为
    let loginData = new FormData(login);
    let user = Object.fromEntries(loginData.entries()); //将FormData对象转换为对象
    userLogin(user);
    getPostList("All");
})