import { createSlice } from '@reduxjs/toolkit';

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
});

export const { setSelectedLocation } = uiSlice.actions;
export default uiSlice.reducer;
