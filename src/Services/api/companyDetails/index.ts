import {NetWorkService} from '../../apiNetworkServices';


/**
 * Network request used to get all company details
 * @param
 * @returns status
 */

const getCompanyDetails = () => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `company/details/`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};


export {
  getCompanyDetails,
};
