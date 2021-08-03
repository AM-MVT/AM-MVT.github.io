
function determineColor(daStatus) {
  return daStatus ? "#59a14f" :
    "#e15759";
}

function setupICON(feature, latlng) {
  return L.circleMarker(latlng, {
    stroke: true,
    color: "#000000",
    fillColor: determineColor(feature.properties.Valid),
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
    if (count == 0) {
      popupdata = propertyName + ": " + propertyValue;
    } else {
      popupdata = popupdata + "<br>" + propertyName + ": " + propertyValue;
    }
    count += 1;
  };

  popupdata = popupdata + "<br>" + "<a href=\"marinevalidator.html\" onclick=\"sessionStorage.buoyLookup = " + feature.properties.WMOID + ";\">Validator</a>"
  return maplayer.bindPopup(popupdata);
}

async function get_page_data(resourse_path) {
  const response = await fetch(resourse_path);
  const data_json = await response.json();
  return data_json;
}

function loadMap() {
  var mymap = L.map('mainView', { minZoom: 4, maxZoom: 6 }).setView([55, -94], 4);
  mymap.attributionControl.addAttribution("Made with Natural Earth")
  var background_style = { color: "#bfbfbf", weight: 1 };

  var response_promise = fetch("../data/map_data.json")

  response_promise
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, background_style).addTo(mymap)
      return fetch("../data/buoy_points.json")
    })
    .then(response => response.json())
    .then(data => {
      stationLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return setupICON(feature, latlng);
        },
        onEachFeature: function (feature, maplayer) {
          attachPopup(feature, maplayer);
        }
      }).addTo(mymap);
      temp_text = '';
      for (var i = 0; i < data.length; i++) {
        temp_text += '<p class=\"genericstyle\">WMOID: ' + data[i].properties['WMOID'] + ' Standard:' + data[i].properties['Buoy Type'] + '</p>';
      }
      document.getElementById('stationslist').innerHTML += temp_text;
      return data
    })

  var response_promise = fetch("../data/graph_data.json")

  response_promise
    .then(response => response.json())
    .then(data => {
      var temp_chart = document.getElementById('histchart');
      var temp_temp_chart = new Chart(temp_chart, data[0]);
      return data
    });

  var response_promise = fetch("../data/front_stats.json")
  var overall_stats = {};
  response_promise
  .then(response => response.json())
    .then(data => {
      overall_stats = data;
      var total_complete = overall_stats["Total Buoys"] - overall_stats["Total Failures"];
  document.getElementById("bottomStats").innerHTML = "<h1>Total Completion: " + total_complete + "/" + overall_stats["Total Buoys"] + "&emsp;Total Buoy Notes: " + overall_stats["Total Buoy Notes"] + "&emsp;Total Work Order Issues: " + overall_stats["Total Work Order Issues"];
      return data
    });
}

window.addEventListener("load", loadMap);