import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchedLocation: null,
    },
    reducers: {
        setSearchedLocation(state, action) {
            state.searchedLocation = action.payload;
        },
    },
});

export const { setSearchedLocation } = searchSlice.actions;
export const selectSearchedLocation = (state) => state.search.searchedLocation;
export default searchSlice.reducer;
