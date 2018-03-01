window.onload = function() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    // s.async = true;
    s.src = "./browser_action_build.js";
    var x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
};
