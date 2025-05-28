import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";

interface Report {
  type: string;
  date: Dayjs | null;
  time: Dayjs | null;
  reportToHR: boolean;
  anonymous: boolean;
  location: string;
  description: string;
}

interface ReportState {
  reports: Report[];
}

const initialState: ReportState = {
  reports: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    submitReport: (state, action: PayloadAction<Report>) => {
      state.reports.push(action.payload);
    },
    clearReport: (state) => {
      state.reports = [];
    },
  },
});

export const { submitReport, clearReport } = reportSlice.actions;
export default reportSlice.reducer;
