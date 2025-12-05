import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import instance from "./api";
import { get } from 'lodash';
import * as CryptoJS from "crypto-js";
let cryptoKey = '123456';

export const decryptWithAESPassPhrase = (ciphertext) => {
    if (ciphertext == null || ciphertext.length == 0) { return null; }
    const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

interface TypeOfInitialState {
    paymentOp: any,
    getPaymentData: any,
    getPaymentLoading: boolean,
    getPaymentMsg: string,
    payStatusData: any,
    payStatusMsg: string,
    payStatusLoading: boolean,
    concessions: any
}

const initialState: TypeOfInitialState = {
    paymentOp: {
        showModal: false,
        type: "",
        reqBody: {},
        applicationDetails: {},
        callBack: null
    },
    getPaymentData: {},
    getPaymentLoading: false,
    getPaymentMsg: "",
    payStatusData: {},
    payStatusMsg: "",
    payStatusLoading: false,
    concessions: []
};

export const getPaymentAmount = createAsyncThunk('payment/getPaymentAmount', async (obj: any, { rejectWithValue }) => {
    try {
        let hash = CryptoJS.AES.encrypt(JSON.stringify(obj), cryptoKey).toString();
        let data2 = { ...obj, hash }
        const rs = await instance.put('/ob/dutyCalculator', data2);
        var origialText = decryptWithAESPassPhrase(rs.data.data.hash.toString());
		let data = rs.data.data;
		delete data.hash
		if (JSON.stringify(data) != origialText) {
			return{
				status: false,
				message: "Hash Missmatched !"
			}
		}
		return rs.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const getPaymentStatus = createAsyncThunk("payment/getPaymentStatus", async (id: string, { rejectWithValue }) => {
    try {
        const rs = await instance.get(`/payments/status/${id}`);
        return rs.data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPaymentOP: (state, action: PayloadAction<any>) => {
            state.paymentOp = { ...state.paymentOp, ...action.payload };
        },
        resetPaymentStatus: (state) => {
            state.payStatusData = {};
            state.payStatusLoading = false;
            state.payStatusMsg = ""
        },
        setConcessions: (state, action: PayloadAction<any>) => {
            state.concessions = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPaymentAmount.pending, (state) => {
            state.getPaymentData = {};
            state.getPaymentLoading = true;
            state.getPaymentMsg = "";
        })
        builder.addCase(getPaymentAmount.fulfilled, (state, action: PayloadAction<any>) => {
            state.getPaymentData = get(action, 'payload.data', {});
            state.getPaymentLoading = false;
            state.getPaymentMsg = "";
        })
        builder.addCase(getPaymentAmount.rejected, (state, action: PayloadAction<any>) => {
            state.getPaymentData = {};
            state.getPaymentLoading = false;
            state.getPaymentMsg = get(action, 'payload.message', 'something went wrong');
        })
        builder.addCase(getPaymentStatus.pending, (state) => {
            state.payStatusData = {};
            state.payStatusLoading = true;
            state.payStatusMsg = "";
        })
        builder.addCase(getPaymentStatus.fulfilled, (state, action: PayloadAction<any>) => {
            state.payStatusData = get(action, 'payload.data', {});
            state.payStatusLoading = false;
            state.payStatusMsg = "";
        })
        builder.addCase(getPaymentStatus.rejected, (state, action: PayloadAction<any>) => {
            state.payStatusData = {};
            state.payStatusLoading = false;
            state.payStatusMsg = get(action, 'payload.message', 'something went wrong');
        })
    }
});

export const { setPaymentOP, resetPaymentStatus, setConcessions } = paymentSlice.actions;
export default paymentSlice.reducer;
