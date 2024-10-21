import { createSlice } from '@reduxjs/toolkit';
import {
    updateLocation,
    updateMapCenter,
    updateZoomLevel,
    updateMapBounds,
} from './actions.js'; // Import the new actions

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        mapCenter: { lat: null, lng: null },
        zoomLevel: null,
        mapBounds: {
            north: null,
            east: null,
            south: null,
            west: null,
        },
    },
    reducers: {
        setMapState: (state, action) => {
            const { mapCenter, zoomLevel, mapBounds } = action.payload;
            state.mapCenter = { lat: Number(mapCenter.lat), lng: Number(mapCenter.lng) };
            state.zoomLevel = Number(zoomLevel);
            state.mapBounds = mapBounds;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateLocation, (state, action) => {
                const { latitude, longitude, zoomLevel, bounds } =
                    action.payload;
                state.mapCenter = {
                    lat: Number(latitude),
                    lng: Number(longitude),
                };
                state.zoomLevel = Number(zoomLevel);

                if (bounds) {
                    state.mapBounds = bounds;
                }
            })
            .addCase(updateMapCenter, (state, action) => {
                state.mapCenter = action.payload;
            })
            .addCase(updateZoomLevel, (state, action) => {
                state.zoomLevel = action.payload;
            })
            .addCase(updateMapBounds, (state, action) => {
                state.mapBounds = action.payload;
            });
    },
    selectors: {
        selectMapCenter: (state) => state.mapCenter,
        selectZoomLevel: (state) => state.zoomLevel,
        selectMapBounds: (state) => state.mapBounds,
    },
});

export const { setMapState } = mapSlice.actions; // Export the new combined action
export const { selectMapCenter, selectZoomLevel, selectMapBounds } =
    mapSlice.selectors;
export default mapSlice.reducer;
