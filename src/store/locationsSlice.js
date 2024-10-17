import { createSlice, createSelector } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        locationsList: { current: [] },
    },
    reducers: {
        setLocations: (state, action) => {
            console.log(`🍕: reducers.setLocations`);
            state.locationsList.current = action.payload;
        },
    },
    selectors: {
        selectLocations: (state) => state.locationsList.current,
    },
});

export const { setLocations } = locationsSlice.actions;
export const { selectLocations } = locationsSlice.selectors;
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
