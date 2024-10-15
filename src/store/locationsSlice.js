import { createSlice, createSelector } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        locationsList: { current: [], changed: false },
    },
    reducers: {
        setLocations: (state, action) => {
            console.log(`🍕: reducers.setLocations`);
            state.locationsList.previous = state.locationsList.current;
            state.locationsList.current = action.payload;
            state.locationsList.changed = true;
        },
        toggleLocationsChanged: (state) => {
            state.locationsList.changed = !state.locationsList.changed;
        },
    },
    selectors: {
        selectLocations: (state) => state.locationsList.current,
        selectPreviousLocations: (state) => state.locationsList.previous,
        selectLocationsChanged: (state) => state.locationsList.changed,
    },
});

export const { setLocations, toggleLocationsChanged } = locationsSlice.actions;
export const {
    selectLocations,
    selectPreviousLocations,
    selectLocationsChanged,
} = locationsSlice.selectors;
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
