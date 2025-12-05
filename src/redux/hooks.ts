import {useSelector, useDispatch,TypedUseSelectorHook} from 'react-redux';
import {
    LoadingAction,
    PopupAction,
    SetEncumbranceData,
    SetGeneratedDetails,
    SetPropertyDetails,
  } from "./commonSlice";
  import { AppDispatch, RootState, store } from "./store";
  
  export const Loading = (value: boolean) => {
    store.dispatch(LoadingAction({ enable: value }));
  };
  
  export const SaveEncumbranceData = (value: any) => {
    store.dispatch(SetEncumbranceData(value));
  };
  
  export const SaveGeneratedDetails = (value: any) => {
    store.dispatch(SetGeneratedDetails(value));
  };
  
  export const SavePropertyDetails = (value: any) => {
    store.dispatch(SetPropertyDetails(value));
  };
  
  export const ShowMessagePopup = (
    type: boolean,
    message: string,
    redirectOnSuccess: string
  ) => {
    store.dispatch(
      PopupAction({
        enable: true,
        type: type,
        message: message,
        redirectOnSuccess,
      })
    );
  };

export const useAppSelector: TypedUseSelectorHook<RootState> =  useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

