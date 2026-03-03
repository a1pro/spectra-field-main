import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type Body = {
  login: string;
  password: string;
};

export type EmailBody = {
  email: any;
};

export type OTPBody = {
  OTP: number;
};

export type RESETBody = {
  email: string,
  new_password: string
};
  

/**
 * Network request used to login user
 * @param login is userName
 * @param password
 * @returns
 */

const loginUser = (body: Body) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: getRoute('login'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to resetPassword 
 * @param email is user email
 * @param new_password new password
 * @returns
 */

const resetPassword = (body: RESETBody) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: getRoute('resetpassword'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};


/**
 * Network request used to send email in case of forgotten email
 * @param email is email where otp is to be sent
 * @returns success
 */

const sendEmailToBackend = (body: EmailBody) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: getRoute('emailToBackend'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to send email in case of forgotten email
 * @param OTP is verification code
 * @returns success or failure
 */

const verifyOTP = (body: OTPBody) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: getRoute('otpToBackend'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to logout user
 * @param data to update.
 * @returns
 */
const logoutUser = () => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: ``,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {logoutUser, loginUser, sendEmailToBackend, verifyOTP, resetPassword};
