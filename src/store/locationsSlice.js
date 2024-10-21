import { createSlice, createSelector } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        allLocations: [],
        filteredLocations: [],
        locationsInBounds: [],
        hideOutOfBoundsLocations: true, // TODO - move to UI slice
    },
    reducers: {
        setLocations: (state, action) => {
            state.allLocations = action.payload;
        },
        setFilteredLocations: (state, action) => {
            state.filteredLocations = action.payload;
        },
        setLocationsInBounds: (state, action) => {
            state.locationsInBounds = action.payload;
        },
    },
    selectors: {
        selectLocations: (state) => state.allLocations,
        selectFilteredLocations: (state) => state.filteredLocations,
        selectLocationsInBounds: (state) => state.locationsInBounds,
        selectHideOutOfBoundsLocations: (state) =>
            state.hideOutOfBoundsLocations,
    },
});

export const { setLocations, setFilteredLocations, setLocationsInBounds } = locationsSlice.actions;

export const {
    selectLocations,
    selectFilteredLocations,
    selectLocationsInBounds,
    selectHideOutOfBoundsLocations,
} = locationsSlice.selectors;

export default locationsSlice.reducer;
