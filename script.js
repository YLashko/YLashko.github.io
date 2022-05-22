var chance = 0;
var amount = 0;
var LCamount = 0;

function createTables(json_data) {
    json_data.forEach(element => {
        var h = document.createElement("h2");
        h.innerHTML = element["Name"];
        document.getElementById("items-box").appendChild(h);
        createTable(element["Name"], element["Table"]);
    });
}

function createTable(tableName, data) {
    itemsBox = document.getElementById("items-box");
    var tableBox = document.createElement("div");
    tableBox.className = "table-box";

    counter = 0;
    data.forEach(element => {
        var img = document.createElement("img");
        img.src = element["Image"];
        img.className = "item-image";
        img.addEventListener("mousemove", function () {
            displayInfo(element["Name"], element["Content"]);
        });
        tableBox.appendChild(img);
        counter++;
    });

    itemsBox.appendChild(tableBox);
}

function displayInfo(elementName, innerHTML) {
    document.getElementById("item-name").innerHTML = elementName;
    document.getElementById("item-description").innerHTML = innerHTML;
}

function cut(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function inputChance(event, from) {
    if (!isNaN(event.value)){
        globalThis.chance = cut(event.value, 0, 100);
    }
    if (from == "N") {
        document.getElementById("chance-slider").value = globalThis.chance;
    } else {
        document.getElementById("chance-input").value = globalThis.chance;
    }
    calculateChance();
}

function inputAmount(event) {
    if (!isNaN(event.value)){
        globalThis.amount = cut(event.value, 0, 20);
    }
    document.getElementById("amount-slider").value = globalThis.amount;
    document.getElementById("amount-input").value = globalThis.amount;
    calculateChance();
}

function inputLCAmount(event) {
    if (!isNaN(event.value)){
        globalThis.LCamount = cut(event.value, 0, 5);
    }
    document.getElementById("LCamount-slider").value = globalThis.LCamount;
    document.getElementById("LCamount-input").value = globalThis.LCamount;
    calculateChance();
}

function calculateChance() {
    var result = 1 - ( Math.pow(Math.pow(1 - chance / 100, amount), LCamount + 1) );
    document.getElementById("result").innerHTML = (result * 100).toFixed(2) + "%";
}

fetch("info.json").then(res => res.json()).then(json_data => createTables(json_data));