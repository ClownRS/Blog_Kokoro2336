/**加载前端页面 */
function jumpToPosts(currentFrame) { 
    let posts_HTML = 'posts.html';

    /*直接用导入posts框架的HTML语句替代原本的HTML*/
    currentFrame.src = posts_HTML;
}

function jumpToHome(currentFrame) {
    let home_HTML = 'home.html';

    /*直接用导入posts框架的HTML语句替代原本的HTML*/
    currentFrame.src = home_HTML;
}