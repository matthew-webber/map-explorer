const { configureStore, createSlice } = window.RTK;

const locationsSlice = createSlice({
    name: 'locations',
    initialState: {
        data: [],
        mapCenter: { lat: 32.7833, lng: -79.932 },
        zoomLevel: 7,
    },
    reducers: {
        setLocations: (state, action) => {
            state.data = action.payload;
        },
        setMapCenter: (state, action) => {
            state.mapCenter = action.payload;
        },
        setZoomLevel: (state, action) => {
            state.zoomLevel = action.payload;
        },
    },
});

const store = configureStore({      
    reducer: {
        locations: locationsSlice.reducer,
    },
});

const { setLocations, setMapCenter, setZoomLevel } = locationsSlice.actions;

export { store, setLocations, setMapCenter, setZoomLevel };
