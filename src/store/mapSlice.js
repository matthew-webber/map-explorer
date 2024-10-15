import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        mapCenter: { lat: 32.7833, lng: -79.932 },
        zoomLevel: 7,
    },
    reducers: {
        setMapCenter: (state, action) => {
            state.mapCenter = action.payload;
        },
        setZoomLevel: (state, action) => {
            state.zoomLevel = action.payload;
        },
    },
});

export const { setMapCenter, setZoomLevel } = mapSlice.actions;
export default mapSlice.reducer;
