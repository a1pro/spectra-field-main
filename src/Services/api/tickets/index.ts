import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

export type ASSIGNTICKETBODY = {
  user_id: string;
  ticket_id: string;
};

export type LOCATION = {
  longitude: number;
  latitude: number;
  activity_id?: number;
};

export type TICKET = {
  startDate: string;
  endDate: string;
};
/**
 * Network request used to get all tickets
 * @returns ticket list
 */

const getAllTickets = (body?: TICKET) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      // url: `leads?create_date=${body?.startDate}&end_date=${body?.endDate}`,
      url: `leads?&end_date=${body?.endDate}`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to Assign specific ticket
 * @param user_id is current logged in user's ID
 * @param ticket_id is selected ticket
 * @returns success
 */

const assignTicket = (body: ASSIGNTICKETBODY) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: getRoute('assignTicket'),
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to get specific ticket details with id
 * @returns deatil object
 */

const getTicketDetails = (id: number) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: `leads/details?lead_id=${id}`,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to get specific ticket details with id
 * @param ticket_id this will be respective ticket id
 * @param image that will be signature image
 * @returns deatil object
 */

const completeTicket = (id: number) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Get({
      url: getRoute('ticketCompletion'),
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to cancel in progress ticket with id
 * @param lead_id this will be respective lead id
 * @returns success
 */

const cancelTicket = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.PostFormData({
      url: `crm/lead_cancellation`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const postLocation = (body: LOCATION) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: `user/location`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

/**
 * Network request used to change ticket status with id
 * @returns deatil object
 */

const updateTicketStatus = (body: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url: `start-activity`,
      body,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {
  getAllTickets,
  assignTicket,
  getTicketDetails,
  postLocation,
  completeTicket,
  cancelTicket,
  updateTicketStatus,
};
