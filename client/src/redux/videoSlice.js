import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideo: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    like: (state) => {
      state.currentVideo.likes +=1;
    },
    unlike: (state) => {
      state.currentVideo.likes -=1;
    },
    share: (state) => {
      state.currentVideo.shareCount +=1;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, unlike, share } = videoSlice.actions;

export default videoSlice.reducer;
