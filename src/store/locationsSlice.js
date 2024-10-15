import { createSlice } from '@reduxjs/toolkit';

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        data: [],
    },
    reducers: {
        setLocations: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setLocations } = locationsSlice.actions;
export default locationsSlice.reducer;
