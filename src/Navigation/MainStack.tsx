import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREENS} from './MainNavigator';
import JobDetails from '../Screens/JobDetails';
import JobProgress from '../Screens/JobProgress';
import CheckList from '../Screens/CheckList';
import FinalRemarks from '../Screens/FinalRemarks';
import Home from '../Screens/Home';
import FeedBack from '../Screens/FeedBack';
import Details from '../Screens/Details';
import CustomerFeedBack from '../Screens/CustomerFeedBack';
import DashBoard from '../Screens/DashBoard';
import TicketStatus from '../Screens/TicketStatus';
import VanCheckList from '../Screens/VanCheckList';
import UploadMediaAfterTicketCompletion from '../Screens/UploadMedia';
import ExtraSignatureCheckList from '../Screens/ExtraCheckList';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  [SCREENS.DASHBOARD]: any;
  [SCREENS.HOME]: undefined;
  [SCREENS.JOBDETAILS]: any;
  [SCREENS.JOBPROGRESS]: any;
  [SCREENS.CHECKLIST]: any;
  [SCREENS.FINALREMARKS]: any;
  [SCREENS.FEEDBACK]: any;
  [SCREENS.DETAILS]: any;
  [SCREENS.CUSTOMERFEEDBACK]: any;
  [SCREENS.TICKETSTATUS]: any;
  [SCREENS.VANCHECKLIST]: any;
  [SCREENS.UPLOADMEDIAAFTERTICKETCOMPLETION]: any;
  [SCREENS.EXTRACHECKLIST]: any;
};

export const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.DASHBOARD}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.DASHBOARD} component={DashBoard} />
      <Stack.Screen name={SCREENS.JOBDETAILS} component={JobDetails} />
      <Stack.Screen name={SCREENS.JOBPROGRESS} component={JobProgress} />
      <Stack.Screen name={SCREENS.CHECKLIST} component={CheckList} />
      <Stack.Screen name={SCREENS.FINALREMARKS} component={FinalRemarks} />
      <Stack.Screen name={SCREENS.HOME} component={Home} />
      <Stack.Screen name={SCREENS.FEEDBACK} component={FeedBack} />
      <Stack.Screen name={SCREENS.DETAILS} component={Details} />
      <Stack.Screen name={SCREENS.TICKETSTATUS} component={TicketStatus} />
      <Stack.Screen name={SCREENS.VANCHECKLIST} component={VanCheckList} />
      <Stack.Screen
        name={SCREENS.CUSTOMERFEEDBACK}
        component={CustomerFeedBack}
      />
      <Stack.Screen
        name={SCREENS.UPLOADMEDIAAFTERTICKETCOMPLETION}
        component={UploadMediaAfterTicketCompletion}
      />
      <Stack.Screen
        name={SCREENS.EXTRACHECKLIST}
        component={ExtraSignatureCheckList}
      />
      
    </Stack.Navigator>
  );
};

export default MainStack;
