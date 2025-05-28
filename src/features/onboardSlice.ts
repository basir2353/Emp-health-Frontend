import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BloodGroup, EmergencyContactRelation } from "../enums/onboard.enum";

interface OnboardingState {
    weight: string;
    weight_unit: string;
    height: string;
    height_unit: string;
    blood_group: BloodGroup;
    emergency_contact_name: string;
    emergency_contact_relation: EmergencyContactRelation;
    emergency_contact: string;
    allergies: string[];
    allergy_description: string;
    disorder_detail: string;
    disorders: string[];
    avatar: string;
    onboarding_master_data: {}
}

const intialState: OnboardingState = {
    height: "",
    height_unit: "",
    weight: "",
    weight_unit: "",
    blood_group: BloodGroup.NONE,
    emergency_contact_name: "",
    emergency_contact: "",
    emergency_contact_relation: EmergencyContactRelation.NONE,
    allergies: [],
    allergy_description: "",
    disorders: [],
    disorder_detail: "",
    avatar: "",
    onboarding_master_data: {}
}

const onboardSlice = createSlice({
    name: "onboard",
    initialState: intialState,
    reducers: {
        setOnboardingMasterData: (state, action: PayloadAction<any>) => {
            state.onboarding_master_data = action.payload;
        },
        setHeight: (state, action: PayloadAction<{ height: string, height_unit: string }>) => {
            state.height = action.payload.height;
            state.height_unit = action.payload.height_unit;
        },

        setWeight: (state, action: PayloadAction<{ weight: string, weight_unit: string }>) => {
            state.weight = action.payload.weight;
            state.weight_unit = action.payload.weight_unit;
        },

        setBloodGroup: (state, action: PayloadAction<{ blood_group: BloodGroup }>) => {
            state.blood_group = action.payload.blood_group;
        },

        setEmergencyContact: (state, action: PayloadAction<{
            emergency_contact_name: string,
            emergency_contact_relation: EmergencyContactRelation,
            emergency_contact: string
        }>) => {
            state.emergency_contact_name = action.payload.emergency_contact_name;
            state.emergency_contact = action.payload.emergency_contact;
            state.emergency_contact_relation = action.payload.emergency_contact_relation;
        },

        setAllergies: (state, action: PayloadAction<{ allergies: string[], allergy_description: string }>) => {
            state.allergies = action.payload.allergies;
            state.allergy_description = action.payload.allergy_description;
        },

        setDisorders: (state, action: PayloadAction<{ disorders: string[], disorder_detail: string }>) => {
            state.disorders = action.payload.disorders;
            state.disorder_detail = action.payload.disorder_detail;
        },

        setAvatar: (state, action: PayloadAction<{ avatar: string }>) => {
            state.avatar = action.payload.avatar;
        }
    }
});

const { setHeight, setWeight, setAvatar, setBloodGroup, setDisorders, setOnboardingMasterData, setAllergies, setEmergencyContact } = onboardSlice.actions;
export const onboardActions = { ...onboardSlice.actions };
export const setEmployeeHeight = (payload: any) => setHeight(payload);
export const setEmployeeWeight = (payload: any) => setWeight(payload);
export const setEmployeeContact = (payload: any) => setEmergencyContact(payload);
export const setEmployeeBloodGroup = (payload: any) => setBloodGroup(payload);
export const setEmployeeAllergies = (payload: any) => setAllergies(payload);
export const setEmployeeDisorders = (payload: any) => setDisorders(payload);
export const setEmployeeAvatar = (payload: any) => setAvatar(payload);
export const onboardingMasterData = (payload: any) => setOnboardingMasterData(payload);

export default onboardSlice.reducer;