import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type FEED = {
  activity_id: number;
  feedback: string;
  signature: any;
};
/**
 * Network request used to send feeback and signature to backend
 * @param activity_id is in progress activiyId
 * @param feedback is feedback string by user
 * @param signature is signature png file
 * @returns success object
 */

const postInstallerFeedbackandSignature = (body: FEED) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: getRoute('feedback'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to send feeback and signature to backend
 * @param activity_id is in progress activiyId
 * @param feedback is feedback string by user
 * @param signature is customer's signature png file
 * @returns success object
 */

const postCustomerFeedbackandSignature = (body: FEED) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: getRoute('customerFeedback'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {postInstallerFeedbackandSignature, postCustomerFeedbackandSignature};
