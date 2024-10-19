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
        setMapCenter: (state, action) => {
            const { lat, lng } = action.payload;
            state.mapCenter = { lat: Number(lat), lng: Number(lng) };
        },
        setZoomLevel: (state, action) => {
            state.zoomLevel = Number(action.payload);
        },
        setMapBounds: (state, action) => {
            state.mapBounds = action.payload;
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

export const { setMapCenter, setZoomLevel, setMapBounds } = mapSlice.actions;
export const { selectMapCenter, selectZoomLevel, selectMapBounds } =
    mapSlice.selectors;
export default mapSlice.reducer;
