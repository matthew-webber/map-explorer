import { configureStore } from '@reduxjs/toolkit';
import locationsReducer from './locationsSlice.js';
import mapReducer from './mapSlice.js';
import uiReducer from './uiSlice.js';

const store = configureStore({
    reducer: {
        locations: locationsReducer,
        map: mapReducer,
        ui: uiReducer,
    },
});

export { store };
