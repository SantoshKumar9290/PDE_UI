import '../styles/globals.scss';
import '../styles/colors.scss';
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from '../src/components/Header';
import Footer from '../src/components/Footer';
import { store } from '../src/redux/store';
import PopupAlert from '../src/components/PopupAlert';
import { Provider } from 'react-redux';
import AadharPopup from '../src/components/AadharPopup';
import DeletePopup from '../src/components/DeletePopup';
import Loader from '../src/components/Loader';
import {SetUp} from '../src/redux/setUpInterceptors';
import PaymentModal from '../src/components/PaymentModal';
import PreviewDocBtn from '../src/components/PreviewDocBtn';
import GooglemapService from '../src/components/googlemapService';

function MyApp({ Component, pageProps }: AppProps) {

  const handleKeyDown = (event: any) => {
    let Loading = store.getState().common.Loading.enable;
    console.log(event.key);
    console.log(Loading);
    if (event.key === 'Tab' && Loading == true) {
      event.preventDefault();
    }
  }

  return (
    <Provider store={store}>

      <div onKeyDown={handleKeyDown} className='MainContent ecMainContent'>
        <Loader />
        <PopupAlert />
        <PopupAlert />
        <PreviewDocBtn />
        <DeletePopup />
        <AadharPopup />
        <GooglemapService />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>

    </Provider>
  )

}
SetUp();
export default MyApp
