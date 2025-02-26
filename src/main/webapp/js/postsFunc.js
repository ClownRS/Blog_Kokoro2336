let post_detail = document.getElementById("post_detail");
let posts_display = document.getElementById("posts_display");

/**
 * 负责点击post_display时跳转到阅读界面。
 * 有可能点击的是主页的post，也有可能是posts页面的post。
 */
function read(id) {
    //获取列表长度
    let postList = document.getElementsByClassName("post_display");

    for (i = postList.length - 1; i > 0; i--) {    //start from i = 1
        postList[i].remove();
    }

    posts_display.style.display = "none";   //set posts_display invisible
    post_detail.style.display = "flex"; //set post_detail visible

    //get post content
    getPostContent(id);
}

function getPostContent(id) {
    fetch(url + "/posts/read/" + id)
    .then(response => {
        if (!response.ok) {
            throw new error("Fail to get post content!");
        }

        return response.text();
    })
    .then(data => {
        showPostContent(data);
    })
    .catch(error => console.log(error));
}

function showPostContent(content) {
    let post_content = document.getElementById("post_content");
    post_content.innerHTML = content;
}

function getBack() {
    post_detail.style.display = "none";     //设置post_detail不可见
    posts_display.style.display = "flex";   //设置posts_display可见

    //需要重新获取列表，如果不重新获取，当post是从主页跳转来的时，getBack()会返回空列表展示
    getPostList("/posts/load");
}

let getBackButton = post_detail.getElementsByTagName("a")[0];

getBackButton.addEventListener("click", () => {
    getBack();
});

//页面加载完毕时加载postList
document.addEventListener("DOMContentLoaded", () => {
    let urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    let id = urlParams.get("id");
    if (id !== null) {
        read(id);
    } else {
        getPostList("/posts/load");
    }
})

//点击post_display跳转阅读界面，使用事件委派
posts_display.addEventListener("click", () => {
    let postList = document.getElementsByClassName("post_display"); 

    for (i = 1; i < postList.length; i++) {
        if (postList[i].contains(event.target)) {
            let url = new URL(postList[i].getElementsByTagName("a")[0].getAttribute("href"));   //需要new URL对象才能获取search
            let urlParams = new URLSearchParams(url.search);    //一定要用search，search才是?后面的参数，URLSearchParams默认接收的是参数而不是整个url
            let id = urlParams.get("id");
            
            read(id);
        }
    }
})
