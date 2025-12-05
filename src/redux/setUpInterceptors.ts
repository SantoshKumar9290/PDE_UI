import instance from './api';
import ecinstance from './api-ec';
import { get } from "lodash";
import { ShowMessagePopup } from '../GenericFunctions';

export const SetUp = () => {

    instance.interceptors.request.use(
        function (config) {
            const data = localStorage.getItem("LoginDetails");
            let parsedData;
            try {
                parsedData = JSON.parse(data);
                if (parsedData && parsedData.token) {
                    config.headers ["Authorization"] = 'Bearer ' + parsedData.token;
                    // config.headers ["X-Frame-Options"] = "DENY";
                  
                }
                // console.log(config);
                if(config.url.includes("documents/uplods/")){
                    config.headers["Content-Type"] = "multipart/form-data";
                }
            } catch { parsedData = false; }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(async (response) => {
        return response;
    }, async (error) => {
        const originalConfig = error.config;
        if (error && error.response && error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                const g = localStorage.getItem("LoginDetails");
                let parsedData;
                try {
                    parsedData = JSON.parse(g);
                    if (parsedData && parsedData.token) {
                        const rs = await instance.get('/users/token/');

                        if (get(rs, 'data.data.token', '')) {
                            parsedData.token = rs.data.data.token;
                            localStorage.setItem("LoginDetails", JSON.stringify(parsedData));
                            return instance(originalConfig)
                        }
                        else {
                            // console.log('token not found');
                            // localStorage.clear();
                            ShowMessagePopup(false, "Session Expired", "/");
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 0)
                        }
                    } else {
                        // console.log('token not found');
                        // localStorage.clear();
                        ShowMessagePopup(false, "Session Expired", "/");

                        // setTimeout(() => {
                        //     window.location.href = "/";
                        // }, 0)

                    }
                } catch (_error1) {
                    // console.log(' refresh token api failed')
                    // localStorage.clear();
                    ShowMessagePopup(false, 'Refresh Token Failed', "/");
                    // setTimeout(() => {window.location.href = "/";}, 0)
                    return Promise.reject(_error1);
                }
                // const rs = await instance.get(`/`)
                // const rs = await instance.get(`/token/${auth.getUserDetails().loginId}`);
                //     if(get(rs, 'data.data.token.token', '')){
                //         localStorage.setItem("access_token", get(rs, 'data.data.token.token', ''))
                //         return instance(originalConfig);
                //       }
                //       else{
                //         localStorage.clear();
                // setTimeout(() => {
                //     window.location.href = "/"
                // }, 0)
                //       }
            } catch (_error) {
                // console.log(' error exception')
                localStorage.clear();
                setTimeout(() => { window.location.href = "/"; }, 0)
                return Promise.reject(_error);
            }
        }
        else if (error.response.status === 401) {
            // console.log(' refresh token 2nd time failed')
            ShowMessagePopup(false, 'Refresh Token Failed.', "/");
            // localStorage.clear();
            setTimeout(() => { window.location.href = "/"; }, 0)
        }
        return Promise.reject(error);
    });

    ecinstance.interceptors.request.use(
        function (config) {
            const data = localStorage.getItem("LoginDetails");
            let parsedData;
            try {
                parsedData = JSON.parse(data);
                if (parsedData && parsedData.token) {
                    config.headers ["Authorization"] = 'Bearer ' + parsedData.token;
                    // config.headers ["X-Frame-Options"] = "DENY";
                  
                }
                // console.log(config);
                if(config.url.includes("documents/uplods/")){
                    config.headers["Content-Type"] = "multipart/form-data";
                }
            } catch { parsedData = false; }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    ecinstance.interceptors.response.use(async (response) => {
        return response;
    }, async (error) => {
        const originalConfig = error.config;
        if (error && error.response && error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                const g = localStorage.getItem("LoginDetails");
                let parsedData;
                try {
                    parsedData = JSON.parse(g);
                    if (parsedData && parsedData.token) {
                        const rs = await instance.get('/users/token/');

                        if (get(rs, 'data.data.token', '')) {
                            parsedData.token = rs.data.data.token;
                            localStorage.setItem("LoginDetails", JSON.stringify(parsedData));
                            return instance(originalConfig)
                        }
                        else {
                            // console.log('token not found');
                            // localStorage.clear();
                            ShowMessagePopup(false, "Session Expired", "/");
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 0)
                        }
                    } else {
                        // console.log('token not found');
                        // localStorage.clear();
                        ShowMessagePopup(false, "Session Expired", "/");

                        // setTimeout(() => {
                        //     window.location.href = "/";
                        // }, 0)

                    }
                } catch (_error1) {
                    // console.log(' refresh token api failed')
                    // localStorage.clear();
                    ShowMessagePopup(false, 'Refresh Token Failed', "/");
                    // setTimeout(() => {window.location.href = "/";}, 0)
                    return Promise.reject(_error1);
                }
                // const rs = await instance.get(`/`)
                // const rs = await instance.get(`/token/${auth.getUserDetails().loginId}`);
                //     if(get(rs, 'data.data.token.token', '')){
                //         localStorage.setItem("access_token", get(rs, 'data.data.token.token', ''))
                //         return instance(originalConfig);
                //       }
                //       else{
                //         localStorage.clear();
                // setTimeout(() => {
                //     window.location.href = "/"
                // }, 0)
                //       }
            } catch (_error) {
                // console.log(' error exception')
                localStorage.clear();
                setTimeout(() => { window.location.href = "/"; }, 0)
                return Promise.reject(_error);
            }
        }
        else if (error.response.status === 401) {
            // console.log(' refresh token 2nd time failed')
            ShowMessagePopup(false, 'Refresh Token Failed.', "/");
            // localStorage.clear();
            setTimeout(() => { window.location.href = "/"; }, 0)
        }
        return Promise.reject(error);
    });

}
