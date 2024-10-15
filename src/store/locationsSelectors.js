import { createSelector } from '@reduxjs/toolkit';

const selectLocations = (state) => state.locations;

export const selectLocationsList = createSelector(
    selectLocations,
    (locations) => {
        console.log('Getting locations from the store');
        return locations.locationsList;
    }
);
