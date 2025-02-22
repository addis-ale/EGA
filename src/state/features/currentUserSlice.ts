import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface CurrentUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface CurrentUserState {
  user: CurrentUser | null;
}

const initialState: CurrentUserState = {
  user: null,
};
const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});
export const { setUser, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
