let map_data;
let map_data_loaded = false;
let network_layer;
let mymap;

function determineColor(daStatus) {
    return daStatus ? "#59a14f" :
        "#e15759";
}

function completionColor(percentage) {
    return (percentage >= 85) ? "#59a14f" :
        (percentage >= 50) ? "#e8e86b" : "#e15759";
}

function completionColorOpen(percentage) {
    return (percentage == 0) ? "#59a14f" :
        "#e15759";
}

function setupICON(feature, latlng, filterValid) {
    return L.circleMarker(latlng, {
        stroke: true,
        color: "#000000",
        fillColor: determineColor(feature.properties[filterValid]),
        weight: 1,
        radius: 5,
        opacity: 1,
        fill: true,
        fillOpacity: 1
    });
}

function attachPopup(feature, maplayer) {
    var popupdata = "";
    var count = 0;
    var propertyName;

    for (var propertyName in feature.properties) {
        var propertyValue = feature.properties[propertyName];
        if (propertyName[0] == "_") {
            continue;
        }
        if (count == 0) {
            popupdata = propertyName + ": " + propertyValue;
        } else {
            popupdata = popupdata + "<br>" + propertyName + ": " + propertyValue;
        }
        count += 1;
    }
    ;

    popupdata = popupdata + "<br>" + "<a href=\"marinevalidator.html\" onclick=\"sessionStorage.buoyLookup = " + feature.properties.WMOID + ";\">Validator</a>";
    return maplayer.bindPopup(popupdata);
}

function filterMap() {
    if (!map_data_loaded) {
        return false;
    }
    console.log(map_data)
    network_layer.remove()
    var floc_id = document.getElementById("query-string").value;
    //var network = document.getElementById("query-network").value;
    var valid = document.getElementById("query-valid").value;

    if (floc_id != "") {
        network_layer = L.geoJSON(map_data, {
            pointToLayer: function (feature, latlng) {
                return setupICON(feature, latlng, valid);
            },
            onEachFeature: function (feature, maplayer) {
                attachPopup(feature, maplayer);
            },
            filter: function (feature) {
                console.log(feature)
                var floc_test = false;
                if (feature.properties.WMOID === floc_id) {
                    floc_test = true;
                }
                return floc_test
            }
        }).addTo(mymap);
        console.log(network_layer);
    }else{
        network_layer = L.geoJSON(map_data, {
            pointToLayer: function (feature, latlng) {
                return setupICON(feature, latlng, valid);
            },
            onEachFeature: function (feature, maplayer) {
                attachPopup(feature, maplayer);
            }
        }).addTo(mymap);
    }

}

async function get_page_data(resourse_path) {
    const response = await fetch(resourse_path);
    const data_json = await response.json();
    return data_json;
}

function loadMap() {
    mymap = L.map('mainView', {minZoom: 4, maxZoom: 6}).setView([55, -94], 4);
    mymap.attributionControl.addAttribution("Made with Natural Earth")
    var background_style = {color: "#bfbfbf", weight: 1};

    var response_promise = fetch("../data/map_data.json");


    response_promise
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, background_style).addTo(mymap);
            return fetch("../data/buoy_points.json");
        })
        .then(response => response.json())
        .then(data => {
            network_layer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return setupICON(feature, latlng, "Valid");
                },
                onEachFeature: function (feature, maplayer) {
                    attachPopup(feature, maplayer);
                }
            }).addTo(mymap);
            temp_text = '';
            for (var i = 0; i < data.length; i++) {
                temp_text += '<div class="payload-list"><p class=\"genericstyle\">WMOID: ' + data[i].properties['WMOID'] + '</p><p>Standard: ' + data[i].properties['Buoy Type'].replace("_", " ") + '</p></div>';
            }
            document.getElementById('stationslist').innerHTML += temp_text;
            map_data = data;
            map_data_loaded = true;
            return data;
        });

    var response_promise = fetch("../data/graph_data.json");

    response_promise
        .then(response => response.json())
        .then(data => {
            var temp_chart = document.getElementById('histchart');
            var temp_temp_chart = new Chart(temp_chart, data[0]);
            return data
        });

    var response_promise = fetch("../data/front_stats.json");
    var overall_stats = {};
    response_promise
        .then(response => response.json())
        .then(data => {
            overall_stats = data;
            document.getElementById("fstruct-text").innerHTML = overall_stats["total_floc_com"] + " / " + overall_stats["total_floc"];
            document.getElementById("char-text").innerHTML = overall_stats["total_char_com"] + " / " + overall_stats["total_char"];
            document.getElementById("wo-text").innerHTML = overall_stats["total_wo_com"] + " / " + overall_stats["total_wo"];
            document.getElementById("open-text").innerHTML = overall_stats["total_owo"];
            document.getElementById("fstruct-prog").style.width = ((overall_stats["total_floc_com"] / overall_stats["total_floc"]) * 100) + "%";
            document.getElementById("char-prog").style.width = ((overall_stats["total_char_com"] / overall_stats["total_char"]) * 100) + "%";
            document.getElementById("wo-prog").style.width = ((overall_stats["total_wo_com"] / overall_stats["total_wo"]) * 100) + "%";
            document.getElementById("open-prog").style.width = "100%"
            document.getElementById("fstruct-prog").style.backgroundColor = completionColor((overall_stats["total_floc_com"] / overall_stats["total_floc"]) * 100);
            document.getElementById("char-prog").style.backgroundColor = completionColor((overall_stats["total_char_com"] / overall_stats["total_char"]) * 100);
            document.getElementById("wo-prog").style.backgroundColor = completionColor((overall_stats["total_wo_com"] / overall_stats["total_wo"]) * 100);
            document.getElementById("open-prog").style.backgroundColor = completionColorOpen(overall_stats["total_owo"])
            return data
        });
}

window.addEventListener("load", loadMap);