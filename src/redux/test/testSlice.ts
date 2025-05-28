import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
}

interface TestAppointmentState {
  appointments: Appointment[];
}

const initialState: TestAppointmentState = {
  appointments: [],
};

const testAppointmentSlice = createSlice({
  name: "TestAppointment", // this is the slice name used in Redux DevTools and state
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload);
    },
  },
});

// Consistent exports
export const { setAppointments, addAppointment } = testAppointmentSlice.actions;
export default testAppointmentSlice.reducer;
