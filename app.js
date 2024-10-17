import MapExplorer from './src/components/map-explorer/MapExplorer.js';

// Assuming the MapExplorer class is properly exported and can be imported here
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the MapExplorer component when the DOM is fully loaded
    const mapExplorer = new MapExplorer();
    await mapExplorer.init();
    // await mapExplorer.render();
    // mapExplorer.subscribeToStore();
    // setTimeout(() => {
    //     const { bounds, zoom, center } =
    //         mapExplorer.map.getAllMapWidgetSpatialData();
    //     // set input values of matching inputs with ids of 'bounds', 'zoom', and 'center' to the values of bounds, zoom, and center
    //     document.getElementById('bounds').value = JSON.stringify(bounds);
    //     document.getElementById('zoom-level').value = zoom;
    //     document.getElementById('center').value = JSON.stringify(center);
    // }, 1000);
});
