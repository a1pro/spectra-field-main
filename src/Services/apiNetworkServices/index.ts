/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet } from 'react-native';
import { ParamsNetwork } from './type';


export const RESULT_CODE_PUSH_OUT = 401;
const TIME_OUT = 20000;

import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseBase } from './type';

import {
  controller,
  handleErrorAxios,
  handleParameter,
  handleResponseAxios,
} from './helper';
import { getItem } from '../storage';

const AxiosInstance = Axios.create({});

// AxiosInstance.interceptors.response.use(
//   (response) => response,
//   async function (error) {
//     const originalRequest = error.config;
//     if (
//       error &&
//       error.response &&
//       (error.response.status === 403 || error.response.status === 401) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       // let user = firebaseAuth().currentUser;
//       // if (user) {
//       //   user?.getIdToken(true).then((token: string) => {
//       //     // setUserToken(token);
//       //     originalRequest.headers = {
//       //       authorization: "Bearer " + token ?? "",
//       //     };
//       //     return AxiosInstance(originalRequest);
//       //   });
//       // }
//     }
//     return Promise.reject(error);
//   }
// );

// base
async function Request<T = Record<string, unknown>>(config: ParamsNetwork) {
  const token = await getItem('Token');
  let headers = {
    'Content-Type': 'application/json',
    authorization: 'Bearer ' + token ?? '',
  };

  const defaultConfig: AxiosRequestConfig = {
    // baseURL: 'https://crm.spectrasolar.co.uk/api/',
    baseURL: 'https://customer.spectrasolar.co.uk/api/',
    timeout: TIME_OUT,
    timeoutErrorMessage: 'Request Timeout',
    headers: headers,
  };

  return new Promise<ResponseBase<T> | null>((rs, reject) => {
    AxiosInstance.request(
      StyleSheet.flatten([
        defaultConfig,
        config,
        { signal: config?.controller?.signal || controller.current?.signal },
      ]),
    )
      .then((res: AxiosResponse<T>) => {
        const result = handleResponseAxios(res);

        rs(result);
      })
      .catch((error: AxiosError<T>) => {
        if (error?.code === 'ECONNABORTED') {
          reject(error?.code);
          let result = {
            code: error?.response?.status,
            isSuccess: false,
            message: error?.message,
          };

          rs(result as ResponseBase<T>);
          return;
        }

        console.log('error in Request', JSON.stringify(error, null, 2));

        let result = {
          code: error?.response?.status,
          isSuccess: false,
          message: error?.message,
        };

        rs(result as ResponseBase<T>);
      });
  });
}

// get
async function Get<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'GET'));
}

// post
async function Post<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'POST'));
}

type ParameterPostFormData = AxiosRequestConfig & ParamsNetwork;
// post FormData
async function PostFormData<T>(params: ParamsNetwork) {
  const token = await getItem('Token');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  console.log(token);
  const headers: AxiosRequestConfig['headers'] = {
    authorization: 'Bearer ' + token ?? '',
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  };

  return Request<T>(
    handleParameter<ParameterPostFormData>({ ...params, headers }, 'POST'),
  );
}

// put
async function Put<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'PUT'));
}

// patch
async function Patch<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'PATCH'));
}

// delete
async function Delete<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'DELETE'));
}
export type NetWorkResponseType<T> = (
  params: ParamsNetwork,
) => Promise<ResponseBase<T> | null>;

export const NetWorkService = {
  Get,
  Post,
  Put,
  Delete,
  PostFormData,
  Request,
  Patch,
};
