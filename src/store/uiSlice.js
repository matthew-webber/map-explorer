import { createSlice } from '@reduxjs/toolkit';
import { updateLocation } from './actions.js';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedLocation: {
            id: null,
            name: null,
            lat: null,
            lng: null,
        },
        filterCategories: [],
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
        setFilterCategories: (state, action) => {
            state.filterCategories = action.payload;
        },
        
    },
    selectors: {
        selectSelectedLocation: (state) => state.selectedLocation,
        selectFilterCategories: (state) => state.filterCategories,
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

export const { setSelectedLocation, setFilterCategories } = uiSlice.actions;
export const { selectSelectedLocation, selectFilterCategories } =
    uiSlice.selectors;
export default uiSlice.reducer;
