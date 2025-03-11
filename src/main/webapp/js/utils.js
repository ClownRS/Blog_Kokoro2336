var postList;
let url = "http://localhost:8080";
let loginURL = url + "/sys_login.html";

/**
 * 向特定路径发送请求，获取特定形式postList。
 * route = "/home/load": 加载主页时，获取featured post list
 * route = "posts/load": 加载posts时，获取全部post list
 * @param route: 路由
 */
function getPostList(route) {

    fetch(url + route)
    .then(Response => {
        if (!Response.ok) {
            throw new error("HTTP error! status: ${response.status}");
        }

        return Response.json();
    })
    .then(data => {
        postList = data;
    })
    .then(() => {   //记得外面套一层回调
        showPostList(postList);
    })
    .catch(error => {
        console.log(error);
    });
}  

function showPostList(postList) {
    //获取post_display and posts_display元素
    let post_display_template = document.getElementsByClassName("post_display")[0];
    post_display_template.setAttribute("style", "display: flex;");
    let cloneNode;

    //展示post
    for (i = 0; i < postList.length; i++) {
        cloneNode = post_display_template.cloneNode(true);   //如果想要cloneNode()克隆其中所有的内容，接受一个true参数。
        post_display = posts_display.appendChild(cloneNode);
        //插入post数据
        let postLink = post_display.getElementsByTagName("a")[0];
        let postTitle = post_display.getElementsByClassName("post_title")[0];
        let postDate = post_display.getElementsByTagName("i")[0];
        let lastModified = post_display.getElementsByTagName("i")[1];
        let postSummary = post_display.getElementsByClassName("post_summary")[0];

        postLink.removeAttribute("herf");
        postLink.setAttribute("href", url + "/posts.html?id=" + postList[i].id);
        postTitle.innerHTML = postList[i].title;
        postDate.innerHTML = "Date:" + formatTimestamp(postList[i].postDate);
        lastModified.innerHTML = "Last Modified:" + (postList[i].lastModified === null?"":formatTimestamp(postList[i].lastModified));
        postSummary.innerHTML = postList[i].summary;
    }

    //设置template隐藏
    post_display_template.setAttribute("style", "display: none;");
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，所以+1
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function auth() {
    const authURL = url + "/auth";
    //take out the bi-token from localStorage
    let accessToken = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");
    let header = {
        "Authorization": "Bearer ${accessToken}, Refresh ${refreshToken}",
    }
    fetch(authURL, header)
    .then(Response => {
        if (Response.ok) {
            return Response.json();
        }

        throw new error("HTTP error! status: ${response.status}");
    })
    .then(data => {
        //成功了，更新token
        let accessToken = data.accessToken;
        let refreshToken = data.refreshToken;
        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
    })
    .catch(error => {
        if (error.status === 401) {
            //重新登录
            window.location.assign(loginURL + "?state=4");
        } else {
            console.log(error);
        }
    });
}