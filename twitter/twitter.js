var elem = document.querySelector(".ProfileHeading-toggle");

document.getElementById("stream-items-id").removeAttribute("class");
document.getElementById("stream-items-id").setAttribute("id", "loadingSet");
document.getElementById("loadingSet").setAttribute("style", "list-style-type: none; margin: 0;");

var indexes = ["none"];

function getEndAs(massive) {
	massive.push(document.getElementById("loadingSet").lastChild.previousSibling.getAttribute("data-item-id"));
	var req = new XMLHttpRequest;
	req.open("GET", "https://twitter.com/i/profiles/show/" + document.querySelector(".u-linkComplex-target").innerText + "/timeline/tweets?include_available_features=1&include_entities=1&max_position=" + massive[massive.length-1] + "&reset_error_state=false", false);
	req.send();
	var response = req.response;
	response = JSON.parse(response);
	if (response.items_html.trim() !== "") {
		document.getElementById("loadingSet").innerHTML = response.items_html;
		getEndAs(massive);
	}
	else {
		alert("Готово!");
		elem.innerHTML = "";
		req.open("GET", "https://twitter.com/i/profiles/show/" + document.querySelector(".u-linkComplex-target").innerText + "/timeline/tweets", false);
		req.send();
		var response = req.response;
		response = JSON.parse(response);
		document.getElementById("loadingSet").innerHTML = response.items_html;
		generateNavPan();
	};
}

getEndAs(indexes);

function generateNavPan() {
    for (i=0; i<indexes.length-1; i++) {
        var btn = document.createElement("div");
        btn.classList.add("btn");
        btn.innerHTML = [i+1].toString();
        btn.setAttribute("onclick", "showTweets(btn)");
        btn.setAttribute("data-offset", indexes[i]);
        if (i>12) {btn.classList.add("hid")}
        elem.appendChild(btn);
    }
}

function showTweets(btn) {
	var max_position = btn.getAttribute("data-offset");
	if (max_position === "none") {
		req.open("GET", "https://twitter.com/i/profiles/show/" + document.querySelector(".u-linkComplex-target").innerText + "/timeline/tweets", false);
	}
	else {req.open("GET", "https://twitter.com/i/profiles/show/" + document.querySelector(".u-linkComplex-target").innerText + "/timeline/tweets?include_available_features=1&include_entities=1&max_position=" + max_position + "&reset_error_state=false", false)};
	req.send();
	var response = req.response;
	response = JSON.parse(response);
	document.getElementById("loadingSet").innerHTML = response.items_html;
	if (document.querySelector(".stream-end-inner")) {document.querySelector(".stream-end-inner").remove()}
}