function jumpToHome() {
    //let urlHostname = window.parent.location.hostname;  //在内嵌框架中访问父文档的url
    let url = "http://localhost:8080";

    fetch(url + "/home/jump")
    .then(response => {
        if (!response.ok) {
            throw new error("http error! status: ${response.status}");
        }

        window.parent.location.assign(url + "/home.html");

        return response.json(); //将响应体解析为json格式
    })
    .then(data => {
        //获取post_display and posts_display_homePage元素
        let post_display = document.getElementsByClassName("post_display")[0];
        let posts_display_homePage = post_display.parentNode;

        //展示post
        data.forEach(post => {
            post_display = posts_display_homePage.appendChild(post_display);
            //插入post数据
            let postLink = post_display.getElementsByTagName("a")[0].getAttribute("herf");
            let postTitle = post_display.getElementsByClassName("post_title")[0];
            let postDate = post_display.getElementsByTagName("i")[0];
            let lastModified = post_display.getElementsByTagName("i")[1];
            let postContent = post_display.getElementsByClassName("post_content")[0];

            postLink = url.hostname + "/posts" + post.id;
            postTitle = post.title;
            postDate = toString(post.date);
            lastModified = toString(post.lastModified);
            postContent = post.content;
        });
    })
    .catch(error => console.log(error));
}

/*herf: 直接跳转，并留下记录，不能后退
assign(): 跳转且可以后退，留下记录
replace()：不留下记录，不能后退*/

/**
 * 加载nav的按钮功能。
 */
const homeButton = document.getElementById("homePage");
const postsButton = document.getElementById("posts");
const aboutButton = document.getElementById("about");

homeButton.addEventListener("click", function() {
    jumpToHome();
});

postsButton.addEventListener("click", function() {
});

aboutButton.addEventListener("click", function() {
});