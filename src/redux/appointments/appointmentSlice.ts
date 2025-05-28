import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
}

export interface Report {
  type: string;
  date: string;
  time: string;
  reportToHR: boolean;
  anonymous: boolean;
  location: string;
  description: string;
  involvedParties: string[];
}

export interface Poll {
  id: string;
  question: string;
  choices: string[];
}

export interface Post {
  username: string;
  content: string;
  likes: number;
  avatarUrl: string;
  hashtags?: string[];
}

interface AppointmentsState {
  appointments: Appointment[];
  report: Report[];
  polls: Poll[]; 
  posts: Post[];
}

const initialState: AppointmentsState = {
  appointments: [],
  report: [],
  polls: [],
  posts: [], 
};
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload);
    },
    setReports(state, action: PayloadAction<Report[]>) {
      state.report = action.payload;
    },
    addReport(state, action: PayloadAction<Report>) {
      state.report.push(action.payload);
    },
    addPoll(state, action: PayloadAction<Poll>) {
      state.polls.push(action.payload); 
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  setReports,
  addReport,
  addPoll,
    addPost,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
