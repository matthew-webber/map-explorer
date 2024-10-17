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
        // mapCenter: { lat: 32.7833, lng: -79.932 },
        zoomLevel: null,
        // zoomLevel: 7,
        mapBounds: {
            north: null,
            east: null,
            south: null,
            west: null,
        },
        // mapBounds: {
        //     // represents the bounds for the above center and zoom level
        //     north: 36.749773313125786,
        //     east: -77.505279734375,
        //     south: 30.81958157411624,
        //     west: -84.822174265625,
        // },
    },
    reducers: {
        setMapCenter: (state, action) => {
            console.log('🍕: selectors.setMapCenter');
            const { lat, lng } = action.payload;
            console.log(`🍕: selectors.setMapCenter ${lat} ${lng}`);
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
                    console.log(`🍕: updateLocation bounds`, bounds);
                    state.mapBounds = bounds;

                    // console.log(`🍕: updateLocation
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
