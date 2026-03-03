import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type LOCATIONBODY = {
  activity_id: string;
  longitude: string;
  latitude: string;
};

/**
 * Network request used to set location every  3 minutes
 * @param user_id is current logged in user's ID
 * @param longitude is user's current longitude
 * @param latitude is user's current latitude
 * @returns success
 */

const sendLocationCordinates = (body: LOCATIONBODY) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: getRoute('location'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {sendLocationCordinates};
