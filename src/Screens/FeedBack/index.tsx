import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './style';
import {
  setFinalRemarks,
  SpecificTicketDetailState,
} from '../../Redux/Slicres/ticketDetailSlicer';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import { colors } from '../../Theme/colors';
import { RootStackParamList, SCREENS } from '../../Navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppLoader from '../../Components/AppLoader';
import SignatureComponent from '../../Components/Signature/signature';
import { SignatureViewRef } from 'react-native-signature-canvas';
import { postInstallerFeedbackandSignature } from '../../Services/api/feedback';
import { setIsInstallerfeedbackSent } from '../../Redux/Slicres/ticketManagement';
import NetInfo from '@react-native-community/netinfo';
import {
  setOfflinePhotos,
  setInstallerRemarks,
} from '../../Redux/Slicres/ticketDetailSlicer';
import { postAttachments } from '../../Services/api/attachments';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FeedBack = () => {
  const ref = useRef<SignatureViewRef>(null);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');
  const ticketDetails: SpecificTicketDetailState = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail,
  );
  const offlineData: any = useSelector((state: any) => state?.ticketDetails);

  const handleSignature = (signature: any) => {
    setSignature(signature);
  };

  const handleSave = async () => {
    setLoading(true);
    const netInfo = await NetInfo.fetch();
    let formData = new FormData();
    formData.append('activity_id', JSON.stringify(ticketDetails?.activityId));
    formData.append('feedback', JSON.stringify(description));
    formData.append('full_name', JSON.stringify(name));
    formData.append('signature', {
      uri: signature,
      type: 'image/png',
      name: 'signature.png',
    });

    if (netInfo.isConnected) {
      postFeedbackandSignature(formData);
    } else {
      dispatch(
        setInstallerRemarks({
          ID: ticketDetails?.activityId,
          description: description,
          name: name,
          sig: signature,
        }),
      );
      dispatch(setFinalRemarks([formData]));
      setLoading(false);
      dispatch(setIsInstallerfeedbackSent(true));
      navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
    }
  };

  const postFeedbackandSignature = async (body: any) => {
    postInstallerFeedbackandSignature(body)
      .then((res: any) => {
        setLoading(false);
        setName('');
        setSignature('');
        dispatch(setIsInstallerfeedbackSent(true));
        console.log(res);
        navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
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
    <View style={styles.container}>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: scale(15),
          paddingVertical: scale(15),
        }}
      >
        <Image
          source={require('../../Assets/Images/LogoSub.png')}
          style={{ marginTop: scale(3), width: scale(78), height: scale(41) }}
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
              style={{ color: colors.white, fontWeight: '500', fontSize: 10 }}
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
                  {moment(ticketDetails?.activities[0]?.date_deadline).format(
                    'DD-MM-YYYY dddd',
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.text}>Final Installer Remarks</Text>
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
  );
};

export default FeedBack;
