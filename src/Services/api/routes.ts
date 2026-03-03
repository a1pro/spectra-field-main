
type RouteKeys =
  | 'login'
  | 'tickets'
  | 'location'
  | 'assignTicket'
  | 'ticketDetails'
  | 'vanChecklist'
  | 'feedback'
  | 'attachment'
  | 'ticketCompletion'
  | 'documents'
  | 'customerFeedback'
  | 'signedAttachment'
  | 'emailToBackend'
  | 'otpToBackend'
  | 'resetpassword'


// Define the ROUTES object with proper typing
const ROUTES: Record<RouteKeys, string> = {
  login: `auth/token/`,
  tickets: `tickets`,
  location: `user/location`,
  assignTicket: `helpdesk/tickets/assign/`,
  ticketDetails: `tickets/details`,
  vanChecklist: `van_checklist`,
  feedback: `crm/lead/van-feedback/`,
  attachment: `lead/attachment`,
  ticketCompletion: `helpdesk/tickets_completion/`,
  documents: `documents/`,
  customerFeedback: `crm/lead/customer-feedback/`,
  signedAttachment: `ticket/signed-document`,
  emailToBackend: `request_password_reset/`,
  otpToBackend: `verify_otp/`,
  resetpassword: `reset_password`


};

// Define the getRoute function with proper typing
export const getRoute = (routeKey: RouteKeys): string => ROUTES[routeKey];
