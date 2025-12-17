import axios from "axios";
import instance from "./redux/api";
import { get } from 'lodash';
import * as CryptoJS from "crypto-js";
import { store } from "./redux/store";
import { encodeString, encryptWithAES } from "./axis-util";
import { DecryptAdrwithPkcs, encryptId } from "./utils";
let cryptoKey = '123456';

const client = axios.create({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': '*/*'
    }
});

export const decryptWithAESPassPhrase = (ciphertext) => {
    if (ciphertext == null || ciphertext.length == 0) { return null; }
    const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const useEmailVerify = async (data: any) => {
    return await instance.post("/emailVerification", data)
        .then((res) => { return res.data; },)
        .catch((e) => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const UseSignUp = async (data: any) => {
    return await instance.post("/signup", data)
        .then((res) => { return res.data; },)
        .catch((e) => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        })
}


export const useUserLoginData = async (data: any) => {
    // console.log(instance);
    return await instance.post("/login", data)
        .then((res) => { return res.data; },)
        .catch((e) => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        })
}
export const useUserLogOut = async (data: any) => {
    // console.log(instance);
    return await instance.get("/logout", data)
        .then((res) => { return res.data; },)
        .catch((e) => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const useGetDistrictList = async () => {
    return await instance.get("villages/districts")
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e);
            return {
                status: false,
                message:e.response &&  e.response.data && e.response.data ? e.response.data : "District List Fetch Failed."
            }
        });
}


export const UseGetWenlandSearch = async (data) => {
    let dParam = data.sryno ? `&sryno=` + data.sryno : `&lpmNo=` + data.lpmNo;
    return await instance.get("/villages/CurrentPahaniDetailsSRO?vgcode=" + data.vgcode + dParam)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
    // let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    // data = { ...data, hash }
    // window.alert(JSON.stringify(data))
    // let dParam = data.sryno ? `&sryno=`+data.sryno:`&lpmNo=`+data.lpmNo;

    // return await instance.get("/villages/CurrentPahaniDetailsSRO?vgcode=" + data.vgcode + dParam)
    //     .then((res:any) => {
    // 		var origialText = decryptWithAESPassPhrase(res.data.hash.toString());
    // 		let data = res.data.data
    // 		if (JSON.stringify(data) != origialText) {
    // 			return {
    // 				status: false,
    // 				message: "Hash Missmatched !"
    // 			}
    // 		}else{
    // 			return res.data; 
    // 		}

    // 	})
    //     .catch(e => {
    //         console.log(e);
    //         return {
    //             status: false,
    //             message: "Add Property Failed"
    //         }
    //     });
}

export const useSROOfficeList = async (id: any) => {
    return await instance.get("/villages?districtId=" + id)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const useGetMandalList = async (id: any) => {
    return await instance.get("/villages/mandals/" + id)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const getSecratariatWardDetails = async (sroCode: number,villageCode?:string) => {
    return await instance.get(`/urban/getsecratariatward?sroCode=${sroCode}&villageCode=${villageCode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const useGetVillagelList = async (id: any, distCode: any) => {
    return await instance.get("/villages?mandalId=" + id + "&districtId=" + distCode)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}


export const getSroDetails = async (id: any) => {
    return await instance.get(`/villages/sroDetails/${id}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const getLinkedSroDetails = async (id: any) => {
    return await instance.get(`/villages/link/dist/${id}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseCreateApplication = async (data: any) => {
    return await instance.post("/documents", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseUpdateDocument = async (data: any) =>{
    return await instance.put("/documents", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseStatusHistoryUpdate = async (data: any) => {
    return await instance.put(`/documents/statushstr/${data.sd}/${data.applicatIonId}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}

export const getApplicationDetails = async (data: any, simple = false) => {
    if (data?.status == undefined) {
        return await instance.get("/documents/" + data)
            .then((res) => { return res.data })
            .catch(e => {
                // console.log(e.response);
                return {
                    status: false,
                    message: get(e, 'response.data.message', 'Server Error')
                }
            });
    } else {
        return await instance.get(`/documents?status=${data.status}` + (simple ? '&simple=true' : '')
        )
            .then((res) => { return res.data })
            .catch(e => {
                return {
                    status: false,
                    message: e.response.data
                }
            });
    }

}
export const UseTransferdocument = async (docNo) => {
    return await axios.post(`${process.env.TRANSFER_DOC_URL}/igrs-datasync-ws/dataSyncFromMongoToOracle/${docNo}`,)
        .then((res) => { return res })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Doc Transfer Failed"
            }
        })

}

export const useGetSroApplicationDetails = async (data: any) => {

    return await instance.get("/officer/documents")
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response);
            return {
                status: false,
                message: e.response.data
            }
        });

}


export const useSavePartyDetails = async (data: any) => {
    return await instance.post("/parties", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const useSaveRepresentDetails = async (data: any) => {
    // console.log(data);
    return await instance.post("/parties/representative", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const useUpdatePartyDetails = async (data: any) => {
    return await instance.put("/parties", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data.message
            }
        });
}

export const useDeleteParty = async (data: any) => {
    return await instance.delete("/parties/" + data.applicationId + "/" + data.id)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseSlotBooking = async (data: any) => {
    return await instance.post("/slots/appointment", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
};
export const UseslotQrParties = async (data: any) => {
    return await instance.put(`/parties/isPresenterData`, data)
        .then((res) => {
             return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data.message
            }
        });
}
export const UseDeleteSlot = async (data: any) => {
    return await instance.put("/slots/delete", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message:"Something went Wrong"
            }
        });
    
};
export const UseSlotBookingDetails = async (data: any) => {
    return await instance.get("/slots/slotBooking/" + `${data.sroOfcNum}?dateForSlot=${data.dateForSlot}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseCheckSlotEnabledForSro = async (sroOfcNum: any) => {
    return await instance.get("/slots/isSlotEnabledForSro/" + `${sroOfcNum}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseAddProperty = async (data: any) => {
    return await instance.post("/properties", data)
        .then((res) => {
            return res.data;
        })
        .catch(error => {
            return {
                status: false,
                message: error?.response?.data?.message ? error?.response?.data?.message : "Add Property Failed"
            }
        });
}
export const UseOtherProperty = async(data:any)=>{
    return await instance.post("/properties/others", data)
        .then((res) => {
            return res.data;
        })
        .catch(e => {
            console.log(e);
            return {
                status: false,
                message: "Add Property Failed"
            }
        });
}
export const UseUpdateProperty = async (data: any) => {
    let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    data = { ...data, hash }
    return await instance.put("/properties/" + data.applicationId + "/" + data.propertyId, data)
        .then((res: any) => {
            var origialText = decryptWithAESPassPhrase(res.data.data.hash.toString());
            let data = res.data.data;
            delete data.hash
            if (JSON.stringify(data) != origialText) {
                return {
                    status: false,
                    message: "Hash Missmatched !"
                }
            }
            return res.data;
        })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetProperty = async (data: any) => {
    // let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    // data = { ...data, hash }
    return await instance.get("/properties/"+data.applicationId)
        .then((res: any) => {
            return res.data;
        })
        .catch(e => {
            console.log(e.response);
            return {
                status: false,
                message: e.response.data
            }
        });
}



export const UseAddCovenant = async (data: any) => {
    return await instance.post("/covanants", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseSetPresenter = async (data: any) => {
    return await instance.put("/parties/updatePresenter", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', 'Update Presenter Failed')
            }
        });
}

export const UseDeleteApplication = async (applicationId: string, token: string) => {
    let mytoken = { headers: { Authorization: `Bearer ${token}` } }
    return await instance.delete("/documents/" + applicationId, mytoken)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}



export const useDeleterepresentative = async (data: any, token: string) => {
    let mytoken = { headers: { Authorization: `Bearer ${token}` } }
    // console.log("1111111111111111111111111111111",data);
    return await instance.delete("/parties/representative/" + data.applicationId + "/" + data.partyId + "/" + data.parentPartyId, mytoken)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const useDeleteProperty = async (data: any, token: string) => {
    let mytoken = { headers: { Authorization: `Bearer ${token}` } }
    return await instance.delete("/properties/" + data.applicationId + "/" + data.propertyId, mytoken)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseChangeStatus = async (data: any) => {
    let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    data = { ...data, hash }
    return await instance.put("/documents", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}


export const UseReportTelDownload = async (info: any) => {
    return await instance.get(`/reports/${info.type}/${info.stamp}/pdf/${info.applicationId}`)
        .then((res) => {
            downloadFileFromBase64(res.data.dataBase64, res.data.fileName, "application/pdf");
            return res.data
        })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', 'Server Error')
            }
        });
}
export const UseCCDownload = async (info: any) => {
    return await instance.get(`/cc/downloadCC?SR_CODE=${info.srcode}&BOOK_NO=${info.bookno}&REG_YEAR=${info.regyear}&DOCT_NO=${info.doctno}&APP_ID=${info.appid}`)
        .then((res) => { 
            if(res.data && res.data.data && res.data.data.length>0 && res.data.data[0].IMAGE.type == 'Buffer'){
                    let buffer:any = Buffer.from(res.data.data[0].IMAGE.data);
                    let base64:any = buffer.toString('base64');
                    downloadFileFromBase64(base64,"IMAGE", "image/tiff");
            }else{
                downloadFileFromBase64(res.data.data.dataBase64, res.data.data.fileName, "application/pdf");
            }
            return res.data
        })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', 'Server Error')
            }
        });
}

export const UseupdateTdvalue = async (data: any) => {
    return await instance.put("/documents/lb/td/update", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseReportDownload = async (info: any) => {
    return await instance.get(`/reports/${info.type}/${info.stamp}/${info.applicationId}`).then(res => {
        downloadFileFromBase64(res.data.dataBase64, res.data.fileName, "application/pdf");
        return res.data;
    }).catch((e) => {
        // console.log(e.response.data);
        return {
            status: false,
            message: get(e, 'response.data.message', 'Report generation failed')
        };
    });
}

export const LinkedDocumentApi = async (info: any) => {
    return await instance.get(`/ob/partyOrProperty?sroCode=${info.sroCode}&documentId=${info.documentId}&regYear=${info.regYear}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetVillageCode = async (sroCode: any) => {
    return await instance.get(`/ob/villagesbyODb/${sroCode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetHabitation = async (VillageCode: any, type: string) => {
    return await instance.get(`/ob/habitation/${type}/${VillageCode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseGetVgForPpAndMV = async (type: any, vgCode: any) => {
    return await instance.get(`/ob/getwebVgCode/${type}/${vgCode}`)
        .then((res) => {
            return res.data
        })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const getMutationEnabled = async (sroCode:string) => {
    return await instance.get(`/urban/slotenabled?sroCode=${sroCode}`)
        .then((res) => {
            return res.data
        })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseGetSurveynoList = async (villagecode: any) => {
    return await instance.get(`/ob/marketValue/classicWiseDetails?villageCode=${villagecode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseGetlpmCheck = async (villagecode: any) => {
    return await instance.get(`/ob/checkLpm/${villagecode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetECDetails = async (data: any) => {
    return await instance.get(`/ob/eclinked/list?habCode=${data.habCode}&surveyNum=${data.surveyNum}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetMarketValue = async (type: string, villagecode: any) => {
    return await instance.get(`/ob/marketValue/${type}/${villagecode}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetMarketClassicValue = async (survayno: string, villagecode: any) => {
    return await instance.get(`/ob/marketValue/classicWiseDetails?villageCode=${villagecode}&serveyNo=${survayno}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetDoorWiseValue = async (WARD_NO: any, BLOCK_NO: any, habitation: any) => {
    return await instance.get(`/ob/marketValue/DoorWiseDetails?wardNo=${WARD_NO}&blockNo=${BLOCK_NO}&habitation=${habitation}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseGetLinkDocDetails = async (sroCode: any, linkDocNo: any, regYear: any) => {
    return await instance.get(`/ob/partyOrProperty?sroCode=${sroCode}&documentId=${linkDocNo}&regYear=${regYear}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseGetVacantLandExtRate = async (reqData:any) => {
    return await instance.put(`/ob/vcanLandRCheckMv`,reqData)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseGetLeaseDutyFee = async (reqData:any) => {
    return await instance.put(`/ob/dutyLease`,reqData)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const teleuguAnu = async (data: any) => {
    return await axios.post('https://indicabridge.avahan.net/api/Converter/GetAnu7ToUni?isRtfText=0', data, {
        'headers': {
            'Content-Type': 'text/plain'
        }
    }).then(res => {
        return { status: true, data: res.data }
    }).catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'Aadhaar OTP validation failed')
        }
    })
}
export const UseGetAadharOTP = async (data: any) => {
    // console.log(data);
    return await axios.post(process.env.AADHAR_URL + "/generateOTPByAadharNumber", { "aadharNumber": data })
        .then((res) => {

            return res.data
        })
        .catch(e => {
            return { 'status': 'Failure' }
        });
}

export const UseGetAadharDetails = async (data: any) => {
    return await axios.post(process.env.AADHAR_URL + "/aadharEKYCWithOTP", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'Aadhaar OTP validation failed')
            }
        });
}
export const UseGetPaymentByDepartmentId = async (data: any) => {
    console.log(data);
    return await axios.post(process.env.PAYMENT_URL + "/getCfmsTransactionByDepartmentID", data)
        .then((res) => {

            return res.data
        })
        .catch(e => {
            return { 'status': 'Failure' }
        });
}
export const UseGetPaymentByChallanNum = async (data: any) => {
    console.log(data);
    return await axios.post(process.env.PAYMENT_URL + "/getChallanDetailsByChallanNumber", data)
        .then((res) => {

            return res.data
        })
        .catch(e => {
            return { 'status': 'Failure' }
        });
}
export const UseSendingMobileOTP = async (data: any) => {
    return await instance.post(`/slots/mobile/sendOtp`,data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}
        
export const UseVgforWebland = async (reqData:any) => {
    return await instance.put(`/ob/vgforWebland`,reqData)
    .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}
export const UseAuthenticateUpdate = async (data: any) => {
    return await instance.put(`/documents/updateSlot`,data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}

export const UseGetSlotsbyId = async (data: any) => {
    return await instance.get(`/slots/slotsByappId/` + `${data.applicationId}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data.message
            }
        });
}
export const UseSlotVerify = async (data: any) => {
    return await instance.post(`/slots/mobile/verify`,data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}


export const useUserLogin = async (LogiDetails: any) => { }


export const UseSaveMortagageDetails = async (data: any) => {
    return await instance.post("payments/MORTAGAGE/create", data)
        .then((res) => {
            // console.log(res.data);
            return res.data
        })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}

// export const UseUpdateMortagageDetails = async (data: any) => {
//     return await instance.put("/payments/"+data.id, data)
//     .then((res) => { return res.data })
//     .catch(e => {
//        // console.log(e.response.data);
//         return {
//             status: false,
//             message: e.response.data
//         }
//     });
// }

export const UseSaveRelationDetails = async (data: any) => {
    return await instance.post("payments/GIFT/create", data)
        .then((res) => {
            // console.log(res.data);
            return res.data
        })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}
export const UseSaveSaleDetails = async (data: any) => {
    return await instance.post("payments/SALE/create", data)
        .then((res) => {
            // console.log(res.data);
            return res.data
        })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseUpdatePaymentDetails = async (data: any) => {
    return await instance.put("/payments/update/" + data._id, data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseDeletePaymentDetails = async (data: any) => {
    return await instance.delete("/payments/delete/" + data.applicationId + "/" + data.id)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}


export const GetCDMAData = async (data: any) => {
    return await instance.post("/villages/CDMAPropertyAssessmentDetails", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        })
}
export const UseGetDoorNumSearch = async (sroCode: string, doorNo: string) => {
    return await instance.get(`/urban/searchassessmentbydoornumber?sroCode=${sroCode}&doorNo=${doorNo}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        });
}

export const UseGetPPCheck = async (data: any, type: string) => {
    return await instance.put(`/ob/pp_check/${type}`, data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        });

    // let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    // data = { ...data, hash }
    // return await instance.put(`/ob/pp_check/${type}`, data)
    //     .then((res: any) => {
    //         var origialText = decryptWithAESPassPhrase(res.data.data[0].hash.toString());
    //         let data = res.data.data[0];
    //         delete data.hash
    //         if (JSON.stringify(data) != origialText) {
    //             return {
    //                 status: false,
    //                 message: "Hash Missmatched !"
    //             }
    //         }
    //         return res.data;
    //     })
    //     .catch(e => {
    //         // console.log(e);
    //         return {
    //             status: false,
    //             message: e.response.data
    //         }
    //     });
}


export const UseAdharValidate = async (data: any) => {
    return await instance.put(`/ob/adhar/validate`, data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        });

}


export const UseSaveCovinant = async (data: any) => {
    return await instance.post("/covanants", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseDelCovenant = async (data: any) => {
    return await instance.delete("/covanants/" + data.type + "/" + data.documentId + "/" + data.covId, data.covanants)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseUpdateCovinant = async (data: any) => {
    return await instance.put("/covanants/" + data.documentId + "/" + data.covId, data.covanants)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const UseMVCalculator = async (data: any, type: string) => {
    return await instance.put("/ob/" + type + "/mvCalculator", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        })
    // let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    // data = { ...data, hash }
    // return await instance.put("/ob/" + type + "/mvCalculator", data)
    //     .then((res: any) => {
    //         var origialText = decryptWithAESPassPhrase(res.data.data.hash.toString());
    //         let data = res.data.data;
    //         delete data.hash
    //         if (JSON.stringify(data) != origialText) {
    //             return {
    //                 status: false,
    //                 message: "Hash Missmatched !"
    //             }
    //         }
    //         return res.data;
    //     })
    //     .catch(e => {
    //         // console.log(e);
    //         return {
    //             status: false,
    //             message: e.message
    //         }
    //     });
}
export const UseGetStructureDetails = async (data: any) => {
    // return await instance.put("/ob/structureDetails", data)
    //     .then((res) => { return res.data })
    //     .catch(e => {
    //         return {
    //             status: false,
    //             message: e.response.data
    //         }
    //     })
    let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    data = { ...data, hash };
    return await instance.put("/ob/structureDetails", data)
        .then((res: any) => {
            var origialText = decryptWithAESPassPhrase(res.data.data[res.data.data.length - 1].toString());
            let data = res.data.data[res.data.data.length - 1]
            delete data.hash
            if (JSON.stringify(data) != origialText) {
                return {
                    status: false,
                    message: "Hash Missmatched !"
                }
            }
            return res.data;
        })
        .catch(e => {
            // console.log(e);
            return {
                status: false,
                message: e.message
            }
        });
}

export const UseDutyCalculator = async (data: any) => {

    let hash = CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
    data = { ...data, hash }
    return await instance.put('/ob/dutyCalculator', data)
        .then((res: any) => {
            var origialText = decryptWithAESPassPhrase(res.data.data.hash.toString());
            let data = res.data.data;
            delete data.hash
            if (JSON.stringify(data) != origialText) {
                return {
                    status: false,
                    message: "Hash Missmatched !"
                }
            }
            return res.data;
        })
        .catch(e => {
            console.log(e);
            return {
                status: false,
                message: e.message
            }
        });
}

export const UselocalBodies = async (habCode: any) => {
    return await instance.get('/villages/getLocalbodiesData/' + habCode)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const GetMutatbleVillageData = async (habCode: any) => {
    return await instance.get('urban/getVillageEnabled?villageCode='+habCode)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        })
}



export const UseGetPaymentStatus = async (id: any) => {
    return await instance.get(`/payments/status/${id}`)
        .then((res) => { return res.data })
        .catch(e => { return e.response.data });
}



export const UseUploadDoc = async (formData: any, data: any,) => {
    return await instance.put("/documents/uplods/" + data.docName + "/" + data.applicationId, formData)
        .then((res) => { return res.data; })
        .catch((e) => {
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const UseGetUploadDoc = async (id: any) => {
    return await instance.get(`/documents/images/${id}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const UseDeleteUploadDoc = async (name: string, id: any) => {
    return await instance.delete(`/documents/images/${name}/${id}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const UseGetLocationDetails = async (sroCode: any) => {
    return await instance.get(`/villages?sroCode=${sroCode}`)
        .then((res) => { return res.data })
        .catch(e => { return { status: false, message: e.response.data } })
}

export const UseSROLogin = async (data: any) => {
    return await instance.post('/officer/login', data)
        .then((res) => { return res.data })
        .catch(e => { return { status: false, message: e.response.data } })
}



export const downloadFileFromBase64 = (base64String, fileName, contentType) => {

    let name = fileName, type = contentType;
    if (fileName.includes('/')) {
        let arr = fileName.split('/');
        name = arr[arr.length - 1].split('.')[0];
        type = arr[arr.length - 1].split('.')[1].toLowerCase() === 'pdf' ? 'application/pdf' : `image/${arr[arr.length - 1].split('.')[1].toLowerCase()}`
    } else if (fileName.includes('.')) {
        let arr = fileName.split('.');
        name = arr[0];
        type = arr[arr.length - 1].toLowerCase() === 'pdf' ? 'application/pdf' : `image/${arr[arr.length - 1].toLowerCase()}`
    }
    var a = document.createElement("a");
    a.setAttribute("download", name);
    a.setAttribute("target", "_blank");
    a.setAttribute("href", `data:${type};base64,${base64String}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

export const UseLogOut = async () => {
    return await instance.get('/users/logout')
        .then((res) => { return res.data })
        .catch((e) => {
            return {
                status: false,
                message: "Logout Failed"
            }
        })
}

export const titdcoLogin = async (val) => {
    return await instance.post('/users/titdcoLogin', { loginPassword: val })
        .then(res => {
            return res.data
        }).catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const englishToTeluguTransliteration = async (str: string, source: any) => {
    return await client.get(`https://registration.ap.gov.in/CDAC-EnhanceTransliterationAPI/Transliteration.aspx?itext=${str}&transliteration=NAME&locale=tl_in&transRev=false`, {
        data: {},
        cancelToken: source.token
    })
        .then(res => { return { suggestions: res.data ? res.data.split('^') : [], message: "" } })
        .catch(err => {
            console.log(err);
            if (axios.isCancel(err)) {
                return {
                    message: '',
                    suggestions: []
                }
            } else {
                return {
                    message: 'dsds',
                    suggestions: []
                }
            }
        })
}

export const googleAPI = async (value: string, signal?: any) => {
    return {};
    return await axios.get(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyA9vb_JjnQ8Ik8PF3Pp63RwLcypzclHNU8&source=en&target=te&q=${value}`, signal ? { signal } : {})
        .then(res => { return res.data })
        .catch(err => { return {}; })
}

export const syncservice = async (id) => {
    return await instance.post('/documents/syncservice/' + id)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const GetCDMADetails = async (data: any) => {
    return await instance.post("/villages/getCDMADetails", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        })
}

export const checkUlbCodeJurisdiction = async (sroCode, ulbCode) => {
    return await instance.get(`/ob/checkUlbJurisdiction?sroCode=${sroCode}&ulbCode=${ulbCode}`)
        .then(res => res.data)
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'something went wrong')
            }
        })
}

export const getExecutionList = async () => {
    return await instance.get('/documents/readyToEsign/list')
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getPartyDetailsByAppId = async (id) => {
    return await instance.get('/parties?id=' + id)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getEsignData = async (data) => {
    return await instance.post('/esign', data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getEsignStatus = async (data) => {
    return await instance.post('/esign/status', data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const executeDoc = async (data) => {
    return await instance.post('/esign/execute', data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getConcessionData = async () => {
    return await instance.get('/exemptions/')
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

/*
* EC related APIs from Here.
*/
export const getAllUserECRequests = async () => {
    return await instance.get('/ec/getAllUserECRequests')
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const GetECPaymentStatus = async (data) => {
    return await instance.post(`/ec/paystatus`, data)
        .then((res) => { return res.data })
        .catch(e => { return e.response.data });
}

export const VerifyCSCPaymentStatus = async (requestNo, cscId, serviceName) => {
    let requestData = { "cscId": cscId, "requestNo": requestNo, "service": serviceName };
    return await instance.post(`/payments/cscPaymentCheck`, requestData)
        .then((res) => { return res.data })
        .catch(e => { return e.response.data });
}


export const updateECRequestsPaymentData = async (body) => {
    return await instance.post('/ec/updateECRequestsPaymentData', body)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
/*
* EC related APIs End.
*/

/*
* CC related APIs from Here.
*/

export const UseSaveCCrequestDetails = async (data:any) => {
    return await instance.post('/cc/createCCRequest', data)
    .then(res => res.data)
    .catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'something went wrong')
        }
    })

}

export const UseUpdateCCrequestDetails = async (data:any) => {
    return await instance.put('/cc/updtCCpaymentdetails', data)
    .then(res => res.data)
    .catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'something went wrong')
        }
    })

}

export const getAllUserCCRequests = async () => {
    return await instance.get('/cc/getAllCcdata')
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const GetCheckLPMMV = async (vgCode:any) => {
    return await instance.get(`/cc/lpmMarketValueCheck?VILLAGE_CODE=${vgCode}`)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const UseGetmvasrlistdetails = async (data) => {
    return await instance.get(`/mv/getmvasrlist?SR_CODE=${data.SR_CODE}&REQ_NO=${data.REQ_NO}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}
export const UseGetCoordinates = async (data) => {
    return await instance.get(`/mv/getmvacoordinatesdata?SR_CODE=${data.SR_CODE}&REQ_NO=${data.REQ_NO}&NAME=${data.NAME}&REG_YEAR=${data.REG_YEAR}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
 
}
export const pendingesignlist = async (data) => {
    return await instance.get(`/mv/pendingEsignList?SR_CODE=${data.SR_CODE}&REQ_NO=${data.REQ_NO}&REG_YEAR=${data.REG_YEAR}&esignstatus=${data.esignstatus}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}

export const UseUpdateCCPaymentStatus = async (id: any) => {
    return await instance.put(`/payments/updatePayment/${id}`)
        .then((res) => { return res.data })
        .catch(e => { return e.response.data });
}

export const UseGetCCPaymentStatus = async (id: any,srcode:any) => {
    return await instance.get(`/payments/ccstatus/${id}/${srcode}`)
        .then((res) => { return res.data })
        .catch(e => { return e.response.data });
}

export const previewPDF = async (data) => {
    return await instance.get(`/mv/pdfpreview?SR_CODE=${data.SR_CODE}&REQ_NO=${data.REQ_NO}&REG_YEAR=${data.REG_YEAR}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}
export const UseMVAMVCalculator = async (data: any, type: string) => {
    return await instance.put("/mv/" + type + "/mvamvCalculator", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
 
                message: get(e, 'response.data.message', 'MVCalculator Details Failed')
            }
        })
    }
 
    export const Mvadata = async (data: any) => {
        return await instance.post("/ob/mvadatapost", data)
            .then((res) => { return res.data })
            .catch(e => {
   
                return {
                    status: false,
   
                    message: get(e, 'response.data.message', 'Application Creation  Failed')
                }
            });
    }
   
    export const mvAssitanceReport = async (data:any) => {
        return await instance.post('/mv/mvAssitanceReport',data)
                        .then(res => res.data)
                        .catch(e => {
                            return {
                                status: false,
                                message: get(e, 'response.data.message', 'something went wrong')
                            }
                        })
    }
 
 
    export const GetPaymentStatus = async (data:any) =>{
        return await instance.get(`/mv/verifyPayment?applicationNumber=${data.REQ_NO}&srCode=${data.SR_CODE}`)
            .then((res) => {return res.data;})
            .catch((e) => {return e.response.data});
    }
 
    export const UseSaveMVrequestDetails = async (data:any) => {
        return await instance.post('/mv/createMVRequest', data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
    }
 
    export const UpdatePaymentMVRequest = async (data:any) => {
        return await instance.put(`/mv/UpdatePaymentMVRequest?REQ_NO=${data.REQ_NO}&REG_YEAR=${data.REG_YEAR}&SR_CODE=${data.SR_CODE}&DEPT_TRANS_ID=${data.DEPT_TRANS_ID}&PAID_AMOUNT=${data.PAID_AMOUNT}`, data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
    }
 
    export const getMVRequestsData = async (data:any) =>{
        return await instance.get(`/mv/getMVRequestsData?generated_by=${data}`)
            .then((res) => {return res.data;})
            .catch((e) => {return e.response.data});
    }


/*
* CC related APIs  END.
*/

/*
* CRDA related APIs Start
*/

export const UseCrdaGetVillages = async (code?:any) => {
    let res:any= code != undefined 
    ?  await instance.get(`/crda/villages/${code}`) 
    :  await instance.get('/crda/villages');
    if(res && res.data.status ==true){
        return res.data
    }else{
        return {
            status: false,
            message: get(res.data.message, 'res.data.message', 'something went wrong')
        }
    }
}
export const UseCrdaEmpCheck = async (data:any) => {
   return await instance.put('/crda/checkEmp',data)
   .then((res) => { return res.data })
   .catch(e => { return e.response.data });
   
}
/*
* CRDA related APIs END
*/

//Stamp Indent's APIs Start

export const getsroList = async () => {
    return await instance.get('masters/getSroDetails')
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const generateDocumentId = async (data) => {
    return await instance.get(`masters/generateDocumentId?sr_code=${data}`)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getstamptypelist = async (data) => {
    return await instance.get(`masters/stamptypelist?category=${data.category}&SR_CODE=${data.SR_CODE}`)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const getdenominationslist = async (data) => {
    return await instance.get(`masters/denominationslist?stamp_type=${data.stamp_type}&SR_CODE=${data.SR_CODE}`)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const getstampavailablelist = async (data) => {
    return await instance.get(`masters/getstampavailablelist?sr_code=${data}`)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const poststampindentdata = async (data) => {
    return await instance.post(`/masters/create`,data)
        .then(res => res.data)
        .catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}
export const stampindentreport = async (data) => {
    return await instance.get(`/masters/getReport?SR_CODE=${data.SR_CODE}&REQUEST_ID=${data.REQUEST_ID}&SR_NAME=${data.srname}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}

export const Stamppaymentupdate = async (data:any) => {
    return await instance.put('/masters/Stamppaymentupdate', data)
    .then(res => res.data)
    .catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'something went wrong')
        }
    })
}


export const getstampindentdetails = async (data) => {
    return await instance.get(`/masters/getstampindentdetails?SR_CODE=${data.SR_CODE}&REQUEST_ID=${data.REQUEST_ID}&AADHAAR=${data.AADHAAR}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}
export const deletestampdetails = async (data: any) => {
    console.log(data, 'data');
    
    // let mytoken = { headers: { Authorization: `Bearer ${token}` } }
    return await instance.delete(`/masters/deletestampdetails?srCode=${data.srCode}&stampCategory=${data.stampCategory}&stampType=${data.stampType}&denomination=${data.denomination}&noStamps=${data.noStamps}&amount=${data.amount}&purchaserName=${data.purchaserName}&purRelation=${data.purRelation}&purAddress=${data.purAddress}&rmName=${data.rmName}&rmRelation=${data.rmRelation}&rmAddress=${data.rmAddress}&requestId=${data.requestId}`)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
       
}
export const GetstampPaymentStatus = async (data:any) =>{
    return await instance.get(`/masters/verifyStampPayment?applicationNumber=${data}`)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}
export const freezstamp = async (data:any) => {
    return await instance.put('/masters/freezstamp', data)
    .then(res => res.data)
    .catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'something went wrong')
        }
    })
}
export const getstampindentreqdetails = async (data:any) =>{
    return await instance.get(`/masters/unpaidrequestlist?LoginId=${data.LoginId}&flag=${data.flag}`)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}
export const stampindentverification = async (data:any) =>{
        return await instance.get(`/masters/stampindentverification?LoginId=${data.LoginId}&SR_CODE=${data.SR_CODE}&STAMP_CATEGORY=${data.STAMP_CATEGORY}&STAMP_TYPE=${data.STAMP_TYPE}&DENOMINATION=${data.DENOMINATION}&LoginID=${data.LoginID}`)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}


//Stamp indent's API end
//added nri pan aadhar validation api 

export const useNriPanValidation = async (data: any) => {
       try {
           const response = await instance.get(`/documents/verifypandetails`, { params: data });
           return response.data;
       } catch (error) {
           return {
               status: false,
               message: get(error, 'response.data.message', 'something went wrong')
           }
       }

   }
   // passport api
   export const usegetPassportVerfication = async (data: any) => {
       try {
           const response = await instance.get(`/documents/verifypassportdetails`, { params: data });
           return response.data;
       } catch (error) {
           return {
               status: false,
               message: get(error, 'response.data.message', 'something went wrong')
           }
       }

   }

   //addingsection47a deatils 

    export const SaveSection_47Details = async (data: any) => {
        return await instance.post("/properties/section47a", data)
            .then((res) => { return res.data })
            .catch(e => {
                // console.log(e.response.data);
                return {
                    status: false,
                    message: e.response.data
                }
            });
    }
  //section47A APIs

  export const section47ApreviewPDF = async (data: any) => {
    return await instance.post(`section47A/Section47ApublicDoc`, data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}

//baseLPM based Market value
export const lpmbasenumber = async (data: any) => {
    return await instance.post('villages/LpmDivision', data)
        .then(res => { 
            return res.data })
    .catch(err => {
        return {
            status: false,
            message: get(err, 'response.data.message', 'LPM Basenumber list fetching failed')
        }
    })
}
export const lpmform4check = async (data: any) => {
    return await instance.post(`lpmBase/form4check`, data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'Server Error')
            }
        });
}

export const UseCCDownloadGSWS = async (info: any) => {     
    // return await instance.get(`/apiforother/downloadCCgsws?SR_CODE=${info.SR_CODE}&BOOK_NO=${info.BOOK_NO}&REG_YEAR=${info.REG_YEAR}&DOCT_NO=${info.DOCT_NO}`)
    return await instance.get(`/apiforother/downloadCCgsws?data=${info}`)
        .then((res) => { 
            if(res.data && res.data.data && res.data.data.length>0 && res.data.data[0].IMAGE.type == 'Buffer'){
                    let buffer:any = Buffer.from(res.data.data[0].IMAGE.data);
                    let base64:any = buffer.toString('base64');
                    downloadFileFromBase64(base64,"IMAGE", "image/tiff");
            }else{
                downloadFileFromBase64(res.data.data.dataBase64, res.data.data.fileName, "application/pdf");
            }
            return res.data
        })
        .catch(e => {
            return {
                status: false,
                message: get(e, 'response.data.message', 'Server Error')
            }
        });
}
export const documentPreview = async ( data: any,) => {   
    return await instance.get("/documents/documentPreview/" + data)
        .then((res) => { return res.data; })
        .catch((e) => {
            return {
                status: false,
                message: e.response.data
            }
        })
}

export const getAnywhereDocStatus = async (data: any) => {
    return await instance.get(`/documents/getAnywhereDocStatus/${data.APP_ID}`)
        .then((res) => res.data)
        .catch(e => ({
            status: false,
            message: e.message || "Anywhere Document Status Fetch Failed"
        }));
}


//slot booking functionality
//Franking API
export const UseFrankApi = async (data: any) => {
    // console.log(data);
    return await instance.post("/documents/frankId", data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: e.response.data
            }
        });
}

/**
 * Fetches property tax dues details from the backend based on the provided request parameters.
 * 
 * @param {Object} data - The request payload containing property identifiers.
 * @param {string|number} data.assessmentNo - The Property Tax Identification Number (PTIN) of the selected property.
 * @param {string|number} data.applicationId - The application ID associated with the selected property.
 * @param {string|number} data.propertyId - The unique identifier for the selected property.
 * 
 * @returns {Promise<{
*   status: boolean,
*   message: string,
*   data?: {
*     propertyID: string | number,
*     owners: string,
*     propertyAddress: string,
*     status: boolean,
*     exempted: boolean,
*     propertyDue: number,
*     waterTaxDue: number,
*     sewerageDue: number,
*     connectionCount: number,
*     siteExtent: string,
*     siteExtentUnit: string,
*     documentNumber: string,
*     mutationDues: number,
*     errorDetails: {
*       errorCode: string,
*       errorMessage: string
*     }
*   }
* }>} Returns a promise resolving to the tax dues response object.
*
*/

export const GetTaxDuesDetails = async (data: any) => {
    try {
        const response = await instance.post("/urban/taxDues", data);
        return response.data;
    } catch (e) {
        return {
            status: false,
            message: get(e, 'response.data.message', 'Something went wrong while fetching tax dues details'),
        };
    }
};

// Attaches a callback for only the rejection of the Promise.
// @param onrejected — The callback to execute when the Promise is rejected.
// @returns — A Promise for the completion of the callback.
//form60
export const useSaveForm60Details = async (data: any) => {
    return await instance.post(`/parties/form60Report/${data.appId}`, data.formData)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const verifyFormSixtyEsignStatus = async (data: any) => {
    return await instance.post("/parties/verifyEsignStatus", data)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.response.data
            }
        });
}

export const form60PreviewPDF = async (data) => {
    return await instance.get(`/parties/pdfpreview?SR_CODE=${data.appId}`)
        .then((res) => { return res.data })
        .catch(e => {
            return {
                status: false,
                message: e.message ? e.message : "Refuse Details Fetch Failed"
            }
        })
}

export const UseGetdownloadeSignedFile = async (data: any) => {
    return await instance.post("/parties/downloadForm60ById", data)
        .then((res) => res.data)
        .catch(e => {
            return {
                status: false,
                message: e.response?.data || "An error occurred"
            }
        });
}

/**
 * Validates PAN details with the backend service.
 *
 * @param {Object} data - The request payload containing PAN and related personal details.
 * @param {string} data.pan - The Permanent Account Number (PAN) to be validated.
 * @param {string} data.name - The full name of the individual as per PAN records.
 * @param {string} data.fathername - The name of the individual's father. (Can be an empty string if not applicable.)
 * @param {string} data.dob - The date of birth of the individual in 'DD/MM/YYYY' format.
 * 
 * @returns {Promise<{
*   status: boolean,
*   message: string,
*   statusCode: string,
*   data?: {
*     statusCode: number,
*     status: string,
*     message: string,
*     data: {
*       pan: string,               // Encrypted PAN number
*       pan_status: string,        // PAN status code (e.g., 'E' for Existing and Valid)
*       name: string,              // 'Y' if name matches, 'N' otherwise
*       fathername: string,        // Usually blank or match indicator
*       dob: string,               // 'Y' if DOB matches, 'N' otherwise
*       isAadhaarLinked: string    // 'Y' if Aadhaar is linked, 'N' otherwise
*     }
*   }
* }>} Returns a promise resolving to the PAN validation response. If the request fails, it returns `status: false` with an error message.
*/
export const getSaleCumGPADetails = async (data: any) => {
   try {
       const response = await instance.get(`/parties/getSaleCumGPADetails?sr_code=${data.sr_code}&book_no=${data.book_no}&doct_no=${data.doct_no}&reg_year=${data.reg_year}`);
       return response.data;
   } catch (e: any) {
       return {
           status: false,
           message: e?.response?.data?.message || "An error occurred"
       };
   }
};

export const getPanValidation = async (data: any) => {
   try {
       const response = await instance.post("/parties/panValiadation", data);
       return response.data;
   } catch (e: any) {
       return {
           status: false,
           message: e?.response?.data?.message || "An error occurred"
       };
   }
};

//form60


export const validateNonJudicialStamps = async (params : {mainSerialNumber : string; serialNumber : string,value:string}) => {
    try {
        const response = await instance.get(`/documents/validatenonjudicialstamppaper`, { params });
        return response.data;
        } catch (error) {
            return {
                status: false,
                message: error?.response?.data?.message ? error?.response?.data?.message : "Validating of Non-Judicial Stamps Failed"
            };
        }
};

export const validateUtilizedNonJudicialStamps = async (params : {mainSerialNumber : string; serialNumber : string,value:string}[]) => {
    try {
        const response = await instance.post(`/documents/validateutilizedstamps`, {noOfStampPapers:params });
        return response.data;
        } catch (error) {
            return {
                status: false,
                message: error?.response?.data?.message ? error?.response?.data?.message : "Validating of Non-Judicial Stamps Failed"
            };
        }
};
export const UseMobileVerify = async (data: any) => {
    return await instance.post(`/slots/mobile/mobileverify`,data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}


export const UseSendMobileOTP = async (data: any) => {
    return await instance.post(`/slots/mobile/mobilesendOtp`,data)
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e.response.data);
            return {
                status: false,
                message: get(e, 'response.data.message', '')
            }
        });
}

    export const getsroListData = async () => {
        return await instance.get('/masters/getSroDetailsData')
            .then(res => res.data)
            .catch(err => {
                return {
                    status: false,
                    message: get(err, 'response.data.message', 'SRO List Data Fetch Failed')
                }
            })
    }

    export const UseGetVSWSList = async (SR_CD: any) => {
        return await instance.get("/users/getvswslist?SR_CD="+ SR_CD)
            .then((res) => { return res.data })
            .catch(e => { 
                return { 
                    status: false, 
                    message: e.response.data ? e.response.data : "VSWS List Fetch Failed" 
                } 
            })
    };

    export const UseGetVSWSEmpList = async (Vill_CD: any) => {
        return await instance.get("/users/getvswsemplist?Vill_CD="+ Vill_CD)
            .then((res) => { return res.data })
            .catch(e => { 
                return { 
                    status: false, 
                    message: e.response.data ? e.response.data : "VSWS Employee List Fetch Failed"
                } 
            })
    };

    export const UseVSWSSendingMobileOTP = async (data: any) => {
        return await instance.post(`/users/mobile/vswssendOtp`,data)
            .then((res) => { return res.data })
            .catch(e => {
                return {
                    status: false,
                    message: get(e, 'response.data.message', '')
                }
            });
    }

    export const VSWSLogin = async (data: any) => {
        return await instance.post(`/users/vswslogin`,data)
            .then((res) => { return res.data })
            .catch(e => {
                return {
                    status: false,
                    message: get(e, 'response.data.message', '')
                }
            });
    }
export const UseGetSurveyNoList = async (params: { villageCode: string; searchValue: string }) => {
  try {
    const response = await instance.get(`/villages/survyeNoList`, { params });
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error?.response?.data?.message ?? "Validation of SurveyNo list Failed",
    };
  }
};

export const getReraProjectDetails = async (ProjectID) => {
  try {
    const response = await instance.get(`/villages/getReraProjectDetails?ProjectID=${ProjectID}`);
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error?.response?.data?.message ?? "Rera Project Details Fetched Successfully",
    };
  }
};

export const APIICLogin = async (val) => {
    return await instance.post('/users/APIICLogin', { loginPassword: val })
        .then(res => {
            return res.data
        }).catch(err => {
            return {
                status: false,
                message: get(err, 'response.data.message', 'something went wrong')
            }
        })
}

export const UsegetapiicGovtInstitutions = async () => {
    return await instance.get("users/getapiicGovtInstitutions")
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e);
            return {
                status: false,
                message:e.response &&  e.response.data && e.response.data ? e.response.data : "District List Fetch Failed."
            }
        });
}
export const UseGetAppicEmplData = async () => {
    return await instance.get("users/getApiicExc_data")
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e);
            return {
                status: false,
                message:e.response &&  e.response.data && e.response.data ? e.response.data : "District List Fetch Failed."
            }
        });
}


export const UseGetAppicEmplPersonData = async (data:any) => {
    return await instance.get(`users/getApiicExcPerData`,{params:data})
        .then((res) => { return res.data })
        .catch(e => {
            // console.log(e);
            return {
                status: false,
                message:e.response &&  e.response.data && e.response.data ? e.response.data : "District List Fetch Failed."
            }
        });
}

export const getSEZRepresentativeList = async () =>{
    try {
       const response = await instance.get(`/parties/getSEZRepresentativeList`);
       return response.data;
   } catch (e: any) {
       return {
           status: false,
           message: e?.response?.data?.message || "Failed to get SEZ Representative List"
       };
   }
}

export const getSezJuriSRO = async (data) =>{
    try {
       const response = await instance.get(`/villages/getSezJuriSRO?district=${data.district || ""}&mandal=${data.mandal || ""}&village=${data.village || ""}&hab=${data.hab || ""}`);
       return { status:response.data.status, data: response.data.response };
   } catch (e: any) {
       return {
           status: false,
           message: e?.response?.data?.message || "An error occurred"
       };
   }
}

    export const SaveAadharConsentDetails = async (data) => {
        return await instance.post("/masters/saveaadhaarconaccept", data)
            .then((res) => { return res.data })
            .catch(e => {
                return {
                    status: false,
                    message: e.message ? e.message : "Aadhar Consent Details Insert Failed"
                }
            })
    }

export const VerifyStockHoldingId = async (data) => {
  try {
    const response = await instance.post(`/documents/verifyStockHoldingId`, data);
    return response.data;
  } catch (error: any) {
    return {
      status: false,
      message: error?.response?.data?.message ?? "Something went wrong.",
    };
  }
};