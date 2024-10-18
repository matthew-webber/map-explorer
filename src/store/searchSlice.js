import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchQuery: null,
        searchResult: null,
    },
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setSearchResult(state, action) {
            state.searchResult = action.payload;
        },
    },
});

export const { setSearchQuery, setSearchResult } = searchSlice.actions;
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectSearchResult = (state) => state.search.searchResult;
export default searchSlice.reducer;
