
const appEl = document.getElementById("app");
const searchEl = document.getElementById("search");

async function gettingData(question) {
    appEl.innerHTML = "";
    if (question) {
        let response = await fetch(
            `https://apodapi.herokuapp.com/search/?number=5&search_query=${question}`
        );
        try {
            let data = await response.json();
            console.log(data);
            if (data.error) {
                appEl.innerHTML = "Brak wyników";
            }
            data.forEach(el => {
                displayData(el);
            });
        } catch (err) {
            console.error(err);
        }
    }
    if (!question) {
        let response = await fetch("https://apodapi.herokuapp.com/api/?count=5");
        try {
            let data = await response.json();
            data.forEach(el => {
                displayData(el);
            });
        } catch (err) {
            console.error(err);
        }
    }
}

function displayData(data) {
    const art = document.createElement("article");

    if (data.media_type === "image") {
        let imgData = document.createElement("img");

        imgData.setAttribute("src", data.url);
        art.appendChild(imgData);

        imgData.addEventListener("click", function () {
            let imgBox = document.createElement("img");
            imgBox.setAttribute("src", "https://picsum.photos/536/354");
            document.body.appendChild(imgBox);
            imgBox.classList.add("lightbox");

            imgBox.addEventListener("click", () => {
                imgBox.parentNode.removeChild(imgBox);
            });
        });
    }
    if (data.media_type === "video") {
        let youtubeVideo = document.createElement("iframe");
        youtubeVideo.setAttribute("src", data.url);
        art.appendChild(youtubeVideo);
    }

    let title = document.createElement("h1");
    let nodeTitle = document.createTextNode(data.title);
    title.appendChild(nodeTitle);
    art.appendChild(title);
    let btn = document.createElement("button");
    btn.style.fontSize = "30px";
    btn.innerText = "+";


    art.appendChild(btn);
    btn.addEventListener("click", () => {
        let dataUrl = localStorage.getItem(data.url);
        dataUrl = dataUrl != null ? dataUrl : 0;
        dataUrl = typeof dataUrl === "string" ? parseInt(dataUrl) : dataUrl;
        dataUrl += 1;

        localStorage.setItem(data.url, dataUrl);

        updateBtn(dataUrl);
    });
    appEl.appendChild(document.createElement("hr"));


    let dataUrl = localStorage.getItem(data.url);
    updateBtn(dataUrl);

    function updateBtn(num) {
        btn.style.backgroundColor = num % 2 === 0 ? "gray" : "blue";
    }

    let descr = document.createElement("p");
    let nodeDescr = document.createTextNode(data.description);
    descr.appendChild(nodeDescr);
    art.appendChild(descr);
    truncateText(descr);


    appEl.appendChild(art);

    let fav = document.getElementById("fav");
    fav.addEventListener("click", () => {

    })
}

function truncateText(descr) {
    let isWholeTextDisplayed = false;
    let text = descr.innerHTML;
    if (text.length > 100) {
        let truncate = descr.innerHTML.slice(0, 80);
        descr.innerHTML = truncate + "...";
        descr.addEventListener("click", () => {
            if (!isWholeTextDisplayed) {
                descr.innerHTML = truncate + "...";
            } else {
                descr.innerHTML = text;
            }
            isWholeTextDisplayed = !isWholeTextDisplayed;
        });
    }
}

searchEl.addEventListener("submit", e => {
    e.preventDefault();
    let enteredData = e.target.elements["inputField"].value;
    gettingData(enteredData);
});

gettingData();
