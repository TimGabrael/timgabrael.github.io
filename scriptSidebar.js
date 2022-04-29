var menuButton = document.getElementById("MenuBtn");
var sidebar = document.getElementById("sidebar");
var bodys = document.getElementsByTagName("body");



menuButton.addEventListener("click", ()=>{
    if(sidebar.classList.contains("sidebar-large-class"))
    {
        sidebar.classList.remove("sidebar-large-class");
        sidebar.classList.add("sidebar-small-class");
        for(var i = 0; i < bodys.length; i++)
        {
            bodys[i].classList.remove("body-expand-class");
            bodys[i].classList.add("body-shrink-class");
        }
    }
    else{
        sidebar.classList.remove("sidebar-small-class");
        sidebar.classList.add("sidebar-large-class");
        for(var i = 0; i < bodys.length; i++)
        {
            bodys[i].classList.remove("body-shrink-class");
            bodys[i].classList.add("body-expand-class");
        }
    }

});