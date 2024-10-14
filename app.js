import MapExplorer from './src/components/map-explorer/MapExplorer.js';

// Assuming the MapExplorer class is properly exported and can be imported here
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the MapExplorer component when the DOM is fully loaded
    const mapExplorer = new MapExplorer();
    await mapExplorer.init();
    await mapExplorer.render();
});
