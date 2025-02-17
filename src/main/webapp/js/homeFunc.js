var postList;
var url = "http://localhost:8080";

function getPostList() {

    fetch(url + "/home/load")
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
    let post_display = document.getElementsByClassName("post_display")[0];
    let posts_display = post_display.parentNode;
    let cloneNode;
    //展示post
    for (i = 0; i < postList.length; i++) {
        cloneNode = post_display.cloneNode(true);   //如果想要cloneNode()克隆其中所有的内容，接受一个true参数。
        post_display = posts_display.appendChild(cloneNode);
        //插入post数据
        let postLink = post_display.getElementsByTagName("a")[0];
        let postTitle = post_display.getElementsByClassName("post_title")[0];
        let postDate = post_display.getElementsByTagName("i")[0];
        let lastModified = post_display.getElementsByTagName("i")[1];
        let postContent = post_display.getElementsByClassName("post_content")[0];

        postLink.removeAttribute("herf");
        postLink.setAttribute("href", url + "/posts.html/" + postList[i].id);
        postTitle.innerHTML = postList[i].title;
        postDate.innerHTML = "Date:" + formatTimestamp(postList[i].postDate);
        lastModified.innerHTML = "Last Modified:" + (postList[i].lastModified === null?"":formatTimestamp(postList[i].lastModified));
        postContent.innerHTML = postList[i].content;
    }

    //删除掉模板元素（第一个）
    posts_display.removeChild(document.getElementsByClassName("post_display")[0]);
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

/*等待DOM全部加载完毕以后，再插入数据*/
document.addEventListener("DOMContentLoaded", function() {
    getPostList();
});