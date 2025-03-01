let post_detail = document.getElementById("post_detail");
let posts_display = document.getElementById("posts_display");

// 自定义marked.js扩展处理数学公式
const inlineMathExtension = {
    name: 'inlineMath',
    level: 'inline',
    start(src) { return src.indexOf('$'); },
    tokenizer(src) {
        const rule = /^\$([^$]+)\$/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'inlineMath',
                raw: match[0],
                text: match[1].trim()
            };
        }
    },
    renderer(token) {
        try {
            return katex.renderToString(token.text, { throwOnError: false });
        } catch (error) {
            return `<span style="color:red;">${error.message}</span>`;
        }
    }
};

const blockMathExtension = {
    name: 'blockMath',
    level: 'block',
    start(src) { return src.indexOf('$$'); },
    tokenizer(src) {
        const rule = /^\$\$([\s\S]+?)\$\$/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'blockMath',
                raw: match[0],
                text: match[1].trim()
            };
        }
    },
    renderer(token) {
        try {
            return katex.renderToString(token.text, { displayMode: true, throwOnError: false });
        } catch (error) {
            return `<div style="color:red;">${error.message}</div>`;
        }
    }
};

// 应用扩展并配置marked
marked.use({ extensions: [inlineMathExtension, blockMathExtension] });

/**
 * 负责点击post_display时跳转到阅读界面。
 * 有可能点击的是主页的post，也有可能是posts页面的post。
 * @param id:post id
 * @param title: post title
 */
function read(id, title) {
    //将hello元素内容更换为post title
    let hello = document.getElementById("hello");
    hello.innerHTML = title;

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
        console.log(response.headers.get("content-type"));

        if (!response.ok) {
            throw new error("Fail to get post content!");
        }

        return response.text();
    })
    .then(data => {
        //渲染markdown
        let renderedContent = marked.parse(data);

        showPostContent(renderedContent);
    })
    .catch(error => console.log(error));
}

function showPostContent(content) {
    let post_content = document.getElementById("post_content");
    post_content.innerHTML = content;
}

function getBack() {
    //将hello元素内容改为Posts
    let hello = document.getElementById("hello");
    hello.innerHTML = "Posts";

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
    let id = urlParams.get("id");
    let title = urlParams.get("title");
    if (id !== null && title !== null) {
        read(id, title);
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
            let title = postList[i].getElementsByTagName("h3")[0].innerHTML;
            
            read(id, title);
        }
    }
})
