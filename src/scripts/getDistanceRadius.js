/* 
! http://www.movable-type.co.uk/scripts/latlong.html
This uses the ‘haversine’ formula to calculate the great-circle distance between two points – 
that is, the shortest distance over the earth’s surface – giving an ‘as-the-crow-flies’ distance 
between the points (ignoring any hills they fly over, of course!).
*/

export function getDistanceRadius(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres

  return d;
}

// const medicoComDistancia = {...medico, distancia: getDistanceRadius(latAtual,lonAtual, medico.lat, medico.lon)}
