var elem = document.querySelector(".fave_photos_page_block").cloneNode(true);
elem.classList.add("navigation_pan");
document.querySelector(".wall_module").appendChild(elem);
elem.innerHTML = "<style>.navigation_pan {display: flex;justify-content: space-evenly; font-weight: bold;} .hid {display: none;} #activeButton {background-color: black; color: white;} .navigation_pan div {padding:3px; margin:0;} .btn:hover {color:red}</style>"


var massive = [0];
var gotend = new Event("gotend")
function getEndAs(massive) {
    if(!cur.isFeedLoading){
        var e,t=ge("feed_rows_next");
        "live"==cur.section&&(cur.all_shown=!0);
        var o=ge("show_more_link");
        if(cur.all_shown&&(hide(o),show("all_shown")),"live"!=cur.section){
            var i=feed.getSectionParams(cur.section||"news");
            extend(i,{offset:cur.offset,from:cur.from,part:1,more:1,last_view:cur.options.last_view});
            ajax.post("al_feed.php?sm_"+cur.section,i,{onDone:function(e,t){
                if(t){feed.applyOptions(e);
                      massive.push(e.offset-10);
                      getEndAs(massive);
                      }
                else {document.body.dispatchEvent(gotend);}
            },cache:1})}}
}

getEndAs(massive);

function generateNavPan() {
    var start = document.createElement("div");
    start.innerHTML="«";
    start.setAttribute("onclick", "moderateThenShow(document.querySelector('.btn'))")
    elem.appendChild(start);
    for (i=0; i<massive.length; i++) {
        var btn = document.createElement("div");
        btn.classList.add("btn");
        btn.innerHTML = [i+1].toString();
        btn.setAttribute("onclick", "moderateThenShow(this)");
        btn.setAttribute("data-offset", massive[i]);
        if (i>12) {btn.classList.add("hid")}
        elem.appendChild(btn);
    }
    var end = document.createElement("div");
    end.innerHTML="»";
    end.setAttribute("onclick", "moderateThenShow(document.querySelectorAll('.btn')[document.querySelectorAll('.btn').length - 1])")
    elem.appendChild(end);
}

cur.disableAutoMore=1

function moderateThenShow(btn) {
    var num = Number(btn.innerText) - 1;
    if (document.getElementById("activeButton") != undefined) {
         document.getElementById("activeButton").removeAttribute("id")}
    btn.setAttribute("id", "activeButton");
    var elements = document.querySelectorAll(".btn");
    if (elements.length > 13) {
        for (i=0; i<elements.length; i++) {
            if (!elements[i].classList.contains("hid")) elements[i].classList.add("hid");
        }
        for (i=0; i<7; i++) {
            if (elements[num+i]) {
                elements[num+i].classList.remove("hid")}
            else {elements[num+i-13].classList.remove("hid")}
            if (elements[num-i]) {
                elements[num-i].classList.remove("hid")}
            else {elements[i+6].classList.remove("hid")}
        }
    }
    showMore(btn.getAttribute("data-offset"));
}

showMore = function(offs){var i=feed.getSectionParams(cur.section||"news");extend(i,{offset:offs,part:1,more:1,last_view:cur.options.last_view}),cur.options.feedback_list&&(i.list=cur.options.feedback_list);ajax.post("al_feed.php?sm_"+cur.section,i,{onDone:function(e,t){if(t){var o,i=ce("div");for(i.innerHTML=t,document.querySelector("#feed_rows").innerHTML="";o=i.firstChild;){(cur.rowsCont.appendChild(o),Feed.onPostLoaded(o,!0))}}}})}

document.body.addEventListener("gotend", generateNavPan);

window.addEventListener("keydown", function(e) {
    if (e.keyCode == 37 && document.querySelector("#activeButton").previousSibling.classList.contains("btn")) {
        moderateThenShow(document.querySelector("#activeButton").previousSibling)
    } 
    else if (e.keyCode == 39 && document.getElementById("activeButton").nextSibling.classList.contains("btn")) {
        moderateThenShow(document.getElementById("activeButton").nextSibling)
    }
})