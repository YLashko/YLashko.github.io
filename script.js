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
    console.log(elementName, "|||", innerHTML);
    document.getElementById("item-name").innerHTML = elementName;
    document.getElementById("item-description").innerHTML = innerHTML;
}

fetch("info.json").then(res => res.json()).then(json_data => createTables(json_data));