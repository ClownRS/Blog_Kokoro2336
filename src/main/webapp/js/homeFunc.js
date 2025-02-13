function jumpToPost(post_block) {
    let post_link = post_block.getElementsByTagName("a")[0].getAttribute("herf");
    window.location.assign(post_link);
    /*herf: 直接跳转，并留下记录，不能后退
      assign(): 跳转且可以后退，留下记录
      replace()：不留下记录，不能后退*/
};