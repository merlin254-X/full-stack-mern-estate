import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the user slice
const initialState = {
  currentUser: null, // Stores the current user's data
  error: null,       // Stores any error messages
  loading: false,    // Indicates if an operation is in progress
};

// Create the user slice
const userSlice = createSlice({
  name: 'user', // Name of the slice
  initialState,
  reducers: {
    // Sign-In Actions
    signInStart: (state) => {
      state.loading = true; // Set loading to true when sign-in starts
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Update currentUser with the payload
      state.loading = false; // Stop loading
      state.error = null; // Clear any previous error
    },
    signInFailure: (state, action) => {
      state.error = action.payload; // Update error with the payload
      state.loading = false; // Stop loading
    },

    // Update User Actions
    updateUserStart: (state) => {
      state.loading = true; // Set loading to true when update starts
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Update currentUser with the payload
      state.loading = false; // Stop loading
      state.error = null; // Clear any previous error
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload; // Update error with the payload
      state.loading = false; // Stop loading
    },

    // Delete User Actions
    deleteUserStart: (state) => {
      state.loading = true; // Set loading to true when delete starts
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear currentUser
      state.loading = false; // Stop loading
      state.error = null; // Clear any previous error
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload; // Update error with the payload
      state.loading = false; // Stop loading
    },

    // Sign-Out Actions
    signOutUserStart: (state) => {
      state.loading = true; // Set loading to true when sign-out starts
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null; // Clear currentUser
      state.loading = false; // Stop loading
      state.error = null; // Clear any previous error
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload; // Update error with the payload
      state.loading = false; // Stop loading
    },
  },
});

// Export actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

// Export the reducer to configure the store
export default userSlice.reducer;