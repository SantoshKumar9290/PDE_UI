import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import OTPPage from './OTPPage';
import RegistrationSuccessPage from './RegistrationSuccessPage';
import ServicesPage from './ServicesPage';
import PartiesDetails from './PartiesDetailsPage';
import ApplicationList from './ApplicationListPage';
import Reports from './ReportsPage';
import FinishDocument from './FinishDocumentPage';
import SlotBooking from './SlotBookingPage';
import GetstartedPage from './Getstartedpage';
// import ExecutantViewDetails from './ExecutantViewDetailsPage';
// import ExecutantUpdateDetails from './ExecutantUpdateDetailsPage';
import SlotBookingViewPage from './SlotBookingViewPage';
import PropertyDetailsPage from './PropertyDetailsPage';
import PropertyDetailsPage_B from './PropertyDetailsPage_U';
import ReportsViewPage from './ReportsViewPage';
import FinishDcumentViewPage from './FinishDocumentViewPage';
import FinishDocumentSuccessPage from './FinishDocumentSuccessPage';
import ForgetPasswordPage from './ForgetPasswordPage';
import MianPage from './MainPage';
import AddRelationDetailsPage from './AddRelationDetailsPage';
import PaymentDetailsPage from './PaymentDetailsPage';
import SubmissionSuccessfulPage from './SubmissionSuccessfulPage';
import FileuploadPage from './FileuploadPage';





const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>PDE</title>
        <link rel="icon" href="/PDE/images/APlogo.ico" type="image/x-icon" className={styles.feviconImg} />
		<meta http-equiv="X-Frame-Options" content="sameorigin"/>
      </Head>
       <LoginPage/>   
       {/* <SubmissionSuccessfulPage/> */}
       {/* <PartiesDetails /> */}
       {/* <GetstartedPage /> */}
       {/* <ExecutantViewDetails/> */}
       {/* <ExecutantUpdateDetails /> */}
       {/* <SlotBookingViewPage /> */}
       {/* <PropertyDetailsPage /> */}
       {/* <PropertyDetailsPage_B /> */}
        {/* <ReportsViewPage /> */}
        {/* <FinishDcumentViewPage />
        <FinishDocumentSuccessPage /> */}
        {/* <ForgetPasswordPage /> */}
        {/* <MianPage /> */}
        {/* <AddRelationDetailsPage /> */}
        {/* <PaymentDetailsPage /> */}
        {/* <FileuploadPage /> */}
    </div>
  )
}

export default Home
