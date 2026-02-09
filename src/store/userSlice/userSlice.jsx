import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  isFetched: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.isFetched = true;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.isFetched = false;
    },
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
