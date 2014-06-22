var stockholm = new google.maps.LatLng(28.661671, 77.228179);
var start = new google.maps.LatLng(28.661671, 77.228179);
var end = new google.maps.LatLng(28.544493, 77.272421);
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var geocoder;
var myroute;
var distance, distanceText;
var estimatedTime, radius;
var type='';
var circle;

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 11,
        center: stockholm
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    directionsDisplay.setMap(map);
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        distanceListener();
    });

    initRoute();
}


function toggleBounce() {
    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}


function initRoute() {
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function getStartEnd() {
    var result = directionsDisplay.getDirections();
    distance = result.routes[0].legs[0].distance.value;
    distanceText = result.routes[0].legs[0].distance.text;
    estimatedTime = result.routes[0].legs[0].duration.text;
    myroute = result.routes[0].overview_path;
    var len = myroute.length;
    var startPos = myroute[0];
    var endPos = myroute[len - 1];
    return [startPos, endPos];
}

function distanceListener() {
//    console.log('start' + startMarker.getPosition().lat() + ', ' + startMarker.getPosition().lng());
//        console.log('end' + endMarker.getPosition().lat() + ', ' + endMarker.getPosition().lng());
    var cords = getStartEnd();
    var startCord = cords[0];
    var endCord = cords[1];
    geocoder.geocode({'latLng': startCord}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                document.getElementById('startPlace').innerHTML = results[1].formatted_address;
                if(type=='r'){
                    radius = $('#radius').val();
                    drawCircle(results[1].geometry.location, radius);
                }
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
    geocoder.geocode({'latLng': endCord}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                document.getElementById('endPlace').innerHTML = results[1].formatted_address;
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
    document.getElementById('distance').innerHTML = distanceText;
    document.getElementById('estimate').innerHTML = estimatedTime;
}

function postData(){
      radius = 0;
      var url = "/save_journey/";
      var dataType = 'json';
      if(type == 'r'){
        radius = $('#radius').val();
          url = "/get_results/";
          dataType='html';
      }

      var data = JSON.stringify({
          cords: myroute,
          time: document.getElementById('dateStart').value,
          start: document.getElementById('startPlace').innerHTML,
          end: document.getElementById('endPlace').innerHTML,
          radius: radius,
          distance: distance
      });
        $.ajax({
        type: "POST",
        url: url,
        dataType: dataType,
        data: data,
        success: function (data) {
            if(type=='r'){
                window.location.href = "/search_results/";
            }
            else{
                window.location.href = '/trip_success/';
            }

        },
        error: function () {
            console.log('Error getting options list...')
        }
    });
    console.log(data);
}

function drawCircle(loc, r) {
        if (circle != undefined)
            circle.setMap(null);
        var radius = parseInt(r)*1000;
        var options = {
            strokeColor: '#800000',
            strokeOpacity: 1.0,
            strokeWeight: 1,
            fillColor: '#C64D45',
            fillOpacity: 0.5,
            map: map,
            center: loc,
            radius: radius
        };
        circle = new google.maps.Circle(options);
    }