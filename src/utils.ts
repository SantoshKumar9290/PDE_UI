import CryptoJS from "crypto-js";
import { store } from "./redux/store";
import { UseCrdaGetVillages } from "./axios";

export const encryptWithAES = (text) => {
  // const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE;
//   console.log(passphrase, passphrase.toString())
  return CryptoJS.AES.encrypt(text, '!Gr$@PdEApP&').toString();
};

export const decryptWithAES = (ciphertext) => {
	const passphrase = "!Gr$@PdEApP&"
	const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
};

export const encryptWithAESOTP = (text) => {
	// const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE;
  //   console.log(passphrase, passphrase.toString())
	return CryptoJS.AES.encrypt(text, '123456').toString();
  };


//   export const encryptWithAESPassPhrase = (text,key) => {
//     return CryptoJS.AES.encrypt(text, key).toString();
//   };


export const encryptId = (str) => {
	const ciphertext = CryptoJS.AES.encrypt(str, process.env.IGRS_AADHAAR_ENC);
	return ciphertext.toString();
}

export const encryptWithAESPassPhrase = (text,key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
};

export const NameValidation = (text) => {
        text = text.replace(/[^\w\s]/gi, "");
        text = text.replace(/[0-9]/gi, "");
        text = text.replace(/[_]/gi, "");
        if(text.length > 40){
            text = text.substring(0, 40);
        }
        return text;
}
export const floatNo = (text) => {
  text = text.replace(/[.]/gi, "");
}

export const maskAadharNumber = (aadharNumber:any) =>{
	// Replace all but the last 4 digits with asterisks
	// return String(aadharNumber).replace(/.(?=.{4})/g, '*');
  return aadharNumber
}

export const unmaskAadharNumber= (maskedAadharNumber:any)=> {
	// Remove all the asterisks
	return String(maskedAadharNumber).replace(/\*/g, '');
}

export const addDays = (days) => {

	let d = new Date();
  
	d.setDate(d.getDate() + Number(days));
  
	return d;
  }

export const EXECUTANT_CODES = ["EX", "MR", "DR", "RR", "FP", "LR", "PL", "TR", "NP", "DC", "OR", "HS", "PA", "AR", "FP", 'E'];

export const CLAIMANT_CODES = ['RE','AY','TE','CL','LE','ME','DE','OE','AP','SP','WI'];

export const WITNESS_CODES = ["WT"];

export function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

export const ALPHANUMERIC = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const checkCaptcha = (str) => {
	if(store.getState().common.captchaStr === str){
		return true;
	}else{
		return false;
	}
} 
export const returnDate = (d1) => {
	let d = (new Date(`${d1}`) ).toISOString().slice(0, -1);
	let y = new Date(d);
	return `${y.getDate() > 9 ? y.getDate() : `0${y.getDate()}`}/${(y.getMonth() + 1) > 9 ? (y.getMonth() + 1) : `0${y.getMonth() + 1}`}/${y.getFullYear()}`
	
}

export const ESPs = [{'type': 'eMudra', 'code': 'eMudra'}, {'type': 'NSDL', 'code': 'NSDL'}];

export const decryptId = (str) => {
	const passphrase = process.env.IGRS_AADHAAR_ENC;
	const bytes = CryptoJS.AES.decrypt(str, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
  }
export const allowSameSurvey = {
	'1': ['09','19','20','21','10',"25"],
	'2': [],
	'4': ['01','02','03'],
	'6':['01','02'],
	'8':['01','02','03','04','05'],
	'5':['05','09']
};
export const WeblandException ={
	'1': ["25"],
	'6':['02'],
	'8':['01','02','03','04','05','07'],
	'5':['05','09']
}
export const CheckCrdaVg =async(vg:any)=>{
	let res:any = await  UseCrdaGetVillages(vg);
	return res.status == true && res.data && res.data.length >0 ? true : false;
}

export const CrdaEmpCheck ={
	'1':["25"],
	'6':['02'],
	'8':['05']
}
let result:any =[];
export const recursiveIForAdhar =(data:any,type:any,iArray:any,party?:any)=>{
	if(party) result=[];
	if(Array.isArray(data)){
		data.forEach((e:any)=>{
			result.push(e[type]);
			if(e[iArray] && e[iArray].length >0){
				recursiveIForAdhar(e[iArray],type,iArray);
			}
		});
	}
	return result;
}

export const ValidateShareOnPartition = (Details:any,partyShare:any) => {
	let shareSplit:any = partyShare.split(",").sort((a,b)=>a-b);
	let msg:any=""
	
	for(let i=0; i<=shareSplit.length-1; i++){
		if(shareSplit[i] == shareSplit[i+1]){
			msg = "Invalid Share Number";
			break;
		}
	}
	if(Details && Details.length >0){
		
		let rs:any=[];
		Details.map((val:any)=>{
			val.share.split(",").forEach((s)=>{
				rs =[...rs,s];
			})
		});
		if(String(partyShare).includes(",")){
			String(partyShare).split(",").forEach((sp:any)=>{
				if(rs.includes(sp)){
					msg = "Already used party Number "+partyShare+" Please Enter another party number ";
					return msg;
				}

			})
		}else{
			String(partyShare).split(",").forEach((sp:any)=>{
			if(rs.includes(sp))
				msg = "Already used party Number "+partyShare+" Please Enter another party number ";
			else 
				msg =""
			})
		}
	}
	
	return msg;
}
export const CheckDutyFeeChalan =async (challans:any,dutyFee:any)=>{
	// window.alert(JSON.stringify(dutyFee))
	if(Number(challans[2].challanAmount) <= Number(dutyFee.sd_p) + Number(dutyFee.td_p)){
		return true;
	}else{
		return false;
	}
}
let fParty:any={},appId:"";
export const setPresenterData = async (data:any)=>{
	data.map((party:any)=>{
		if(party.applicationId){
			appId = party.applicationId
		}
		if(party.isPresenter){
			fParty={
				applicationId:appId,
				isPresenter: party.isPresenter,
				name:party.name,
				aadhaar:party.aadhaar,
				phone:party.phone
			}
		}else if(party.represents){
			setPresenterData(party.represents);
		}
	})
	// window.alert(JSON.stringify(fParty));
	return fParty;
}

export const DecryptAdrwithPkcs =(encrypted)=>{
	var keys = CryptoJS.enc.Utf8.parse(process.env.ADR_SECRET_KEY);
    let base64 = CryptoJS.enc.Base64.parse(encrypted);
    let src = CryptoJS.enc.Base64.stringify(base64);
    var decrypt = CryptoJS.AES.decrypt(src, keys, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
	return decrypt.toString(CryptoJS.enc.Utf8);
}

	

export const FreeHoldLands =["Assigned Land Made Free hold as per Act 35 of 2023","Assigned Land Made Freehold in 2023","Sharatugala patta made freehold","Village Service Inam made FreeHold in 2023","అసైన్డ్ ల్యాండ్ మేడ్ ఫ్రీహోల్డ్ ఇన్ 2023","అసైన్డ్ ల్యాండ్","విల్లెజ్  సర్వీస్  ఇనామ్ మేడ్ ఫ్రీహోల్డ్ ఇన్ 2023","ష పట్టా"]

/**
 * Returns today's date formatted as 'YYYY-MM-DD' (e.g., '2025-05-24').
 *
 * This function uses the local system time to get the current date,
 * and pads the month and day with leading zeros if necessary to ensure
 * the correct ISO format (commonly used in HTML date inputs).
 *
 * @returns A string representing today's date in 'YYYY-MM-DD' format.
 */
export const getTodayDate = (): string => {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
  };


// Define a list of major codes to be inclued from mutation payment processing.
const URBAN_MUTATION_ACCEPT_MAJOR_CODES = ['01', '03', '04', '05', '06'];

// Define a list of minor codes to be inclued from mutation payment processing.
const URBAN_MUTATION_ACCEPT_MINOR_CODES = {
    '01':['01', '04', '05', '06', '08', '14', '15', '16', '17', '19', '27'],
    '03':['01', '02', '03', '04', '05', '06', '07', '08', '09'],
    '04':['01', '02'],
    '05':['01', '02'],
    '06':['01'],
}

/**
 * Determines whether a document should be allow for mutation payment processing.
 *
 * Mutation payment processing is allow if:
 * - Its major transaction code is listed in the including major codes.
 * - Its minor transaction code is also listed under that major code in the including minor codes.
 *
 * @param documentNature - The documentNature object containing document transaction codes.
 * @returns `true` if the mutation payment processing should be allowed, `false` otherwise.
 */

export const allowMutationPayments = (documentNature: any): boolean => {
    const majorCode = documentNature?.TRAN_MAJ_CODE;
    const minorCode = documentNature?.TRAN_MIN_CODE;

    return (
      (URBAN_MUTATION_ACCEPT_MAJOR_CODES?.includes(majorCode) &&
      URBAN_MUTATION_ACCEPT_MINOR_CODES?.[majorCode]?.includes(minorCode)) ||
      false
    );
};

/**
 * Checks whether all mutation payments in the given list are cleared.
 *
 * This function sums up the `mutationPaymentDue` amounts from the list.
 * If the total due is 0, it indicates that all mutation payments are cleared.
 *
 * @param items - Array of objects possibly containing `mutationPaymentDue`.
 * @returns `true` if total due is 0 (i.e., all payments are cleared), otherwise `false`.
 */
export function isMutationPaymentDuesCleared(items: any): boolean {
	const totalDue = items.reduce((sum, item) => {
	  if (item?.urban_selling_extent?.toUpperCase() === "FULL") {
		return sum + (item?.mutationPaymentDue || 0);
	  }
	  return sum;
	}, 0);
	return totalDue <= 0;
  }

export const EncryptAdrwithPkcs =(text:string)=>{
	const parsedkey = CryptoJS.enc.Utf8.parse("!Gr$@SeCApP&");
    const iv = CryptoJS.enc.Utf8.parse("!Gr$IVApP&");
    return CryptoJS.AES.encrypt(text, parsedkey, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
}

/**
 * Converts a numeric value into its word representation in the Indian numbering system.
 *
 * - Handles values up to 1,00,00,00,000 (100 crore).
 * - Supports Indian units like crore, lakh, thousand, and hundred.
 * - Returns the amount followed by "rupees".
 * - Special cases: 
 *   - 0 → "0 rupees"
 *   - 1000000000 → "100 crore rupees"
 *
 * @param num - The number to be converted.
 * @returns A string representing the number in words followed by "rupees".
 *
 * @example
 * numberToWords(5234); // "five thousand two hundred thirty four rupees"
 * numberToWords(100000); // "one lakh rupees"
 * numberToWords(0); // "0 rupees"
 */
export const numberToWords = (num: number): string => {
	if (num === 0) return "0 rupees";
	if (num === 1000000000) return "100 crore rupees"; // special case

	const a = [
		"",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen",
	];
	const b = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety",
	];
	const inWords = (n: number): string => {
		if (n < 20) return a[n];
		if (n < 100)
		return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
		if (n < 1000)
		return (
			a[Math.floor(n / 100)] +
			" hundred " +
			(n % 100 ? inWords(n % 100) : "")
		);
		return "";
	};

	let output = "";
	if (Math.floor(num / 10000000) > 0) {
		output += inWords(Math.floor(num / 10000000)) + " crore ";
		num %= 10000000;
	}
	if (Math.floor(num / 100000) > 0) {
		output += inWords(Math.floor(num / 100000)) + " lakh ";
		num %= 100000;
	}
	if (Math.floor(num / 1000) > 0) {
		output += inWords(Math.floor(num / 1000)) + " thousand ";
		num %= 1000;
	}
	if (Math.floor(num / 100) > 0) {
		output += inWords(Math.floor(num / 100)) + " hundred ";
		num %= 100;
	}
	if (num > 0) {
		output += inWords(num) + " ";
	}
	return output.trim() + " rupees";
};


export const Consent1 = "I hereby give my consent to use my Aadhaar information for verification and registration purposes under the IGRS Registration Department, Government of Andhra Pradesh."

export const Consent2_Eng = `I hereby give my consent and have no objection to the IGRS Department obtaining my eKYC details using my Aadhaar number and biometric data through UIDAI-based authentication.
I understand that this authentication and eKYC information will be used only for the purpose of IGRS Department services and will not be shared or used for any other purpose.
I also understand that the biometric information I provide will be used solely for this authentication and transaction. The IGRS Department shall ensure the security and confidentiality of my personal identity data used for Aadhaar-based authentication.`


// If the Consent2_Tel content changes, the AadharConsentTeluguAudio should also be Changed.
export const Consent2_Tel = `నేను, నా ఆధార్ నంబర్ మరియు బయోమెట్రిక్ వివరాలను ఉపయోగించి UIDAI ఆధారిత ధృవీకరణ ద్వారా నా eKYC వివరాలను పొందేందుకు IGRS శాఖకు నా సమ్మతిని ఇస్తున్నాను మరియు దానిపై నాకు ఎటువంటి అభ్యంతరం లేదు.

ఈ ధృవీకరణ మరియు eKYC సమాచారం IGRS శాఖ సేవల కోసం మాత్రమే ఉపయోగించబడుతుంది, ఇతర ఏ ఉద్దేశ్యానికి అయినా పంచబడదు లేదా ఉపయోగించబడదు అని నేను అర్థం చేసుకుంటున్నాను.

నేను అందించే బయోమెట్రిక్ సమాచారం ఈ ధృవీకరణ మరియు లావాదేవీ కోసం మాత్రమే ఉపయోగించబడుతుంది అని కూడా నేను అర్థం చేసుకుంటున్నాను.

IGRS శాఖ, ఆధార్ ఆధారిత ధృవీకరణలో ఉపయోగించిన నా వ్యక్తిగత గుర్తింపు వివరాల భద్రత మరియు గోప్యతను నిర్ధారిస్తుంది.`