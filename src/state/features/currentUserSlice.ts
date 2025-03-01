import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUser } from "@/actions/getCurrentUser";

export interface CurrentUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface CurrentUserState {
  user: CurrentUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CurrentUserState = {
  user: null,
  status: "idle",
};

// Fetch user data on app start
export const fetchUser = createAsyncThunk("currentUser/fetchUser", async () => {
  const user = await getCurrentUser();
  return user ?? null;
});

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Store user
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Clear stored user
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<CurrentUser | null>) => {
          state.status = "succeeded";
          state.user = action.payload;
          if (action.payload) {
            localStorage.setItem("user", JSON.stringify(action.payload));
          }
        }
      )
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setUser, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;
