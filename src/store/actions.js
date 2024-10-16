// Create a new file for shared actions
import { createAction } from '@reduxjs/toolkit';

// Action to update location details
export const updateLocation = createAction('location/updateLocation');
export const updateMapCenter = createAction('map/updateMapCenter');
export const updateZoomLevel = createAction('map/updateZoomLevel');
export const updateMapBounds = createAction('map/updateMapBounds');
