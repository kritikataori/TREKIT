//MAPBOX
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     conatiner: 'map',
//     style: 'mapbox://styles/mapbox/light-v10', //stylesheet location
//     center: campground.geometry.coordinates, //initial position
//     zoom: 10 //starting zoom
// });

// new mapboxgl.Marker()
//     .setLngLat(campground.geometry.coordinates)
//     .setPopup(
//         new mapboxgl.Popup({offset: 25})
//         .setHTML( //pass a string of html
//             `<h3>${campground.title}</h3><p>${campground.location}</p>`
//         )
//     )
//     .addTo(map)

//MAPTILER
maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)