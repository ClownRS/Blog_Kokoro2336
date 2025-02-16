function HTTPerror() {  //接受错误码
    //获取地址栏中传来的错误码
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    let hello = document.getElementById("hello");

    if (status < 200 || status >= 300) { //代表请求已发出，但服务器的响应状态码不在2xx范围之内。
        hello.innerHTML = "Error! Status: " + status;
    }
}