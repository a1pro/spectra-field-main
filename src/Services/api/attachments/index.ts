import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type ATTACHMENT = {
  ticket_id: number;
  attachment: any;
};
/**
 * Network request used to send feeback and signature to backend
 * @param ticket_id is respective ticket∆ id
 * @param attachment is attachment png file
 * @returns success object
 */

const postAttachments = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: getRoute('attachment'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const postSignedAttachments = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: getRoute('signedAttachment'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to get media attachments associated with respective ongoing ticket/task
 * @returns success object with media files
 */

const getMediaAttachments = (ticket_id: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `lead/attachments/${ticket_id}`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {postAttachments, getMediaAttachments , postSignedAttachments};
