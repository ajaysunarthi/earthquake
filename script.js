// Code goes here

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 20, lng: -120 },
    zoom: 2,
    styles: mapStyle
  });

 var circleColors = map.data.setStyle(styleColor);

  var script = document.createElement('script');
  script.setAttribute('src',
    'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function eqfeed_callback(data) {
  map.data.addGeoJson(data);
}

function styleColor(feature) {
  var low = [167, 53, 24];
  var high = [15, 69, 45];
  var minMagnitude = 1.0;
  var maxMagnitude = 5.5;

  var fraction = (Math.min(feature.getProperty('mag'), maxMagnitude) - minMagnitude) /
      (maxMagnitude - minMagnitude);

  var color = interpolateHsl(low, high, fraction);

  return {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeWeight: 0.3,
      strokeColor: '#fbfbfb',
      fillColor: color,
      fillOpacity: 2 / feature.getProperty('mag'),
      scale: Math.pow(feature.getProperty('mag'), 2)
    },
    zIndex: Math.floor(feature.getProperty('mag'))
  };
}

function interpolateHsl(lowHsl, highHsl, fraction) {
  var color = [];
  for (var i = 0; i < 3; i++) {
  color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
}

  return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

var map;

var mapStyle = [{
  'featureType': 'all',
  'elementType': 'all',
  'stylers': [{'visibility': 'off'}]
}, {
  'featureType': 'landscape',
  'elementType': 'geometry',
  'stylers': [{'visibility': 'on'}, {'color': 'red'}]
}, {
  'featureType': 'water',
  'elementType': 'labels',
  'stylers': [{'visibility': 'off'}]
}, {
  'featureType': 'water',
  'elementType': 'geometry',
  'stylers': [{'visibility': 'on'}, {'hue': 'blue'}]
}];