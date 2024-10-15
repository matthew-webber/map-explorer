import { createSlice } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        locationsList: [],
    },
    reducers: {
        setLocations: (state, action) => {
            state.locationsList = action.payload;
        },
    },
});

export const { setLocations } = locationsSlice.actions;
export default locationsSlice.reducer;
