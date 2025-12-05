import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TypeOFinitialState {
    GetstartedDetails: any,
    CurrentPartyDetails: any,
	CurrentRepresentDetails:any,
    PropertyDetails: any,
    SlotBookingDetails:any,
    AddRelationDetails:any,
    PaymentDetails:any,
}

const initialState: TypeOFinitialState = {
    GetstartedDetails: {
        applicationId: "",
        registrationType: "",
        documentNature: "",
        district: "",
        sroOffice: "",
    },

    CurrentPartyDetails: {
        name: "",
        relationType: "",
        relationName: "",
        age: 0,
        panNoOrForm60or61: "",
        tan: "",
        aadhaar: "",
        representType: "",
        representSubType: "",
        email: "",
        phone: "",
        address: "",
        currentAddress:"",
        applicationId: "",
        operation: "",
        objectType:"",
        wa:"",
        isRepChecked: false
    },
	CurrentRepresentDetails: {
        name: "",
        relationType: "",
        relationName: "",
        age: 0,
        panNoOrForm60or61: "",
        tan: "",
        aadhaar: "",
        email: "",
        phone: "",
        address: "",
        currentAddress:"",
        documentId: "",
        operation: "",
		parentPartyId:""
    },
    PropertyDetails: {
        amount: "",
        mode:"",
        executionDate: "",
        stampPaperValue: "",
        stampPurchaseDate: "",
        noOfStampPapers:0,
        localBodyType: "",
        localBodyTitle: "",
        localBodyName: "",
        district: "",
        sroOffice: "",
        propertyType: "",
        ExtentList:[],
        schedulePropertyType: "",
        landUse: "",
        village: "",
        locality: "",
        ward: "",
        biWard: "",
        block: "",
        biBlock: "",
        doorNo: "",
        nearTodoorNo:"",
        plotNo: "",
        survayNo: "",
		lpmNo:"",
        ptinNo: "",
        extent: "",
        totalExtent:"",
        electionWard:"",
        secratariatWard:"",
        electionWardName:"",
        secratariatWardName:"",
		khataNum:"",
        extentUnit: "",
        units: "",
        layoutNo: "",
        layoutName: "",
        appartmentName:"",
        undividedShare: "",
        undividedShareUnit: "",
        flatNo: "",
        flatNorthBoundry: "",
        flatSouthBoundry: "",
        flatEastBoundry: "",
        flatWestBoundry: "",
        structure:[],
        totalFloors: "",
        northBoundry: "",
        southBoundry: "",
        eastBoundry: "",
        westBoundry: "",
        isDocDetailsLinked: "",
        landtype:"",
        isMarketValue:"",
		isExAsPattadhar:"",
		ispresentExcutent:"",
        isPropProhibited: false,
        isPrProhibitedSurveyNO:"",
        isPrProhibitedDoorNO:"",
        LinkedDocDetails:[],
        leaseDetails:{},
        urban_selling_extent: "",
        cdma_details: {},
        strType:"",
        conveyanceType:"Immovable",
        payableMutationFee:""
    },
    SlotBookingDetails:{
        sroDistrict:"",
        sroOffice:"",
		sroOfcNum:"",
        dateForSlot:"",
		slotTime:""
    },
    AddRelationDetails:{
        relationDetails:[],
    },
    PaymentDetails:{
        modeofPayment:"",
        payamount:"",
        dateofPayment:"",
        chequeno:"",
        bankname:"",
        branch:"",
        utrno:""
    },

}
export const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        SaveGetstartedDetails: (state, action: PayloadAction<any>) => {
            state.GetstartedDetails = action.payload;
        },
        SaveCurrentPartyDetails: (state, action: PayloadAction<any>) => {
            state.CurrentPartyDetails = action.payload;
        },
		SaveCurrentRepresntDetails: (state, action: PayloadAction<any>) => {
            state.CurrentRepresentDetails = action.payload;
        },
        SavePropertyDetails: (state, action: PayloadAction<any>) => {
            state.PropertyDetails = action.payload;
        },
        SaveSlotBookingDetails: (state, action: PayloadAction<any>) => {
            state.SlotBookingDetails = action.payload;
        },
        SaveAddRelationDetails: (state, action: PayloadAction<any>) => {
            state.AddRelationDetails = action.payload;
        },
        SavePaymentDetails: (state, action: PayloadAction<any>) => {
            state.PaymentDetails = action.payload;
        }

    }
})

export const { SaveGetstartedDetails, SaveCurrentPartyDetails,SaveCurrentRepresntDetails, SavePropertyDetails,SaveSlotBookingDetails, SaveAddRelationDetails, SavePaymentDetails } = formSlice.actions;
export default formSlice.reducer;