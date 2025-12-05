import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TypeOFinitialState {
    PopupMemory: any,
    AadharPopupMemory: any,
    DeletePopupMemory: any,
    ConfirmPopupMemory: any,
    Loading: any,
    Browser: any,
    PreviewPopupMemory:any,
	captchaStr: string,
    appId: string,
    GooglemapMemory:any,
    EncumbranceData: any,
    GeneratedDetailsData: any,
    PropertyDetails : any,
}

const initialState: TypeOFinitialState = {
    PopupMemory: {
        enable: false,
        message: "",
        type: "",
        redirectOnSuccess: ""
    },
    AadharPopupMemory: {
        enable: false,
        status: false,
        response: false,
        data: {},
        op: ''
    },
    DeletePopupMemory: {
        enable: false,
        response: false,
        message: "",
        redirectOnSuccess: "",
        deleteId: "",
        applicationId: "",
        type: "",
        singleUser:""
    },
    ConfirmPopupMemory: {
        enable: false,
        message: "",
        result: false,
        redirectOnSuccess: ""
    },
    Loading: {
        enable: false
    },
    Browser: {
        IsEdge: false
    },
    PreviewPopupMemory:{
        enable:false,
		docProcessType:""
       
    },
    GooglemapMemory:{
        id:false,
        enable:false,
        result:false, 
        Location:false, 
        Reason:"",
    },
	captchaStr: "",
    appId: "",
    EncumbranceData: {},
    GeneratedDetailsData: undefined,
    PropertyDetails: []
}
export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        PopupAction: (state, action: PayloadAction<any>) => {
            state.PopupMemory = action.payload;
        },
        AadharPopupAction: (state, action: PayloadAction<any>) => {
            state.AadharPopupMemory = action.payload;
        },
        DeletePopupAction: (state, action: PayloadAction<any>) => {
            state.DeletePopupMemory = action.payload;
        },
        ConfirmPopupAction: (state, action: PayloadAction<any>) => {
            state.DeletePopupMemory = action.payload;
        },
        LoadingAction: (state, action: PayloadAction<any>) => {
            state.Loading = action.payload;
        },
        BrowserAction: (state, action: PayloadAction<any>) => {
            state.Browser = action.payload;
        },
        PreviewDocAction: (state, action: PayloadAction<any>) => {
            state.PreviewPopupMemory = action.payload;
        },
		setCaptcha: (state, action: PayloadAction<any>) => {
            state.captchaStr = action.payload
        },
        setAppId: (state, action: PayloadAction<any>) => {
            state.appId = action.payload
        },
        GooglemapAction: (state, action: PayloadAction<any>) => {
            state.GooglemapMemory = action.payload;
        },
        SetEncumbranceData: (state, action: PayloadAction<any>) => {
            state.EncumbranceData = action.payload;
        },
        SetGeneratedDetails: (state, action: PayloadAction<any>) => {
            state.GeneratedDetailsData = action.payload;
        },
        SetPropertyDetails: (state, action: PayloadAction<any>) => {
            state.PropertyDetails = action.payload;
        },
    }
})

export const { PopupAction, AadharPopupAction, DeletePopupAction, LoadingAction,
        BrowserAction,PreviewDocAction ,setCaptcha, setAppId,GooglemapAction,
        SetEncumbranceData, SetGeneratedDetails, SetPropertyDetails} = commonSlice.actions;
export default commonSlice.reducer;