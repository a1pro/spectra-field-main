import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type HSCHECKLIST = {
  id: number;
  is_checked: boolean;
};
export type INITIALHSCHECKLIST = {
  ticket_id?: number;
  checklists: HSCHECKLIST[];
  signature: any;
};

export type FEED = {
  ticket_id: number;
  feedback: string;
};
/**
 * Network request used to get all checklist items
 * @param
 * @returns success object
 */

const getCheckList = (id: number) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `crm/lead/hs-checklist/${id}`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to get van checklist items
 * @param
 * @returns success object
 */

const getVanCheckList = () => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `get-user-van-checklist/`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to get van checklist status whether it's submitted in last 7 days or not
 * @param
 * @returns status
 */

const confirmVanChecklistStatus = () => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `van-checklist/status/`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const postHSSignature = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: `crm/lead/hs-checklist/update/`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const postHSCheckList = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: `crm/lead/hs-checklist/add-signature/`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const postVanCheckList = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: `van-checklist/create/`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {
  getCheckList,
  postHSCheckList,
  getVanCheckList,
  postVanCheckList,
  confirmVanChecklistStatus,
  postHSSignature,
};
