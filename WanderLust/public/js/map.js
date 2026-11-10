
const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map',
    center: listing.geometry.coordinates,
    zoom: 9,
    style: 'mapbox://styles/mapbox/streets-v12'
});

const marker = new mapboxgl.Marker({
    color: "red"
})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.title}</h4>
             <p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);

// Recalculate map dimensions after initialization
map.on('load', () => {
    map.resize();
});
