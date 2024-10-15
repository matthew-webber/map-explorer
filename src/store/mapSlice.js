import { createSlice } from '@reduxjs/toolkit';
import { updateLocation } from './actions.js'; // Import the new action

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        mapCenter: { lat: 32.7833, lng: -79.932 },
        zoomLevel: 7,
    },
    reducers: {
        setMapCenter: (state, action) => {
            console.log('🍕: selectors.setMapCenter');
            const { latitude, longitude } = action.payload;
            console.log(`🍕: selectors.setMapCenter ${latitude} ${longitude}`);
            state.mapCenter = { lat: Number(latitude), lng: Number(longitude) };
        },
        setZoomLevel: (state, action) => {
            state.zoomLevel = Number(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateLocation, (state, action) => {
            const { latitude, longitude, zoomLevel } = action.payload;
            state.mapCenter = { lat: Number(latitude), lng: Number(longitude) };
            state.zoomLevel = Number(zoomLevel);
        });
    },
    selectors: {
        selectMapCenter: (state) => state.mapCenter,
        selectZoomLevel: (state) => state.zoomLevel,
    },
});

export const { setMapCenter, setZoomLevel } = mapSlice.actions;
export const { selectMapCenter, selectZoomLevel } = mapSlice.selectors;
export default mapSlice.reducer;
