import { createSlice, createSelector } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        locationsList: [],
        hideOutOfBoundsLocations: true,
    },
    reducers: {
        setLocations: (state, action) => {
            state.locationsList = action.payload;
        },
    },
    selectors: {
        selectLocations: (state) => state.locationsList,
        selectHideOutOfBoundsLocations: (state) =>
            state.hideOutOfBoundsLocations,
    },
});

export const { setLocations } = locationsSlice.actions;
export const { selectLocations, selectHideOutOfBoundsLocations } =
    locationsSlice.selectors;
export default locationsSlice.reducer;
