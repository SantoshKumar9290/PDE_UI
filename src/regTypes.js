let regType = {
    WithDoc: [
        // {
        //     TRAN_MAJ_CODE: "01",
        //     TRAN_MIN_CODE: "00",
        //     TRAN_DESC: "Sale [విక్రయం]",
        //     PARTY1: "Executant",
        //     PARTY1_CODE: "EX",
        //     PARTY2: "Claimant",
        //     PARTY2_CODE: "CL"
        // },
        // {
        //     TRAN_MAJ_CODE: "01",
        //     TRAN_MIN_CODE: "01",
        //     TRAN_DESC: "Sale Deed [విక్రయ దస్తావేజు]"
        // },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Sale [విక్రయం]",
            PARTY1: "Executant",
            PARTY1_CODE: "EX",
            PARTY2: "Claimant",
            PARTY2_CODE: "CL"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Sale Deed [విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Sale Agreement With Possession [విక్రయ స్వాధీన ఒప్పందము]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Sale Agreement Without Possession [విక్రయ ఆస్వాధీన ఒప్పందము]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Sale Deed Executed By A.P.Housing Board [ఎ.పి హౌసింగ్ బోర్డు క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Sale Deed Executed By Or Infavour Of Constituted By Govt. [ప్రభుత్వముచే / ప్రభుత్వము పేరిట కాబడిన విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Sale Deed Executed By Society In f/o Member [సొసైటిలు వారి సభ్యులకు చేసే క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Instruments Between Co-Ops,Govt. & Other Financial Institute [కోఆపరేటివ్ సొసైటిలు/ప్రభుత్వము వారికి ఆర్ధిక సంస్థలకు మధ్య జరిగే లావాదేవీలు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Sale Deed In Favour Of State Or Central Govt. [కేంద్ర, రాష్ట్ర ప్రభుత్వములకు క్రయం]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Development Agreement Or Construction Agreement [అభివృద్ధి /లేదా నిర్మాణ ఒప్పందము దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Development Agreement Cum GPA [జనరల్ పవర్ తో కూడిన అభివృద్ది ఒప్పంద దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Agreement Of Sale Cum GPA [జనరల్ పవర్ తో కూడిన క్రయ ఒప్పందం]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Conveyance Deed(Without Consideration) [కన్వేయన్స్ పత్రం(విలువ లేదు)]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Conveyance For Consideration [ప్రతిఫలముతో కూడిన కన్వేయన్స్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "14",
            TRAN_DESC: "Sale Deed in Favour of Mortgagee [తనఖా గ్రహీత కు చేసే విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "15",
            TRAN_DESC: "Sale with Indemnity [పూచీతో కూడిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "16",
            TRAN_DESC: "Sale Deeds in f/o agrl Labrs (SC/ST) Funded by SC Fin. Corpn [SC/ST ఫైనాన్స్ కార్పొరేషన్ వారు దాఖలు చేసే క్రయ పత్రాలు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "17",
            TRAN_DESC: "Sale of life interest [జీవిత కాలపు హక్కులు కలిగిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "18",
            TRAN_DESC: "Sale of Terrace Rights [టెర్రస్ హక్కుల క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "19",
            TRAN_DESC: "Sale Deeds executed by Courts [కోర్టుల ద్వారా అమలు కాబడిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "20",
            TRAN_DESC: "Court Sale Certificate [కోర్టు క్రయ దృవీకరణ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "21",
            TRAN_DESC: "Court Decree [కోర్టు డిక్రీ]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "22",
            TRAN_DESC: "Sale(others) [క్రయము(ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "23",
            TRAN_DESC: "GPA [జనరల్ పవర్ ఆఫ్ అటార్నీ]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "24",
            TRAN_DESC: "SadaBainama (Sale) [సాదా బైనామా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "25",
            TRAN_DESC: "Development Agreement/GPA/Supplemental Deed By CRDA"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "26",
            TRAN_DESC: "Conveyance (Merger, Demerger, Amalgamation of Companies)"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "27",
            TRAN_DESC: "Court sale certificate SARFAESI ACT "
        },
        // {
        //     TRAN_MAJ_CODE: "02",
        //     TRAN_MIN_CODE: "00",
        //     TRAN_DESC: "Mortgage [అస్వాదీన తనఖా]",
        //     PARTY1: "Mortgagor",
        //     PARTY1_CODE: "MR",
        //     PARTY2: "Mortgagee",
        //     PARTY2_CODE: "ME"
        // },
        // {
        //     TRAN_MAJ_CODE: "02",
        //     TRAN_MIN_CODE: "02",
        //     TRAN_DESC: "Mortgage without Possession [అస్వాధీన తనఖా]"
        // },
		// {
        //     TRAN_MAJ_CODE: "02",
        //     TRAN_MIN_CODE: "06",
        //     TRAN_DESC: "Mortgage Deed by Small Farmer for Agrl.Loans in f/o PAC/Bank [సన్నకారు రైతులు పి.ఎ.సి.ఎస్. బ్యాంకు నందు పెట్టె అస్వాధీన తనఖా]"
        // },
        // {
        //     TRAN_MAJ_CODE: "02",
        //     TRAN_MIN_CODE: "00",
        //     TRAN_DESC: "Mortgage [అస్వాదీన తనఖా]",
        //     PARTY1: "Mortgagor",
        //     PARTY1_CODE: "MR",
        //     PARTY2: "Mortgagee",
        //     PARTY2_CODE: "ME"
        // },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Mortgage [అస్వాదీన తనఖా]",
            PARTY1: "Mortgagor",
            PARTY1_CODE: "MR",
            PARTY2: "Mortgagee",
            PARTY2_CODE: "ME",
            PARTY3: "Witness",
            PARTY3_CODE: "WT",
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Mortgage with Possession [స్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Mortgage without Possession [అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Mort. Deed in f/o Governer/President of India by Gt.Servants [ప్రభుత్వ ఉద్యోగులు గవర్నరు/రాష్ట్రపతి కి చేసే తనఖా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Assignment Deed [అసైన్ మెంట్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Mortgage Deed By Co-Operative Society in f/o Govt. [సహకార సంస్థలు ప్రభుత్వముకు చేసే తనఖా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Mortgage Deed by Small Farmer for Agrl.Loans in f/o PAC/Bank [సన్నకారు రైతులు పి.ఎ.సి.ఎస్. బ్యాంకు నందు పెట్టె అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Mortgagee Deed Between Socity to Socity Or Banks [సొసైటి నుండి సొసైటి మరియు బ్యాంకులకు మధ్య జరిగే తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Deposit of Title Deeds [టైటిల్ డీడ్స్ డిపాజిట్ చేయుట ద్వారా తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Security Bond [భద్రతా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Mortgages in f/o Grameena or Scheduled Bank for Agricultural Credit [గ్రామీణ బ్యాంకు లకు చేసే అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Mortgages in f/o Coop Credit Societies of Weaker Section of Non-Agricultural Class Loan <=10000 [కోఆపరేటివ్ క్రెడిట్ సొసైటి లకు పదివేల సంభందిత ఆస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Instruments Between Co-Op and Other Co-Op,Banks,Financial Inst or Govt. [కోఆపరేటివ్ ఇతర కోఆపరేటివ్ బ్యాంకుల మధ్య ఆరువేల లోపు చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Instruments in f/o House Bldg Co-Op Societies for Loan Upto Rs.30000  Under L.I.G.H Scheme [L.I.G.H స్కీమ్ కింద రూ.30000 వరకు రుణం కోసం f/o హౌస్ Bldg కో-ఆప్ సొసైటీలలోని సాధనాలు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "14",
            TRAN_DESC: "Mortgages Executed by Members of Co-Op Urban and Town Banks in f/o Such Banks for Loan Upto Rs.15000 [కో-ఆప్ అర్బన్ మరియు టౌన్ బ్యాంకుల సభ్యులు రూ.15000 వరకు రుణం కోసం అటువంటి బ్యాంకులలో తనఖా అమలు చేస్తారు.]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "15",
            TRAN_DESC: "Instruments In f/o SBI And Nationalised Banks For Loan Upto Rs.6500 Under Diff Rates of Int. Adv. / "
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "16",
            TRAN_DESC: "Further Charge - When the Original Mortgage is With Possession [స్వాధీన తనఖా దస్తావేజు పై తదుపరి చార్జ్]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "17",
            TRAN_DESC: "Further Charge-Orig. Mortg is Without Possession And Possession Is Agreed to Be Given At Execution [ఆస్వాధీనతో కూడిన తనఖా దస్తావేజు పై మరింత రుణము పొందు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "18",
            TRAN_DESC: "Further Charge - Without Possession on a Simple Mortgage [తనఖా దస్తావేజు పై మీరు చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "19",
            TRAN_DESC: "Mortgage by Conditional Sale [విక్రయ షరతుతో కూడిన అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "20",
            TRAN_DESC: "Agreement Varying the Terms Of Previously Registered Mortgage Deed [పూర్వపు అస్వాధీన తనఖాలు ఏమైనా ఒప్పోంద మార్పులు ఉంటే చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "21",
            TRAN_DESC: "Additional Security [అదనపు భద్రతతో చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "22",
            TRAN_DESC: "Substituted Security [ప్రత్యాన్మయ భద్రతా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "23",
            TRAN_DESC: "Mortgage(Others) [తనఖా (ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Gift [దాన పత్రము]",
            PARTY1: "Donor",
            PARTY1_CODE: "DR",
            PARTY2: "Donee",
            PARTY2_CODE: "DE"
        },
        // {
        //     TRAN_MAJ_CODE: "03",
        //     TRAN_MIN_CODE: "02",
        //     TRAN_DESC: "Gift Settlement In f/o Family Member [కుటుంబ సభ్యులకు దఖలు]"
        // },
        // {
        //     TRAN_MAJ_CODE: "03",
        //     TRAN_MIN_CODE: "01",
        //     TRAN_DESC: "Gift [దాన పత్రము]",
        //     PARTY1: "Donor",
        //     PARTY1_CODE: "DR",
        //     PARTY2: "Donee",
        //     PARTY2_CODE: "DE"
        // },
        {
          TRAN_MAJ_CODE: "03",
          TRAN_MIN_CODE: "01",
          TRAN_DESC: "Gift  [దాన పత్రము]",
         },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Gift Settlement In f/o Family Member [కుటుంబ సభ్యులకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Gift Settlement In f/o Others [ఇతరులకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Gift Settlement For Charitable/Religious Purposes [మతధార్మిక సంస్థకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Gift Settlement In f/o Local Bodies [స్థానిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Gift In f/o Local Bodies (G.O 137) [స్థానిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Gift For Charitable Religious Purposes/God [మత, ధార్మిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Gift In Favour Of Government [ప్రభుత్వమునకు దాన పత్రము]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Gift Settlement Deeds In Favour Of Government [ప్రభుత్వమునకు దఖలు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Gift Of Terrace Rights [టెర్రేస్ హక్కుల దానపత్రము]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Gift Settlement Of Terrace Rights [టెర్రేస్ హక్కుల దఖలు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Gift Reserving Life Interest [జీవితకాలపు హక్కు ఉంచుకొని చేసే దాన దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Gift Settlement Reserving Life Interest [జీవితకాలపు హక్కు ఉంచుకొని చేసే దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Partition [భాగపంపిణి]",
            PARTY1: "Executant",
            PARTY1_CODE: "EX",
            PARTY2: "Claimant",
            PARTY2_CODE: "CL",
            PARTY3: "Witness",
            PARTY3_CODE: "WT",
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Partition  [భాగపంపిణి]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Partition Among Family Members [కుటుంబ సభ్యుల మధ్య జరుగు భాగ పంపిణీ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Partition executed by Court"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Intestate Succession Partition  [వారసత్వ భాగపంపిణి (పత్రం లేని)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Release [హక్కు విడుదల]",
            PARTY1: "Releasor",
            PARTY1_CODE: "RR",
            PARTY2: "Releasee",
            PARTY2_CODE: "RE"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Release (Co-Parceners) [హక్కు విడుదల]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Release (Others) [హక్కు విడుదల(ఇతరులకు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Reconveyance Deed Executed By Govt In Fovour Of Employees [ఉద్యోగుల పేరిట ప్రభుత్వము చేయు రికన్వేయన్స్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Reconveyance Deed(Others) [రికన్వేయన్స్ పత్రం(ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Receipt (R.T.D.M) [చెల్లు రశీదు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Release (Federation OR Society To Society) [ఫెడరేషన్ లేదా సొసైటి వారికి మధ్య జరిగే హక్కు విడుదల]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Release Of Life Interest [జీవిత కాలపు హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Release Of Disputed Right [వివాదాస్పద హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Release Of Mortgage Right"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Release Of Maintenance Right By Way Of Relinquishing Right For Immovable Property [మనోవర్తి హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Release(Others) [హక్కు విడుదల (ఇతరములు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Release Among Family Members [కుటుంబ సభ్యుల మధ్య జరుగు హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Exchange [మార్పిడి దస్తావేజు]",
            PARTY1: "First Party",
            PARTY1_CODE: "FP",
            PARTY2: "Second Party",
            PARTY2_CODE: "SP"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Exchange  [మార్పిడి దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Exchange by CRDA"
        },
         {
          TRAN_MAJ_CODE: "07",
          TRAN_MIN_CODE: "00",
          TRAN_DESC: "Lease [కౌలు]",
          PARTY1: "Lessor",
          PARTY1_CODE: "LR",
          PARTY2: "Lessee",
          PARTY2_CODE: "LE"
         },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Lease  Deed [కౌలు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Lease In Favour Of State/Central Govt. [కేంద్ర, రాష్ట్ర ప్రభుత్వములకు కౌలు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Mining Lease [గనుల అద్దె]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Salt Leases With Ground Rent [భూమి అద్దె తో కూడిన ఉప్పు ఒప్పొందము]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Transfer Of Lease [అద్దె ఒప్పంద బదిలీ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Surrender Of Lease [అద్దె ఒప్పంద రద్దు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Lease(Others) [అద్దె ఖరారు (ఇతరములు)]"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Rectification or Ratification or Cancellation Deed [సవరణ/ఒప్పుదల/రద్దు పత్రము]",
            PARTY1: "Executant",
            PARTY1_CODE: "EX",
            PARTY2: "Claimant",
            PARTY2_CODE: "CL"
        },

          {
              TRAN_MAJ_CODE: "08",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Rectification Deed [సవరణ పత్రము]"
          },

          {
              TRAN_MAJ_CODE: "08",
              TRAN_MIN_CODE: "02",
              TRAN_DESC: "Supplemental Deed, Ratification Deed U/S 4 Of I.S.Act [అనుబంధ ఒప్పుదల దస్తావేజు]"
          },

          {
              TRAN_MAJ_CODE: "08",
              TRAN_MIN_CODE: "03",
              TRAN_DESC: "Cancellation Deed [రద్దు పత్రము]"
          },

          {
              TRAN_MAJ_CODE: "08",
              TRAN_MIN_CODE: "04",
              TRAN_DESC: "Revocation Of Gift Settlement [దాఖలు పత్రము ఉప సంహరణ]"
          },
          {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Rectification deed by CRDA"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Cancellation deed executed by Govt/ Govt. Authority"
        },
        //  {
        //   TRAN_MAJ_CODE: "03",
        //   TRAN_MIN_CODE: "01",
        //   TRAN_DESC: "Gift [దాన పత్రము]",
        //   PARTY1: "Donor",
        //   PARTY1_CODE: "DR",
        //   PARTY2: "Donee",
        //   PARTY2_CODE: "DE"
        //  },
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Power Of Attorney [పవర్ ఆఫ్ అటార్నీ].",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Power To Sell Immovable Property (No Value Mentioned)[పవర్ ఆఫ్ అటార్నీ]",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "GPA In Favour Of  Family Members[పవర్ ఆఫ్ అటార్నీ]",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
        {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Will [వీలునామా]",
            PARTY1: "Testator",
            PARTY1_CODE: "TR"
           },
           {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Will  [వీలునామా]",
            PARTY1: "Testator",
            PARTY1_CODE: "TR"
           },
          {
              TRAN_MAJ_CODE: "20",
              TRAN_MIN_CODE: "02",
              TRAN_DESC: "Cancellation Of Will [వీలునామా రద్దు]",
              PARTY1: "Testator",
              PARTY1_CODE: "TR"
          },
          {
              TRAN_MAJ_CODE: "20",
              TRAN_MIN_CODE: "03",
              TRAN_DESC: "Codicil [వీలునామా అనుబంధ దస్తావేజు]"
          },
          {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Will in Sealed Cover"
        },
               {
                TRAN_MAJ_CODE: "21",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Authority To Adopt [దత్తత స్వీకార పత్రము]",
                PARTY1: "Testator",
                PARTY1_CODE: "TR"
               },
               {
                TRAN_MAJ_CODE: "21",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Authority To Adopt [దత్తత స్వీకార పత్రము]",
                PARTY1: "Testator",
                PARTY1_CODE: "TR"
               },
               {
                TRAN_MAJ_CODE: "30",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Adoption Deed [దత్త స్వీకరణ]",
                PARTY1: "Natural Parents",
                PARTY1_CODE: "NP",
                PARTY2: "Adoptive Parents",
                PARTY2_CODE: "AP"
               },
               {
                TRAN_MAJ_CODE: "30",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Adoption Deed  [దత్త స్వీకరణ]",
                PARTY1_CODE: "NP",
                PARTY2_CODE: "AP"
               },
               {
                TRAN_MAJ_CODE: "31",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Affidavit [ప్రమాణ పత్రము]",
                PARTY1: "Declarant",
                PARTY1_CODE: "DC"
               },
               {
                TRAN_MAJ_CODE: "31",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Affidavit  [ప్రమాణ పత్రము]",
                PARTY1_CODE: "DC"
               },
               {
                TRAN_MAJ_CODE: "32",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Agreement (Others) [ఒప్పందం(ఇతరులు)]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "32",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Agreement  (Others)  [ఒప్పందం (ఇతరులు)]",
                PARTY1_CODE: "EX",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "33",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Award (Not Directing Partition) [భాగపంపిణి చేసుకోవద్దని చెప్పే తీర్పు పత్రము]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX"
               },
               {
                TRAN_MAJ_CODE: "33",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Award  (Not Directing Partition)  [భాగపంపిణి చేసుకోవద్దని చెప్పే తీర్పు పత్రము]",
                PARTY1_CODE: "EX"
               },
               {
                TRAN_MAJ_CODE: "34",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Bond [పూచీ పత్రము]",
                PARTY1: "Obligor",
                PARTY1_CODE: "OR",
                PARTY2: "Obligee",
                PARTY2_CODE: "OE"
               },
               {
                TRAN_MAJ_CODE: "34",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Bond  [పూచీ పత్రము]",
                PARTY1_CODE: "OR",
                PARTY2_CODE: "OE"
               },
               {
                TRAN_MAJ_CODE: "35",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Cancellation GPA [జనరల్ పవర్ ఆఫ్ అటార్నీ రద్దు పత్రం]",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "35",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Cancellation  GPA  [జనరల్ పవర్ ఆఫ్ అటార్నీ రద్దు పత్రం]",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "36",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Cancellation (Others) [రద్దు పత్రము(ఇతరులు)]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "36",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Cancellation  (Others)  [రద్దు పత్రము(ఇతరులు)]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "37",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Divorce [విడాకుల పత్రము]",
                PARTY1: "Husband",
                PARTY1_CODE: "HS",
                PARTY2: "Wife",
                PARTY2_CODE: "WI"
               },
               {
                TRAN_MAJ_CODE: "37",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Divorce   [విడాకుల పత్రము]",
                PARTY1: "Husband",
                PARTY1_CODE: "HS",
                PARTY2: "Wife",
                PARTY2_CODE: "WI"
               },
               {
                TRAN_MAJ_CODE: "38",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Indemnity Bond [నష్ట పరిహార పూచీ పత్రం]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "38",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Indemnity  Bond  [నష్ట పరిహార పూచీ పత్రం]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "39",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Partnership [భాగస్వామ్యము]",
                PARTY1: "Partners",
                PARTY1_CODE: "PA"
               },
               {
                TRAN_MAJ_CODE: "39",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Partnership  [భాగస్వామ్యము]",
                PARTY1: "Partners",
                PARTY1_CODE: "PA"
               },
               {
                TRAN_MAJ_CODE: "40",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Dissolution Of Partnership [భాగస్వామ్య రద్దు]",
                PARTY1: "Partners",
                PARTY1_CODE: "PA"
               },
               {
                TRAN_MAJ_CODE: "40",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Dissolution Of  Partnership  [భాగస్వామ్య రద్దు]",
                PARTY1: "Partners",
                PARTY1_CODE: "PA"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Power Of Attorney [పవర్ ఆఫ్ అటార్నీ]",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Special Power",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "02",
                TRAN_DESC: "General Power",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "03",
                TRAN_DESC: "Power for Consideration",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "04",
                TRAN_DESC: "Power to sell Immovable Property (no value mentioned) [స్తిరాస్తి విక్రయమునకు పవర్]",
                PARTY1: "Principal",
                PARTY1_CODE: "PL",
                PARTY2: "Attorney",
                PARTY2_CODE: "AY"
               },
               {
                TRAN_MAJ_CODE: "41",
                TRAN_MIN_CODE: "05",
                TRAN_DESC: "GPA In Favour Of  Family Members [కుటుంబ సభ్యులకు అనుకూలంగా GPA]"
               },
               {
                TRAN_MAJ_CODE: "42",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Security Bond [భద్రతా పూచీ పత్రం]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "42",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Security  Bond [భద్రతా పూచీ పత్రం]",
                PARTY1: "Executant",
                PARTY1_CODE: "EX",
                PARTY2: "Claimant",
                PARTY2_CODE: "CL"
               },
               {
                TRAN_MAJ_CODE: "43",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Trust [ట్రస్టు]",
                PARTY1: "Author/Settlor",
                PARTY1_CODE: "AR",
                PARTY2: "Trustees/Beneficiary",
                PARTY2_CODE: "TE"
               },
               {
                TRAN_MAJ_CODE: "43",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Declaration  [ప్రకటన]",
                PARTY1: "Author/Settlor",
                PARTY1_CODE: "AR",
                PARTY2: "Trustees/Beneficiary",
                PARTY2_CODE: "TE"
               },
               {
                TRAN_MAJ_CODE: "43",
                TRAN_MIN_CODE: "02",
                TRAN_DESC: "Others (Settlement) [సెటిల్మెంట్(ఇతరములు)]",
                PARTY1: "Author/Settlor",
                PARTY1_CODE: "AR",
                PARTY2: "Trustees/Beneficiary",
                PARTY2_CODE: "TE"
               },
               {
                TRAN_MAJ_CODE: "43",
                TRAN_MIN_CODE: "03",
                TRAN_DESC: "Revocation [ఉపసంహరణ/రద్దు పత్రము]",
                PARTY1: "Author/Settlor",
                PARTY1_CODE: "AR",
                PARTY2: "Trustees/Beneficiary",
                PARTY2_CODE: "TE"
               },
               {
                TRAN_MAJ_CODE: "44",
                TRAN_MIN_CODE: "00",
                TRAN_DESC: "Book 4 (Others) [బుక్ 4 దస్తావేజు (ఇతరములు)]",
                PARTY1: "First Party",
                PARTY1_CODE: "FP",
                PARTY2: "Second Party",
                PARTY2_CODE: "SP"
               },
               {
                TRAN_MAJ_CODE: "44",
                TRAN_MIN_CODE: "01",
                TRAN_DESC: "Book 4 (Others)  [బుక్ 4 దస్తావేజు (ఇతరములు)]"
               },

    ],
    WithoutDoc: [
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Sale [విక్రయం]",
            PARTY1: "Executant",
            PARTY1_CODE: "EX",
            PARTY2: "Claimant",
            PARTY2_CODE: "CL"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Sale Deed [విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Sale Agreement With Possession [విక్రయ స్వాధీన ఒప్పందము]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Sale Agreement Without Possession [విక్రయ ఆస్వాధీన ఒప్పందము]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Sale Deed Executed By A.P.Housing Board [ఎ.పి హౌసింగ్ బోర్డు క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Sale Deed Executed By Or Infavour Of Constituted By Govt. [ప్రభుత్వముచే / ప్రభుత్వము పేరిట కాబడిన విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Sale Deed Executed By Society In f/o Member [సొసైటిలు వారి సభ్యులకు చేసే క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Instruments Between Co-Ops,Govt. & Other Financial Institute [కోఆపరేటివ్ సొసైటిలు/ప్రభుత్వము వారికి ఆర్ధిక సంస్థలకు మధ్య జరిగే లావాదేవీలు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Sale Deed In Favour Of State Or Central Govt. [కేంద్ర, రాష్ట్ర ప్రభుత్వములకు క్రయం]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Development Agreement Or Construction Agreement [అభివృద్ధి /లేదా నిర్మాణ ఒప్పందము దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Development Agreement Cum GPA [జనరల్ పవర్ తో కూడిన అభివృద్ది ఒప్పంద దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Agreement Of Sale Cum GPA [జనరల్ పవర్ తో కూడిన క్రయ ఒప్పందం]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Conveyance Deed(Without Consideration) [కన్వేయన్స్ పత్రం(విలువ లేదు)]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Conveyance For Consideration [ప్రతిఫలముతో కూడిన కన్వేయన్స్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "14",
            TRAN_DESC: "Sale Deed in Favour of Mortgagee [తనఖా గ్రహీత కు చేసే విక్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "15",
            TRAN_DESC: "Sale with Indemnity [పూచీతో కూడిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "16",
            TRAN_DESC: "Sale Deeds in f/o agrl Labrs (SC/ST) Funded by SC Fin. Corpn [SC/ST ఫైనాన్స్ కార్పొరేషన్ వారు దాఖలు చేసే క్రయ పత్రాలు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "17",
            TRAN_DESC: "Sale of life interest [జీవిత కాలపు హక్కులు కలిగిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "18",
            TRAN_DESC: "Sale of Terrace Rights [టెర్రస్ హక్కుల క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "19",
            TRAN_DESC: "Sale Deeds executed by Courts [కోర్టుల ద్వారా అమలు కాబడిన క్రయ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "20",
            TRAN_DESC: "Court Sale Certificate [కోర్టు క్రయ దృవీకరణ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "21",
            TRAN_DESC: "Court Decree [కోర్టు డిక్రీ]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "22",
            TRAN_DESC: "Sale(others) [క్రయము(ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "23",
            TRAN_DESC: "GPA [జనరల్ పవర్ ఆఫ్ అటార్నీ]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "24",
            TRAN_DESC: "SadaBainama (Sale) [సాదా బైనామా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "25",
            TRAN_DESC: "Development Agreement/GPA/Supplemental Deed By CRDA"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "26",
            TRAN_DESC: "Conveyance (Merger, Demerger, Amalgamation of Companies)"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "27",
            TRAN_DESC: "Court sale certificate SARFAESI ACT "
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "28",
            TRAN_DESC: "ABOVE POVERTY LINE [పేదరిక రేఖకు పైన జీవించేవారు]"
        },
        {
            TRAN_MAJ_CODE: "01",
            TRAN_MIN_CODE: "29",
            TRAN_DESC: "BELOW POVERTY LINE  [పేదరిక రేఖకు దిగువన జీవించే వారు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Mortgage [అస్వాదీన తనఖా]",
            PARTY1: "Mortgagor",
            PARTY1_CODE: "MR",
            PARTY2: "Mortgagee",
            PARTY2_CODE: "ME"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Mortgage with Possession [స్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Mortgage without Possession [అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Mort. Deed in f/o Governer/President of India by Gt.Servants [ప్రభుత్వ ఉద్యోగులు గవర్నరు/రాష్ట్రపతి కి చేసే తనఖా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Assignment Deed [అసైన్ మెంట్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Mortgage Deed By Co-Operative Society in f/o Govt. [సహకార సంస్థలు ప్రభుత్వముకు చేసే తనఖా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Mortgage Deed by Small Farmer for Agrl.Loans in f/o PAC/Bank [సన్నకారు రైతులు పి.ఎ.సి.ఎస్. బ్యాంకు నందు పెట్టె అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Mortgagee Deed Between Socity to Socity Or Banks [సొసైటి నుండి సొసైటి మరియు బ్యాంకులకు మధ్య జరిగే తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Deposit of Title Deeds [టైటిల్ డీడ్స్ డిపాజిట్ చేయుట ద్వారా తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Security Bond [భద్రతా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Mortgages in f/o Grameena or Scheduled Bank for Agricultural Credit [గ్రామీణ బ్యాంకు లకు చేసే అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Mortgages in f/o Coop Credit Societies of Weaker Section of Non-Agricultural Class Loan <=10000 [కోఆపరేటివ్ క్రెడిట్ సొసైటి లకు పదివేల సంభందిత ఆస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Instruments Between Co-Op and Other Co-Op,Banks,Financial Inst or Govt. [కోఆపరేటివ్ ఇతర కోఆపరేటివ్ బ్యాంకుల మధ్య ఆరువేల లోపు చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Instruments in f/o House Bldg Co-Op Societies for Loan Upto Rs.30000  Under L.I.G.H Scheme [L.I.G.H స్కీమ్ కింద రూ.30000 వరకు రుణం కోసం f/o హౌస్ Bldg కో-ఆప్ సొసైటీలలోని సాధనాలు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "14",
            TRAN_DESC: "Mortgages Executed by Members of Co-Op Urban and Town Banks in f/o Such Banks for Loan Upto Rs.15000 [కో-ఆప్ అర్బన్ మరియు టౌన్ బ్యాంకుల సభ్యులు రూ.15000 వరకు రుణం కోసం అటువంటి బ్యాంకులలో తనఖా అమలు చేస్తారు.]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "15",
            TRAN_DESC: "Instruments In f/o SBI And Nationalised Banks For Loan Upto Rs.6500 Under Diff Rates of Int. Adv. / "
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "16",
            TRAN_DESC: "Further Charge - When the Original Mortgage is With Possession [స్వాధీన తనఖా దస్తావేజు పై తదుపరి చార్జ్]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "17",
            TRAN_DESC: "Further Charge-Orig. Mortg is Without Possession And Possession Is Agreed to Be Given At Execution [ఆస్వాధీనతో కూడిన తనఖా దస్తావేజు పై మరింత రుణము పొందు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "18",
            TRAN_DESC: "Further Charge - Without Possession on a Simple Mortgage [తనఖా దస్తావేజు పై మీరు చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "19",
            TRAN_DESC: "Mortgage by Conditional Sale [విక్రయ షరతుతో కూడిన అస్వాధీన తనఖా]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "20",
            TRAN_DESC: "Agreement Varying the Terms Of Previously Registered Mortgage Deed [పూర్వపు అస్వాధీన తనఖాలు ఏమైనా ఒప్పోంద మార్పులు ఉంటే చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "21",
            TRAN_DESC: "Additional Security [అదనపు భద్రతతో చేసే దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "22",
            TRAN_DESC: "Substituted Security [ప్రత్యాన్మయ భద్రతా దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "02",
            TRAN_MIN_CODE: "23",
            TRAN_DESC: "Mortgage(Others) [తనఖా (ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Gift [దాన పత్రము]",
            PARTY1: "Donor",
            PARTY1_CODE: "DR",
            PARTY2: "Donee",
            PARTY2_CODE: "DE"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Gift [దాన పత్రము].",
            PARTY1: "Donor",
            PARTY1_CODE: "DR",
            PARTY2: "Donee",
            PARTY2_CODE: "DE"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Gift Settlement In f/o Family Member [కుటుంబ సభ్యులకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Gift Settlement In f/o Others [ఇతరులకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Gift Settlement For Charitable/Religious Purposes [మతధార్మిక సంస్థకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Gift Settlement In f/o Local Bodies [స్థానిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Gift In f/o Local Bodies (G.O 137) [స్థానిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Gift For Charitable Religious Purposes/God [మత, ధార్మిక సంస్థలకు దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Gift In Favour Of Government [ప్రభుత్వమునకు దాన పత్రము]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Gift Settlement Deeds In Favour Of Government [ప్రభుత్వమునకు దఖలు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Gift Of Terrace Rights [టెర్రేస్ హక్కుల దానపత్రము]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Gift Settlement Of Terrace Rights [టెర్రేస్ హక్కుల దఖలు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Gift Reserving Life Interest [జీవితకాలపు హక్కు ఉంచుకొని చేసే దాన దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "03",
            TRAN_MIN_CODE: "13",
            TRAN_DESC: "Gift Settlement Reserving Life Interest [జీవితకాలపు హక్కు ఉంచుకొని చేసే దఖలు]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Partition [భాగపంపిణి]",
            PARTY1: "Executant",
            PARTY1_CODE: "EX",
            PARTY2: "Claimant",
            PARTY2_CODE: "CL"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Partition  [భాగపంపిణి]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Partition Among Family Members [కుటుంబ సభ్యుల మధ్య జరుగు భాగ పంపిణీ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "04",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Partition executed by Court"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Release [హక్కు విడుదల]",
            PARTY1: "Releasor",
            PARTY1_CODE: "RR",
            PARTY2: "Releasee",
            PARTY2_CODE: "RE"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Release (Co-Parceners) [హక్కు విడుదల]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Release (Others) [హక్కు విడుదల(ఇతరులకు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Reconveyance Deed Executed By Govt In Fovour Of Employees [ఉద్యోగుల పేరిట ప్రభుత్వము చేయు రికన్వేయన్స్ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Reconveyance Deed(Others) [రికన్వేయన్స్ పత్రం(ఇతరులు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Receipt (R.T.D.M) [చెల్లు రశీదు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Release (Federation OR Society To Society) [ఫెడరేషన్ లేదా సొసైటి వారికి మధ్య జరిగే హక్కు విడుదల]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Release Of Life Interest [జీవిత కాలపు హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "08",
            TRAN_DESC: "Release Of Disputed Right [వివాదాస్పద హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "09",
            TRAN_DESC: "Release Of Mortgage Right"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "10",
            TRAN_DESC: "Release Of Maintenance Right By Way Of Relinquishing Right For Immovable Property [మనోవర్తి హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "11",
            TRAN_DESC: "Release(Others) [హక్కు విడుదల (ఇతరములు)]"
        },
        {
            TRAN_MAJ_CODE: "05",
            TRAN_MIN_CODE: "12",
            TRAN_DESC: "Release Among Family Members [కుటుంబ సభ్యుల మధ్య జరుగు హక్కు విడుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Exchange [పరటా, మార్పిడి దస్తావేజు]",
            PARTY1: "First Party",
            PARTY1_CODE: "FP",
            PARTY2: "Second Party",
            PARTY2_CODE: "SP"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Exchange  [పరటా, మార్పిడి దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "06",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Exchange by CRDA"
        },
         {
          TRAN_MAJ_CODE: "07",
          TRAN_MIN_CODE: "00",
          TRAN_DESC: "Lease [కౌలు]",
          PARTY1: "Lessor",
          PARTY1_CODE: "LR",
          PARTY2: "Lessee",
          PARTY2_CODE: "LE"
         },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Lease  Deed [కౌలు దస్తావేజు, అద్దె ఒప్పొంద దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Lease In Favour Of State/Central Govt. [కేంద్ర, రాష్ట్ర ప్రభుత్వములకు కౌలు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Mining Lease [గనుల అద్దె]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Salt Leases With Ground Rent [భూమి అద్దె తో కూడిన ఉప్పు ఒప్పొందము]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Transfer Of Lease [అద్దె ఒప్పంద బదిలీ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Surrender Of Lease [అద్దె ఒప్పంద రద్దు దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "07",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Lease(Others) [అద్దె ఖరారు (ఇతరములు)]"
        },
         {
          TRAN_MAJ_CODE: "08",
          TRAN_MIN_CODE: "00",
          TRAN_DESC: "Rectification/Ratification/Cancellation Deed [సవరణ/ఒప్పుదల/రద్దు పత్రము]",
          PARTY1: "Executant",
          PARTY1_CODE: "EX",
          PARTY2: "Claimant",
          PARTY2_CODE: "CL"
         },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "01",
            TRAN_DESC: "Rectification Deed [సవరణ పత్రము]"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Supplemental Deed, Ratification Deed U/S 4 Of I.S.Act [అనుబంధ ఒప్పుదల దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Cancellation Deed [రద్దు పత్రము]"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Revocation Of Gift Settlement [దాఖలు పత్రము ఉప సంహరణ]"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "Rectification deed by CRDA"
        },
                {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "06",
            TRAN_DESC: "Cancellation deed executed by Govt/ Govt. Authority"
        },
        {
            TRAN_MAJ_CODE: "08",
            TRAN_MIN_CODE: "07",
            TRAN_DESC: "Unilateral Cancellation Deed by APIIC"
        },
        
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "00",
            TRAN_DESC: "Power Of Attorney [పవర్ ఆఫ్ అటార్నీ].",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Power To Sell Immovable Property (No Value Mentioned)[పవర్ ఆఫ్ అటార్నీ]",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
        {
            TRAN_MAJ_CODE: "09",
            TRAN_MIN_CODE: "05",
            TRAN_DESC: "GPA In Favour Of  Family Members[పవర్ ఆఫ్ అటార్నీ]",
            PARTY1: "Principal",
            PARTY1_CODE: "PL",
            PARTY2: "Attorney",
            PARTY2_CODE: "AY"
        },
         {
          TRAN_MAJ_CODE: "20",
          TRAN_MIN_CODE: "00",
          TRAN_DESC: "Will [వీలునామా]",
          PARTY1: "Testator",
          PARTY1_CODE: "TR"
         },
         {
          TRAN_MAJ_CODE: "20",
          TRAN_MIN_CODE: "01",
          TRAN_DESC: "Will  [వీలునామా]",
          PARTY1: "Testator",
          PARTY1_CODE: "TR"
         },
        {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "02",
            TRAN_DESC: "Cancellation Of Will [వీలునామా రద్దు]",
            PARTY1: "Testator",
            PARTY1_CODE: "TR"
        },
        {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "03",
            TRAN_DESC: "Codicil [వీలునామా అనుబంధ దస్తావేజు]"
        },
        {
            TRAN_MAJ_CODE: "20",
            TRAN_MIN_CODE: "04",
            TRAN_DESC: "Will in Sealed Cover"
        },
        //      {
        //       TRAN_MAJ_CODE: "21",
        //       TRAN_MIN_CODE: "00",
        //       TRAN_DESC: "Authority To Adopt [దత్తత స్వీకార పత్రము]",
        //       PARTY1: "Testator",
        //       PARTY1_CODE: "TR"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "21",
        //       TRAN_MIN_CODE: "01",
        //       TRAN_DESC: "Authority To Adopt [దత్తత స్వీకార పత్రము]",
        //       PARTY1: "Testator",
        //       PARTY1_CODE: "TR"
        //      },
             {
              TRAN_MAJ_CODE: "30",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Adoption Deed [దత్త స్వీకరణ]",
              PARTY1: "Natural Parents",
              PARTY1_CODE: "NP",
              PARTY2: "Adoptive Parents",
              PARTY2_CODE: "AP"
             },
             {
              TRAN_MAJ_CODE: "30",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Adoption Deed  [దత్త స్వీకరణ]",
              PARTY1_CODE: "NP",
              PARTY2_CODE: "AP"
             },
             {
              TRAN_MAJ_CODE: "31",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Affidavit [ప్రమాణ పత్రము]",
              PARTY1: "Declarant",
              PARTY1_CODE: "DC"
             },
             {
              TRAN_MAJ_CODE: "31",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Affidavit  [ప్రమాణ పత్రము]",
              PARTY1_CODE: "DC"
             },
             {
              TRAN_MAJ_CODE: "32",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Agreement (Others) [ఒప్పందం(ఇతరులు)]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "32",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Agreement  (Others)  [ఒప్పందం (ఇతరులు)]",
              PARTY1_CODE: "EX",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "33",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Award (Not Directing Partition) [భాగపంపిణి చేసుకోవద్దని చెప్పే తీర్పు పత్రము]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX"
             },
             {
              TRAN_MAJ_CODE: "33",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Award  (Not Directing Partition)  [భాగపంపిణి చేసుకోవద్దని చెప్పే తీర్పు పత్రము]",
              PARTY1_CODE: "EX"
             },
             {
              TRAN_MAJ_CODE: "34",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Bond [పూచీ పత్రము]",
              PARTY1: "Obligor",
              PARTY1_CODE: "OR",
              PARTY2: "Obligee",
              PARTY2_CODE: "OE"
             },
             {
              TRAN_MAJ_CODE: "34",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Bond  [పూచీ పత్రము]",
              PARTY1_CODE: "OR",
              PARTY2_CODE: "OE"
             },
             {
              TRAN_MAJ_CODE: "35",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Cancellation GPA [జనరల్ పవర్ ఆఫ్ అటార్నీ రద్దు పత్రం]",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
             {
              TRAN_MAJ_CODE: "35",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Cancellation  GPA  [జనరల్ పవర్ ఆఫ్ అటార్నీ రద్దు పత్రం]",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
             {
              TRAN_MAJ_CODE: "36",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Cancellation (Others) [రద్దు పత్రము(ఇతరులు)]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "36",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Cancellation  (Others)  [రద్దు పత్రము(ఇతరులు)]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "37",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Divorce [విడాకుల పత్రము]",
              PARTY1: "Husband",
              PARTY1_CODE: "HS",
              PARTY2: "Wife",
              PARTY2_CODE: "WI"
             },
             {
              TRAN_MAJ_CODE: "37",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Divorce   [విడాకుల పత్రము]",
              PARTY1: "Husband",
              PARTY1_CODE: "HS",
              PARTY2: "Wife",
              PARTY2_CODE: "WI"
             },
             {
              TRAN_MAJ_CODE: "38",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Indemnity Bond [నష్ట పరిహార పూచీ పత్రం]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "38",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Indemnity  Bond  [నష్ట పరిహార పూచీ పత్రం]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "39",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Partnership [భాగస్వామ్యము]",
              PARTY1: "Partners",
              PARTY1_CODE: "PA"
             },
             {
              TRAN_MAJ_CODE: "39",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Partnership  [భాగస్వామ్యము]",
              PARTY1: "Partners",
              PARTY1_CODE: "PA"
             },
             {
              TRAN_MAJ_CODE: "40",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Dissolution Of Partnership [భాగస్వామ్య రద్దు]",
              PARTY1: "Partners",
              PARTY1_CODE: "PA"
             },
             {
              TRAN_MAJ_CODE: "40",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Dissolution Of  Partnership  [భాగస్వామ్య రద్దు]",
              PARTY1: "Partners",
              PARTY1_CODE: "PA"
             },
             {
              TRAN_MAJ_CODE: "41",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Power Of Attorney [పవర్ ఆఫ్ అటార్నీ]",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
             {
              TRAN_MAJ_CODE: "41",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Special Power",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
             {
              TRAN_MAJ_CODE: "41",
              TRAN_MIN_CODE: "02",
              TRAN_DESC: "General Power",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
             {
              TRAN_MAJ_CODE: "41",
              TRAN_MIN_CODE: "03",
              TRAN_DESC: "Power for Consideration",
              PARTY1: "Principal",
              PARTY1_CODE: "PL",
              PARTY2: "Attorney",
              PARTY2_CODE: "AY"
             },
        //      {
        //       TRAN_MAJ_CODE: "41",
        //       TRAN_MIN_CODE: "04",
        //       TRAN_DESC: "Power to sell Immovable Property (no value mentioned) [స్తిరాస్తి విక్రయమునకు పవర్]",
        //       PARTY1: "Principal",
        //       PARTY1_CODE: "PL",
        //       PARTY2: "Attorney",
        //       PARTY2_CODE: "AY"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "41",
        //       TRAN_MIN_CODE: "05",
        //       TRAN_DESC: "GPA In Favour Of  Family Members [కుటుంబ సభ్యులకు అనుకూలంగా GPA]"
        //      },
             {
              TRAN_MAJ_CODE: "42",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Security Bond [భద్రతా పూచీ పత్రం]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "42",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Security  Bond [భద్రతా పూచీ పత్రం]",
              PARTY1: "Executant",
              PARTY1_CODE: "EX",
              PARTY2: "Claimant",
              PARTY2_CODE: "CL"
             },
             {
              TRAN_MAJ_CODE: "43",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Trust [ట్రస్టు]",
              PARTY1: "Author/Settlor",
              PARTY1_CODE: "AR",
              PARTY2: "Trustees/Beneficiary",
              PARTY2_CODE: "TE"
             },
             {
              TRAN_MAJ_CODE: "43",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Declaration  [ప్రకటన]",
              PARTY1: "Author/Settlor",
              PARTY1_CODE: "AR",
              PARTY2: "Trustees/Beneficiary",
              PARTY2_CODE: "TE"
             },
             {
              TRAN_MAJ_CODE: "43",
              TRAN_MIN_CODE: "02",
              TRAN_DESC: "Others (Settlement) [సెటిల్మెంట్(ఇతరములు)]",
              PARTY1: "Author/Settlor",
              PARTY1_CODE: "AR",
              PARTY2: "Trustees/Beneficiary",
              PARTY2_CODE: "TE"
             },
             {
              TRAN_MAJ_CODE: "43",
              TRAN_MIN_CODE: "03",
              TRAN_DESC: "Revocation [ఉపసంహరణ/రద్దు పత్రము]",
              PARTY1: "Author/Settlor",
              PARTY1_CODE: "AR",
              PARTY2: "Trustees/Beneficiary",
              PARTY2_CODE: "TE"
             },
             {
              TRAN_MAJ_CODE: "44",
              TRAN_MIN_CODE: "00",
              TRAN_DESC: "Book 4 (Others) [బుక్ 4 దస్తావేజు (ఇతరములు)]",
              PARTY1: "First Party",
              PARTY1_CODE: "FP",
              PARTY2: "Second Party",
              PARTY2_CODE: "SP"
             },
             {
              TRAN_MAJ_CODE: "44",
              TRAN_MIN_CODE: "01",
              TRAN_DESC: "Book 4 (Others)  [బుక్ 4 దస్తావేజు (ఇతరములు)]"
             },
        //      {
        //       TRAN_MAJ_CODE: "60",
        //       TRAN_MIN_CODE: "00",
        //       TRAN_DESC: "EC / ఇ.సి"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "60",
        //       TRAN_MIN_CODE: "01",
        //       TRAN_DESC: "Encumbrance Certificate"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "60",
        //       TRAN_MIN_CODE: "02",
        //       TRAN_DESC: "Appln From PACS/Banks For Agrl Loans For Small Land Holders"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "60",
        //       TRAN_MIN_CODE: "03",
        //       TRAN_DESC: "Issued To Government Departments"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "61",
        //       TRAN_MIN_CODE: "00",
        //       TRAN_DESC: "CC [సి.సి]"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "61",
        //       TRAN_MIN_CODE: "01",
        //       TRAN_DESC: "Certified Copy"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "62",
        //       TRAN_MIN_CODE: "00",
        //       TRAN_DESC: "Hindu Marriage Act, 1955 [హిందూ వివాహ చట్టం, 1955]"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "62",
        //       TRAN_MIN_CODE: "01",
        //       TRAN_DESC: "Registration Of Hindu Marriage"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "63",
        //       TRAN_MIN_CODE: "00",
        //       TRAN_DESC: "Special Marriage Act , 1954 [ప్రత్యేక వివాహ చట్టం, 1954]"
        //      },
        //      {
        //       TRAN_MAJ_CODE: "63",
        //       TRAN_MIN_CODE: "01",
        //       TRAN_DESC: "Special Marriage Act,1954 [ప్రత్యేక వివాహ చట్టం, 1954]"
        //      }
    ]
}

export default regType;