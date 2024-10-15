import { createSlice } from '@reduxjs/toolkit';
import { updateLocation } from './actions.js'; // Import the new action

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedLocation: null,
    },
    reducers: {
        setSelectedLocation: (state, action) => {
            state.selectedLocation = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateLocation, (state, action) => {
            const { location } = action.payload;
            state.selectedLocation = location;
        });
    },
});

export const { setSelectedLocation } = uiSlice.actions;
export default uiSlice.reducer;