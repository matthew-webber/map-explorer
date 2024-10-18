import { createSlice } from '@reduxjs/toolkit';

// "close enough" mapping of radius to zoom level
const radiusToZoomLevel = {
    10: 11.25,
    25: 10,
    50: 9,
};

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        result: {
            lat: null,
            lng: null,
        },
        radius: {
            value: 0, // in miles, not used currently
            zoomLevel: 0, // Google Maps zoom level
        },
        searchInProgress: false, // for allowing repeated searches
    },
    reducers: {
        startSearch(state, action) {
            const { query, lat, lng, radius } = action.payload;
            state.query = query;
            state.result = { lat, lng };
            state.radius = {
                value: Number(radius),
                zoomLevel: radiusToZoomLevel[Number(radius)],
            };
            state.searchInProgress = true;
        },
        endSearch(state) {
            state.searchInProgress = false;
        },
    },
});

export const { startSearch, endSearch } = searchSlice.actions;

export const selectSearched = (state) => state.search;

export default searchSlice.reducer;
