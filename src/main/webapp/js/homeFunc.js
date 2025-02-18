/*等待DOM全部加载完毕以后，再插入数据*/
document.addEventListener("DOMContentLoaded", function() {
    getPostList("/home/load");
});