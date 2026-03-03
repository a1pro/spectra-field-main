import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREENS} from './MainNavigator';
import JobDetails from '../Screens/JobDetails';
import JobProgress from '../Screens/JobProgress';
import CheckList from '../Screens/CheckList';
import FinalRemarks from '../Screens/FinalRemarks';
import Home from '../Screens/Home';
import VanCheckList from '../Screens/VanCheckList';
import FeedBack from '../Screens/FeedBack';
import Details from '../Screens/Details';
import CustomerFeedBack from '../Screens/CustomerFeedBack';
import BottomNav from './BottomNavigator';
import TicketStatus from '../Screens/TicketStatus';
import DocumentReader from '../Screens/DocumentReader';
import UploadMediaAfterTicketCompletion from '../Screens/UploadMedia';
import SurveyReader from '../Screens/SurveyReader';
import ExtraSignatureCheckList from '../Screens/ExtraCheckList';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  [SCREENS.BOTTOMNAV]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.JOBDETAILS]: any;
  [SCREENS.JOBPROGRESS]: any;
  [SCREENS.CHECKLIST]: any;
  [SCREENS.FINALREMARKS]: any;
  [SCREENS.VANCHECKLIST]: any;
  [SCREENS.FEEDBACK]: any;
  [SCREENS.DETAILS]: any;
  [SCREENS.CUSTOMERFEEDBACK]: any;
  [SCREENS.TICKETSTATUS]: any;
  [SCREENS.DOCUMENTREADER]: any;
  [SCREENS.UPLOADMEDIAAFTERTICKETCOMPLETION]: any;
  [SCREENS.SURVEYREADER]: any;
  [SCREENS.EXTRACHECKLIST]: any;
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.BOTTOMNAV}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.BOTTOMNAV} component={BottomNav} />
      <Stack.Screen name={SCREENS.JOBDETAILS} component={JobDetails} />
      <Stack.Screen name={SCREENS.JOBPROGRESS} component={JobProgress} />
      <Stack.Screen name={SCREENS.CHECKLIST} component={CheckList} />
      <Stack.Screen
        name={SCREENS.EXTRACHECKLIST}
        component={ExtraSignatureCheckList}
      />
      <Stack.Screen name={SCREENS.FINALREMARKS} component={FinalRemarks} />
      <Stack.Screen name={SCREENS.HOME} component={Home} />
      <Stack.Screen name={SCREENS.VANCHECKLIST} component={VanCheckList} />
      <Stack.Screen name={SCREENS.FEEDBACK} component={FeedBack} />
      <Stack.Screen name={SCREENS.DETAILS} component={Details} />
      <Stack.Screen name={SCREENS.TICKETSTATUS} component={TicketStatus} />
      <Stack.Screen name={SCREENS.DOCUMENTREADER} component={DocumentReader} />
      <Stack.Screen
        name={SCREENS.UPLOADMEDIAAFTERTICKETCOMPLETION}
        component={UploadMediaAfterTicketCompletion}
      />
      <Stack.Screen
        name={SCREENS.CUSTOMERFEEDBACK}
        component={CustomerFeedBack}
      />
      <Stack.Screen name={SCREENS.SURVEYREADER} component={SurveyReader} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
