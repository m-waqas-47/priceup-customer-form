import { createSlice } from "@reduxjs/toolkit";
export const getProjectDetails = (state) =>
  state.globalEstimateForm.projectDetails;
export const getLocation = (state) => state.globalEstimateForm.location;
export const getEstimateCategory = (state) => state.globalEstimateForm.category;
export const getEstimateLayout = (state) => state.globalEstimateForm.layout;
export const getEstimateDetail = (state) =>
  state.globalEstimateForm.estimateDetails;
export const getReviewDetail = (state) =>
  state.globalEstimateForm.reviewDetails;
export const getEstimates = (state) => state.globalEstimateForm.estimates;

const initialState = {
  location: "",
  projectDetails: {},
  category: "",
  layout: "",
  estimateDetails: {},
  reviewDetails: {},
  estimates: [],
};

const globalEstimateForm = createSlice({
  name: "globalEstimateForm",
  initialState,
  reducers: {
    resetFormState: (state) => {
      return {
        ...initialState,
        location: state.location,
      };
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setProjectDetails: (state, action) => {
      state.projectDetails = action.payload;
    },
    setEstimateCategory: (state, action) => {
      state.category = action.payload;
    },
    setEstimateLayout: (state, action) => {
      state.layout = action.payload;
    },
    setEstimateDetail: (state, action) => {
      state.estimateDetails = action.payload;
    },
    setReviewDetail: (state, action) => {
      state.reviewDetails = action.payload;
    },
    setEstimatesCollection: (state, action) => {
      state.estimates = [...state.estimates, action.payload];
    },
    deleteCollectionItem: (state, action) => {
      state.estimates = state.estimates.filter(
        (estimate) => estimate.id !== action.payload
      );
    },
  },
});
export const {
  resetFormState,
  setLocation,
  setProjectDetails,
  setEstimateCategory,
  setEstimateLayout,
  setEstimateDetail,
  setReviewDetail,
  setEstimatesCollection,
  deleteCollectionItem,
} = globalEstimateForm.actions;
export default globalEstimateForm.reducer;
