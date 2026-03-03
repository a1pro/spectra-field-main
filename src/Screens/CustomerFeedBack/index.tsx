import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './style';
import { SpecificTicketDetailState } from '../../Redux/Slicres/ticketDetailSlicer';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import { colors } from '../../Theme/colors';
import { SignatureViewRef } from 'react-native-signature-canvas';
import { RootStackParamList, SCREENS } from '../../Navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppLoader from '../../Components/AppLoader';
import SignatureComponent from '../../Components/Signature/signature';
import { resetAllCheckLists } from '../../Redux/Slicres/checkListSlicer';
import { resetTicketDetails } from '../../Redux/Slicres/ticketDetailSlicer';
import { resetHomeScreenStore } from '../../Redux/Slicres/homeScreenSlicer';
import { resetTicketManagment } from '../../Redux/Slicres/ticketManagement';
import { postCustomerFeedbackandSignature } from '../../Services/api/feedback';
import showToast from '../../Hooks/show-toast';
import NetInfo from '@react-native-community/netinfo';
import { postAttachments } from '../../Services/api/attachments';
import {
  setOfflinePhotos,
  setCustomerRemarks,
} from '../../Redux/Slicres/ticketDetailSlicer';
import { setIsInstallerfeedbackSent } from '../../Redux/Slicres/ticketManagement';
import { postInstallerFeedbackandSignature } from '../../Services/api/feedback';
import { setPreview } from '../../Redux/Slicres/ticketDetailSlicer';
interface Props {
  text: string;
  onOK: (signature: any) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomerFeedBack = () => {
  const ref = useRef<SignatureViewRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState<string>('');
  const ticketDetails: SpecificTicketDetailState = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail,
  );
  const [mainLoading, setMainLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [call, setCall] = useState(false);

  const handleSignature = (signature: any) => {
    setSignature(signature);
  };
  const dispatch = useDispatch();
  const offlineData: any = useSelector((state: any) => state?.ticketDetails);
  const preview: any = useSelector(
    (state: any) => state?.ticketDetails?.preview,
  );
  const tokenFromStore = useSelector((state: any) => state?.authData);

  const handleSave = async () => {
    setLoading(true);
    setCall(true);
    dispatch(
      setCustomerRemarks({
        ID: ticketDetails?.activityId,
        description: description,
        name: name,
        sig: signature,
      }),
    );
  };

  useEffect(() => {
    if (offlineData?.customerRemarks.ID && call) {
      apiCalls();
    }
  }, [offlineData?.customerRemarks, call]);

  const apiCalls = async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      if (
        offlineData?.offlineimages.some((item: any) => item?.sent === false)
      ) {
        await ImageUpload();
      } else if (offlineData?.installerRemarks?.ID) {
        await postFeedbackandSignatureInstaller();
      } else {
        await postFeedbackandSignature();
      }
    } else {
      setLoading(false);
      dispatch(setPreview(true));
    }
  };

  const ImageUpload = async () => {
    const updatedOfflineImages = await Promise.all(
      offlineData?.offlineimages.map(async (item: any) => {
        if (item?.sent === false) {
          await postAttachmentToBackend(item);
          return { ...item, sent: true };
        }
        return item;
      }),
    );

    dispatch(setOfflinePhotos(updatedOfflineImages));
    offlineData?.installerRemarks?.ID
      ? postFeedbackandSignatureInstaller()
      : postFeedbackandSignature();
  };

  const postAttachmentToBackend = async (formBody: any) => {
    let formData1 = new FormData();
    formData1.append('lead_id', ticketDetails?.id);
    formData1.append('attachment', {
      uri: formBody?.uri,
      type: formBody?.fileType,
      name: formBody?.fileName,
    });

    try {
      const res: any = await postAttachments(formData1);
      console.log(
        'res in postAttachmentToBackend',
        JSON.stringify(res, null, 2),
      ); //TODO show a toast
    } catch (err) {
      console.log('err', err);
    }
  };

  const postFeedbackandSignature = async () => {
    let formData = new FormData();
    formData.append('activity_id', offlineData?.customerRemarks?.ID);
    formData.append('feedback', offlineData?.customerRemarks?.description);
    formData.append('full_name', offlineData?.customerRemarks?.name);
    formData.append('signature', {
      uri: offlineData?.customerRemarks?.sig,
      type: 'image/png',
      name: 'signature.png',
    });
    postCustomerFeedbackandSignature(formData)
      .then((res: any) => {
        showToast({
          type: 'success',
          text1: 'Success',
          text2: 'Ticket completed successfully',
        });
        setSignature('');

        console.log('res in postCustomerFeedbackandSignature', res);
        dispatch(resetTicketManagment());
        dispatch(resetHomeScreenStore());
        dispatch(resetTicketDetails());
        dispatch(resetAllCheckLists());
        setLoading(false);
        setMainLoading(false);
        navigation.navigate(SCREENS.DASHBOARD);
      })
      .catch(error => {
        setLoading(false);
        setMainLoading(false);
        console.error('Error details:', {
          message: error?.message,
          config: error?.config,
          code: error?.code,
          status: error?.response?.status,
          headers: error?.response?.headers,
        });
      });
  };

  const postFeedbackandSignatureInstaller = () => {
    let formData = new FormData();
    formData.append('activity_id', offlineData?.installerRemarks?.ID);
    formData.append('feedback', offlineData?.installerRemarks?.description);
    formData.append('full_name', offlineData?.installerRemarks?.name);
    formData.append('signature', {
      uri: offlineData?.installerRemarks?.sig,
      type: 'image/png',
      name: 'signature.png',
    });

    postInstallerFeedbackandSignature(formData)
      .then((res: any) => {
        dispatch(setIsInstallerfeedbackSent(true));
        console.log(res);
        postFeedbackandSignature();
      })
      .catch(error => {
        console.error('Error details:', {
          message: error?.message,
          config: error?.config,
          code: error?.code,
          status: error?.response?.status,
          headers: error?.response?.headers,
        });
        setLoading(false);
      });
  };

  return (
    <>
      {mainLoading && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppLoader color={colors.white} size={'large'} />
        </View>
      )}
      {preview ? (
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: colors.black,
              textAlign: 'center',
              fontSize: 13,
              marginHorizontal: 20,
              fontWeight: '600',
            }}
          >
            Job is completed but due to internet problem not synced properly,
            Sync now to continue
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.lightGreen,
              marginTop: 20,
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            onPress={async () => {
              const netInfo = await NetInfo.fetch();

              if (netInfo.isConnected) {
                setMainLoading(true);
                offlineData?.offlineimages.some(
                  (item: any) => item?.sent === false,
                )
                  ? await ImageUpload()
                  : offlineData?.installerRemarks?.ID
                  ? postFeedbackandSignatureInstaller()
                  : postFeedbackandSignature();
              } else {
                Alert.alert('Alert', 'Internet is required for syncing');
              }
            }}
          >
            <Text style={{ color: colors.white }}>Sync now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              paddingHorizontal: scale(15),
              paddingVertical: scale(15),
            }}
            scrollEnabled={false}
          >
            <Image
              source={require('../../Assets/Images/LogoSub.png')}
              style={{
                marginTop: scale(3),
                width: scale(78),
                height: scale(41),
              }}
            />
            {offlineData?.offlineimages.some(
              (item: any) => item?.sent === false,
            ) && (
              <View
                style={{
                  backgroundColor: colors.activeText,
                  padding: 7,
                  paddingHorizontal: 20,
                  marginTop: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: '500',
                    fontSize: 10,
                  }}
                >
                  Data not synced completely, Sync after completing the job
                </Text>
              </View>
            )}
            <View style={{ height: scale(340) }}>
              <View style={styles.item}>
                <View style={styles.border}>
                  <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>
                      {ticketDetails?.name}
                    </Text>
                    <Text style={styles.time}>
                      {moment(
                        ticketDetails?.activities[0]?.date_deadline,
                      ).format('DD-MM-YYYY dddd')}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />
                <Text style={styles.text}>Customer Final Remarks</Text>
                <TextInput
                  value={description}
                  placeholder="Enter Remarks"
                  onChangeText={text => setDescription(text)}
                  multiline
                  style={styles.textInput}
                  placeholderTextColor={colors.grey}
                  textAlignVertical={'top'}
                />
              </View>
            </View>

            <SignatureComponent
              ref={ref}
              onOK={handleSignature}
              onClear={() => {
                setSignature('');
                setName('');
              }}
              onEnterName={text => {
                setName(text);
              }}
              clearBtnColor={
                description === '' || signature === '' || name === ''
                  ? colors.lightGrey2
                  : colors.lightGreen
              }
              clearBtnDisabled={
                description === '' || signature === '' || name === ''
              }
              nameValue={name}
              onPressAccept={handleSave}
              onAcceptButtonLoader={loading}
              btnText={'Submit'}
            />
          </KeyboardAwareScrollView>
        </View>
      )}
    </>
  );
};

export default CustomerFeedBack;
