import { configureStore } from '@reduxjs/toolkit';
import globalEstimateForm from "./globalEstimateForm";

const store = configureStore({
  reducer: {
    globalEstimateForm: globalEstimateForm,
  },
});

export default store;