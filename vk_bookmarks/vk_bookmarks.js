cur.autoList._state = "done";

var navigationPan = document.querySelector(".page_block_header_inner._header_inner");
navigationPan.classList.add("navigation_pan");
var navigationContainer = document.querySelector(".page_block.bookmark_block .page_block_h2");
navigationContainer.classList.add("navigation_container");
document.querySelector(".page_block_header.clear_fix").appendChild(navigationPan);


var massive = [0];
var gotend = new Event("gotend")
function getEndAs(massive, tag) {
	if (tag===undefined) {tag = "0"};
	var req = new XMLHttpRequest;
	req.open("POST", cur.autoList._containerEl.baseURI + "?act=more&al=1&offset=" + massive[massive.length-1].toString() + "&tag=" + tag, false);
	req.send();
	var response = req.response;
	response = response.replace(/\\"/g, '"');
	response = response.replace(/\\n/g, '');
	response = response.replace(/\\\//g, '\/');
	response = response.replace(/\",\"/g, '');			
	response = response.replace(/\<\!\-\-.*?\<\!json\>/g, '');	
	response = response.slice(2, -2);
	if (response) {
		var html = document.createElement("html");
		html.innerHTML = response;
		if (html.querySelectorAll(".page_block.bookmark_block").length > 15) {
			massive.push(massive[massive.length-1]+15);
		}
		massive.push(massive[massive.length-1]+15);
		getEndAs(massive, tag);
		}
	else {generateNavPan(tag);}
}

getEndAs(massive);

function generateNavPan(tag) {
    var start = document.createElement("div");
    start.innerHTML="«";
    start.setAttribute("onclick", "moderateThenShow(document.querySelector('.btn'), " +  tag + ")");
	navigationPan.innerHTML = "<style>.navigation_pan {display: flex;justify-content: space-evenly; font-weight: bold;} .hid {display: none;} #activeButton {background-color: black; color: white;border-radius:10px;} .navigation_pan div {padding:3px; margin:0;} .btn:hover {color:red} #ui_rmenu_tags_dropdown_list a {display: block; margin-left: 20px; line-height: 2; color: #777777;}</style>"
    navigationPan.appendChild(start);
    for (i=0; i<massive.length-1; i++) {
        var btn = document.createElement("div");
        btn.classList.add("btn");
        btn.innerHTML = [i+1].toString();
        btn.setAttribute("onclick", "moderateThenShow(this, " +  tag + ")");
        btn.setAttribute("data-offset", massive[i]);
        if (i>12) {btn.classList.add("hid")}
        navigationPan.appendChild(btn);
    }
    var end = document.createElement("div");
    end.innerHTML="»";
    end.setAttribute("onclick", "moderateThenShow(document.querySelectorAll('.btn')[document.querySelectorAll('.btn').length - 1], " +  tag + ")")
    navigationPan.appendChild(end);
	if (tag==="0") {
		document.querySelector(".bookmarks_rows").insertBefore(navigationContainer, document.querySelector(".bookmarks_rows").firstChild);
	}
	else  {
		document.querySelector(".page_block_h2").replaceWith(navigationContainer);
		moderateThenShow(document.querySelector('.btn'), tag)
	}
	
}


function moderateThenShow(btn, tag) {
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
    showMore(btn.getAttribute("data-offset"), tag);
}

showMore = function(offs, tag){
	var element = document.querySelector(".navigation_container").cloneNode(true);
	var req = new XMLHttpRequest;
	req.open("POST", cur.autoList._containerEl.baseURI + "?act=more&al=1&offset=" + offs.toString() + "&tag=" + tag, false);
	req.send();
	var response = req.response;
	response = response.replace(/\\"/g, '"');
	response = response.replace(/\\n/g, '');
	response = response.replace(/\\\//g, '\/');
	response = response.replace(/\",\"/g, '');			
	response = response.replace(/\<\!\-\-.*?\<\!json\>/g, '');	
	response = response.slice(2, -2);
	var html = document.createElement("html");
	html.innerHTML = response;
	if (offs==0) {
		html.querySelector(".page_block_h2").remove();
	}
	document.querySelector(".bookmarks_rows").innerHTML = "";
	for (i = 0; i < 15; i++) {
		if (html.querySelectorAll(".page_block.bookmark_block")[i]) {
			document.querySelector(".bookmarks_rows").appendChild(html.querySelectorAll(".page_block.bookmark_block")[i]);
		}
	}
	document.querySelector(".bookmarks_rows").insertBefore(element, document.querySelector(".bookmarks_rows").firstChild);
}

document.body.addEventListener("gotend", generateNavPan);

window.addEventListener("keydown", function(e) {
    if (e.keyCode == 37 && document.querySelector("#activeButton").previousSibling.classList.contains("btn")) {
        moderateThenShow(document.querySelector("#activeButton").previousSibling)
    } 
    else if (e.keyCode == 39 && document.getElementById("activeButton").nextSibling.classList.contains("btn")) {
        moderateThenShow(document.getElementById("activeButton").nextSibling)
    }
})

for (i=0; i<document.querySelectorAll("#ui_rmenu_tags_dropdown_list a").length; i++) {
	var a = document.createElement("a");
	a.setAttribute("data-tag", document.querySelectorAll("#ui_rmenu_tags_dropdown_list a")[i].getAttribute("data-id"));
	a.innerHTML = document.querySelectorAll("#ui_rmenu_tags_dropdown_list a")[i].querySelector("span").innerHTML;
	document.querySelectorAll("#ui_rmenu_tags_dropdown_list a")[i].replaceWith(a);
}

document.querySelector("#ui_rmenu_tags_dropdown_list").addEventListener("click", function(e) {
	if (e.target.hasAttribute("data-tag")) {
		massive = [0];
		getEndAs(massive, e.target.getAttribute("data-tag"));
	}
})