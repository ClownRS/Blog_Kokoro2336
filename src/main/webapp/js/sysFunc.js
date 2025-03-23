let form = document.getElementById("sys_post_detail_form");
let deleteButton = document.getElementById("delete");
let refreshURL = url + "/sys/genAccessToken";

/**处理post的增加和更新 */
function upload(post) {
    let params = new URLSearchParams(post).toString();
    fetch(url + "/sys/upload?" + params, {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(Response => {
        if (Response.ok) {
            return Response.json();
        }
        throw new Error("HTTP error! status: ${response.status}");
    })
    .then(data => {
        let uploadType = data.uploadType;
        let isSuccess = data.isSuccess;
        if (isSuccess) {
            alert(uploadType + "successful!");
        } else {
            alert(uploadType + "failed!");
        }
    })
    .catch(error => {
        console.log(error);
    })
}

/**根据id删除post */
function deletePost(id) {
    let params = {
        "id": id
    }
    let urlParams = new URLSearchParams(params);
    fetch(url + "/sys/delete?" + urlParams.toString(), {
        method: "DELETE"
    })
    .then(Response => {
        if (Response.ok) {
            return Response.json();
        }
        throw new Error("HTTP error! status: ${response.status}");
    })
    .then(data => {
        let uploadType = data.uploadType;
        let isSuccess = data.isSuccess;
        if (isSuccess) {
            alert(uploadType + "successful!");
        } else {
            alert(uploadType + "failed!");
        }
    })
    .catch(error => {
        console.log(error);
    })
}

/**
 * 在sys页面加载post列表.
 */
function getPostListInSys() {
    let route = "/sys/load";
    fetch(url + route, {
        method: "GET",
        headers: setHeader(1)
    })
    .then(Response => {
        if (Response.ok) {
            return Response.json();
        } else if (Response.status == 401) {
            return;
        } else {
            alert("Authorize failed!Please login again!");
            window.location.assign(url + "/sys_login.html");
        }
    })
    .then(data => {
        postList = data;
        showPostListInSys(postList);
    })
    .catch(() => {
        fetch(refreshURL, {
            mehtod: "GET",
            headers: setHeader(2)
        })
        .then(Response => {
            if (!Response.ok) {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
            return Response.json();
        })
        .then(data => {
            let accessToken = data.accessToken;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                getPostListInSys();
            } else {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
        })
        .catch(error => {
            console.log(error);
        });
    });
}  

function showPostListInSys(postList) {
    let list = document.getElementsByTagName("ul")[0];
    for (i = 0; i < postList.length; i++) {
        let listItem = list.appendChild(document.createElement("li"));
        listItem.innerHTML = postList[i].title;
    }
}

/**
 * @param mode: 1. access token; 2. refresh token
 * @returns headers
 */
function setHeader(mode) {
    let token;
    if (mode == 1) {
        token = localStorage.getItem("accessToken");
    } else if (mode == 2) {
        token = localStorage.getItem("refreshToken");
    }
    if (token) {
        let headers = new Headers();
        if (mode == 1) {
            headers.append("Authorization", "Bearer " + token);
            headers.append("Content-Type", "application/json");
        } else if (mode == 2) {
            headers.append("Authorization", "Refresh " + token);
            headers.append("Content-Type", "application/json");
        }
        return headers;
    } else {
        alert("Auth failed!Please login again!");
        window.location.assign(url + "/sys_login.html");
    }
}

/**提交表单时拦截默认行为，使用js进行post提交
 */
form.addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData(form);
    let post = Object.fromEntries(formData.entries());
    upload(post);
});

// deleteButton.addEventListener("click", function() {
//     let id = document.getElementById("sys_post_id").innerHTML;
//     deletePost(id);
//     //清空post列表
//     cleanPostList();
//     //重新加载post列表
//     getPostList("All");
// });

document.addEventListener("DOMContentLoaded", () => {
    getPostListInSys();
});