import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./appointments/appointmentSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;