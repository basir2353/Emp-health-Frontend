import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "./customStorage";
import onboardSlice from "../features/onboardSlice";
import appointmentsReducer from "../redux/appointments/appointmentSlice";
import reportReducer from "../redux/report/reportSlice";
// import testappoin
import testAppointmentReducer from "../redux/test/testSlice";

const persistConfig: any = {
  key: "app",
  storage,
};

const rootReducer = combineReducers({
  onboard: onboardSlice,
  appointments: appointmentsReducer,
  report: reportReducer,
  TestAppointment: testAppointmentReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;