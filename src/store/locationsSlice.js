import { createSlice, createSelector } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        locationsList: [],
        hideOutOfBoundsLocations: true,
    },
    reducers: {
        setLocations: (state, action) => {
            console.log(`🍕: reducers.setLocations`);
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

/*
import { createSelector } from '@reduxjs/toolkit';

const selectLocations = (state) => state.locations;

export const selectLocations = createSelector(
    selectLocations,
    (locations) => {
        console.log('Getting locations from the store');
        return locations.locationsList;
    }
);

*/
