import { configureStore } from '@reduxjs/toolkit';
import locationsReducer from './locationsSlice.js';
import mapReducer from './mapSlice.js';
import uiReducer from './uiSlice.js';
import searchReducer from './searchSlice.js';

const store = configureStore({
    reducer: {
        locations: locationsReducer,
        map: mapReducer,
        ui: uiReducer,
        search: searchReducer,
    },
});

export { store };
