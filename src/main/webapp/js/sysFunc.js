let form = document.getElementById("sys_post_detail_form");
let deleteButton = document.getElementById("delete");
let uploadButton = document.getElementById("upload");
let refreshURL = url + "/sys/genAccessToken";

function cleanPostList() {
    let list = document.getElementsByTagName("li");
    for (i = list.length - 1; i >= 0; i--) {
        list[i].remove();
    }
}

/**处理post的增加和更新 */
function upload(post) {
    let postInJSON = JSON.stringify(post);
    fetch(url + "/sys/upload", {
        method: "POST",
        body: postInJSON,
        headers: setHeader(1)
    })
    .then(Response => {
        if (Response.ok || Response.status == 401) {
            return Response.json(); //响应码为401时，利用非法json数据来产生异常

        } else {
            alert("Upload failed!Please login again!");
            window.location.assign(url + "/sys_login.html");
        }
    })
    .then(data => {
        let uploadType = data.uploadType;
        let isSuccess = data.isSuccess;
        if (isSuccess) {
            alert(uploadType + " successful!");
        } else {
            alert(uploadType + " failed!Please try again!");
        }
    })
    .catch(error => {
        fetch(refreshURL, {
            method: "POST",
            headers: setHeader(2),
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
                upload(post);
            } else {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
        })
        .catch(error => {
            console.log(error);
        });
    })
}

/**根据id删除post */
function deletePost(id) {
    let params = {
        "id": id
    }
    let urlParams = new URLSearchParams(params);
    fetch(url + "/sys/delete?" + urlParams.toString(), {
        method: "DELETE",
        headers: setHeader(1)
    })
    .then(Response => {
        if (Response.ok || Response.status == 401) {
            return Response.json(); //响应码为401时，利用非法json数据来产生异常
        } else {
            alert("Delete failed!Please login again!");
            window.location.assign(url + "/sys_login.html");
        }
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
        fetch(refreshURL, {
            method: "DELETE",
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
                deletePost(id);
            } else {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
        })
        .catch(error => {  
            console.log(error);
        })
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
        if (Response.ok || Response.status == 401) {
            return Response.json();
        } else {
            alert("Loading failed!Please login again!");
            window.location.assign(url + "/sys_login.html");
        }
    })
    .then(data => {
        postList = data;
        let postIds = new Array();
        for (i = 0; i < postList.length; i++) {
            postIds[i] = postList[i].id;   //按顺序存储所有Post的id
        }
        localStorage.setItem("postIds", JSON.stringify(postIds));
        showPostListInSys(postList);    //利用了鉴权失败时,postList长度为空来产生异常
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

/**读取md文件内容 */
function readFile(element) {
    let length = element.target.files.length;
    let file = element.target.files[length - 1];
    let reader = new FileReader();

    if (!file) {
        return;
    }

    let extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "md") {
        alert("Not md file!");
        return;
    }

    //限制文件大小为5MB.
    if (file.size > 5 * 1024 * 1024) {
        alert("File size too large!");
        return;
    }

    reader.readAsText(file, "UTF-8");

    reader.addEventListener("load", () => {
        //将Choose标签改为文件名
        let file_choose_label_p = document.getElementById("file_choose_label").getElementsByTagName("p")[0];
        file_choose_label_p.textContent = file.name;

        /**清空原textarea内容 */
        let content = document.getElementById("content");
        content.innerText = "";

        content.innerText = reader.result;
    })

    reader.addEventListener("error", () => {
        console.log("Reading file error!");
    });
}

function readDetails(i) {
    let route = "/sys/get/"
    fetch(url + route + i.toString(), {
        method: "GET",
        headers: setHeader(1),
    })
    .then(Response => {
        if (Response.ok || Response.status == 401) {
            return Response.json();
        } else {
            alert("Failed to get post details!");
            window.location.assign(url + "/sys_login.html");
        }
    })
    .then(data => {
        post = data;
        showDetails(post);
    })
    .catch(error => {
        fetch(refreshURL, {
            method: "GET",
            headers: setHeader(2),
        })
        .then(Response => {
            if (Response.ok || Response.status == 401) {
                return Response.json();
            } else {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
        })
        .then(data => {
            let accessToken = data.accessToken;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                readDetails(i);
            } else {
                alert("Auth failed!Please login again!");
                window.location.assign(url + "/sys_login.html");
            }
        })
        .catch(error => {
            console.log(error);
        })
    })
}

function showDetails(post) {
    let form = document.getElementById("sys_post_detail_form");
    let title = document.getElementById("sys_post_title");
    let id = document.getElementById("sys_post_id");
    let checkbox = document.getElementById("featured");
    let summary = document.getElementById("summary");
    let content = document.getElementById("content");

    title.value = post.title;
    id.textContent = "id: " + post.id;
    checkbox.checked = post.featured;
    summary.value = post.summary;
    content.value = post.content;
}

/**提交表单时拦截默认行为，使用js进行post提交
 */
uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let post = Object.fromEntries(formData.entries());
    //将id属性添加入Post中
    let id = document.getElementById("sys_post_id").textContent.split("id: ")[1];
    post.id = id;
    //将featured属性添加入Post中
    let featured = document.getElementById("featured");
    post.featured = featured.checked;
    await upload(post);
    //清空post列表
    await cleanPostList();
    //重新加载post列表
    await getPostListInSys();
});

deleteButton.addEventListener("click", async () => {
    let id = document.getElementById("sys_post_id").innerHTML;
    await deletePost(id);
    //清空post列表
    await cleanPostList();
    //重新加载post列表
    await getPostListInSys();
});

document.addEventListener("DOMContentLoaded", async () => {
    await getPostListInSys();
    //读取第一项
    await readDetails(1);
});

document.getElementById("postFile").addEventListener("change", (event) => {
    readFile(event);
})

let ul = document.getElementsByTagName("ul")[0];
ul.addEventListener("click", (event) => {
    let list = document.getElementsByTagName("li");
    for (i = 0; i < list.length; i++) {
        if (list[i].contains(event.target)) {
            let postIds = JSON.parse(localStorage.getItem("postIds"));
            let postId = postIds[i];
            readDetails(postId); 
        }
    }
})