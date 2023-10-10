import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      if (state.currentUser.subscribedChannels.includes(action.payload)) {
        state.currentUser.subscribersList =
          state.currentUser.subscribersList.filter(
            (subscribedUserId) => subscribedUserId !== action.payload
          );
        state.currentUser.subscribedChannels =
          state.currentUser.subscribedChannels.filter(
            (channelId) => channelId !== action.payload
          );
      } else {
        state.currentUser.subscribedChannels.push(action.payload);
      }
    },
    remove_subscriber: (state, action) => {
      state.currentUser.subscribersList =
        state.currentUser.subscribersList.filter(
          (subscribedUserId) => subscribedUserId !== action.payload
        );
      state.currentUser.subscribedChannels =
        state.currentUser.subscribedChannels.filter(
          (channelId) => channelId !== action.payload
        );
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  subscription,
  remove_subscriber,
} = userSlice.actions;

export default userSlice.reducer;
