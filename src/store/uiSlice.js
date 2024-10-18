import { createSlice } from '@reduxjs/toolkit';
import { updateLocation } from './actions.js'; // Import the new action

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedLocation: {
            id: null,
            name: null,
            lat: null,
            lng: null,
        },
    },
    reducers: {
        setSelectedLocation: (state, action) => {
            const {
                locationId,
                locationName,
                buildingLatitude,
                buildingLongitude,
            } = action.payload;

            state.selectedLocation = {
                id: locationId,
                name: locationName,
                lat: Number(buildingLatitude),
                lng: Number(buildingLongitude),
            };
        },
    },
    selectors: {
        selectSelectedLocation: (state) => state.selectedLocation,
    },
    extraReducers: (builder) => {
        builder.addCase(updateLocation, (state, action) => {
            const { location } = action.payload;

            state.selectedLocation = {
                id: location.locationId,
                name: location.locationName,
                latitude: Number(location.buildingLatitude),
                longitude: Number(location.buildingLongitude),
            };
        });
    },
});

export const { setSelectedLocation } = uiSlice.actions;
export const { selectSelectedLocation } = uiSlice.selectors;
export default uiSlice.reducer;
