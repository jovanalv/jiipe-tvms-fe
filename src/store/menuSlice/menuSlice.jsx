import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuGroups: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuGroups: (state, action) => {
      state.menuGroups = action.payload;
    },
    clearMenuGroups: (state) => {
      state.menuGroups = {};
    },
    rehydrateMenu: (state, action) => {
      state.menuGroups = action.payload || [];
    },
  },
});

export const { setMenuGroups, clearMenuGroups, rehydrateMenu } =
  menuSlice.actions;
export default menuSlice.reducer;
