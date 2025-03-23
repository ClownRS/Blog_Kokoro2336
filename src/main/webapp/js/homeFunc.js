/*等待DOM全部加载完毕以后，再插入数据*/
document.addEventListener("DOMContentLoaded", function() {
    getPostList("Featured");
});


posts_display.addEventListener("click", () => {
    let postList = document.getElementsByClassName("post_display");
    for (i = 1; i < postList.length; i++) {
        if (postList[i].contains(event.target)) {
            let url = postList[i].getElementsByTagName("a")[0].getAttribute("href");
            let title = postList[i].getElementsByTagName("h3")[0].innerHTML;

            window.location.assign(url + "&title=" + title);
        }
    }
});