var url = "http://localhost:8080";

function redirectToHome() {
    //let urlHostname = window.parent.location.hostname;  //在内嵌框架中访问父文档的url
    window.parent.location.assign(url + "/home.html");
}

function redirectToPosts() {
    window.parent.location.assign(url + "/posts.html");
}

function redirectToAbout() {
    window.parent.location.assign(url + "/about.html");
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
    redirectToHome();
});

postsButton.addEventListener("click", function() {
    redirectToPosts();
});

aboutButton.addEventListener("click", function() {
    redirectToAbout();
});