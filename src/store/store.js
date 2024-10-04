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
            console.log(`asdf state.data ${state.data}`);
        },
        setMapCenter: (state, action) => {
            console.log(`asdf state.mapCenter ${state.mapCenter}`);
            state.mapCenter = action.payload;
        },
        setZoomLevel: (state, action) => {
            console.log(`asdf state.zoomLevel ${state.zoomLevel}`);
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
