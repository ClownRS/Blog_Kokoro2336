let form = document.getElementById("sys_post_detail_form");
let deleteButton = document.getElementById("delete");
let uploadButton = document.getElementById("upload");
let refreshURL = url + "/sys/genAccessToken";
let isAdding = false;   //是否处于新增post状态

function cleanPostList() {
    let list = document.getElementsByTagName("li");
    for (i = list.length - 1; i >= 0; i--) {
        list[i].remove();
    }
}

/**处理post的增加和更新 */
async function upload(post) {
    let postInJSON = JSON.stringify(post);
    await fetch(url + "/sys/upload", {
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

    return;
}

/**根据id删除post */
async function deletePost(id) {
    await fetch(url + "/sys/delete/" + id, {
        method: "POST",
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
        let message = data.message;
        let isSuccess = data.isSuccess;
        alert(message);
    })
    .catch(error => {
        fetch(refreshURL, {
            method: "POST",
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

    return;
}

/**
 * 在sys页面加载post列表.
 */
async function getPostListInSys() {
    let route = "/sys/load";
    await fetch(url + route, {
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

    return;
}  

function showPostListInSys(postList) {
    let list = document.getElementsByTagName("ul")[0];
    for (i = 0; i < postList.length; i++) {
        let listItem = list.appendChild(document.createElement("li"));
        listItem.textContent = postList[i].title;
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

function cleanDetails() {
    let form = document.getElementById("sys_post_detail_form");
    let title = document.getElementById("sys_post_title");
    let id = document.getElementById("sys_post_id");
    let checkbox = document.getElementById("featured");
    let summary = document.getElementById("summary");
    let content = document.getElementById("content");

    title.value = null;
    id.textContent = "id: ";
    checkbox.checked = false;
    summary.value = null;
    content.value = null;
}

function checkPost(post) {
    if (!post.title) {
        alert("Title can't be null!");
        return false;
    }
    if (!post.summary) {
        alert("Summary can't be null!");
        return false;
    }
    if (!post.content) {
        alert("Content can't be null!");
        return false;
    } 

    return true;
}

/**提交表单时拦截默认行为，使用js进行post提交
 */
uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let post = Object.fromEntries(formData.entries());
    //将id属性添加入Post中
    let id;
    if (isAdding) {
        id = null;
    } else {
        id = document.getElementById("sys_post_id").textContent.split("id: ")[1];
    }
    post.id = id;
    //将featured属性添加入Post中
    let featured = document.getElementById("featured");
    post.featured = featured.checked;
    if (checkPost(post)) {
        await upload(post);
        //清空post列表
        cleanPostList();
        
        loadSys();
    }
});

/**将列表加载和post details加载进行封装。 */
async function loadSys() {
    await getPostListInSys();
    //读取第一项
    let list = JSON.parse(localStorage.getItem("postIds"));
    if (list.length != 0) {
        readDetails(list[0]);
    }
}

/**DELETE:
 * 1. 非新增状态：删除post
 * 2. 新增状态：清空已有内容
 */
deleteButton.addEventListener("click", async (event) => {
    event.preventDefault(); // 阻止表单的默认提交行为
    if (!isAdding) {
        if (confirm("Are you sure to delete this post?")) {
            let id = document.getElementById("sys_post_id").textContent.split("id: ")[1];
            await deletePost(id)
            //清空post列表
            cleanPostList();

            loadSys();
        }
    } else {
        if (confirm("Are you sure to clean all changes?")) {
            cleanDetails();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadSys();
});

document.getElementById("postFile").addEventListener("change", (event) => {
    readFile(event);
})

let ul = document.getElementsByTagName("ul")[0];
ul.addEventListener("click", (event) => {
    isAdding = false;   //退出新增post状态
    let list = document.getElementsByTagName("li");
    for (i = 0; i < list.length; i++) {
        if (list[i].contains(event.target)) {
            let postIds = JSON.parse(localStorage.getItem("postIds"));
            let postId = postIds[i];
            readDetails(postId); 
        }
    }
})

let addButton = document.getElementById("add_new_post");
addButton.addEventListener("click", () => {
    if (!isAdding) {
        isAdding = true;
        cleanDetails();
    }
})