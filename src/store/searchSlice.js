import { createSlice } from '@reduxjs/toolkit';

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
        radius: 0,
    },
    reducers: {
        setSearch(state, action) {
            const { query, lat, lng, radius } = action.payload;
            state.query = query;
            state.result = { lat, lng };
            state.radius = Number(radius);
        },
        setSearchResult(state, action) {
            const { lat, lng } = action.payload;
            state.searchResult = { lat, lng };
        },
        setSearchRadius(state, action) {
            state.searchRadius = Number(action.payload);
        },
    },
});

export const { setSearch } = searchSlice.actions;

export const selectSearchQuery = (state) => state.search.query;
export const selectSearchResult = (state) => state.search.result;
export const selectSearchRadius = (state) =>
    radiusToZoomLevel[state.search.radius];

export default searchSlice.reducer;
