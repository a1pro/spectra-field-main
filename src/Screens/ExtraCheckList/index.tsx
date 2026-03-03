import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { RootStackParamList, SCREENS } from '../../Navigation/MainNavigator';
import {
  getCheckList,
  postHSCheckList,
  postHSSignature,
} from '../../Services/api/checklist';
import {
  resetAllCheckLists,
  setHSCheckList,
  setSignaturesInStore,
} from '../../Redux/Slicres/checkListSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SpecificTicketDetailState } from '../../Redux/Slicres/ticketDetailSlicer';
import moment from 'moment';
import AppLoader from '../../Components/AppLoader';
import { colors } from '../../Theme/colors';
import { setIsHSCheck } from '../../Redux/Slicres/ticketManagement';
import { scale } from 'react-native-size-matters';
import SignatureComponent from '../../Components/Signature/signature';
import { SignatureViewRef } from 'react-native-signature-canvas';
import showToast from '../../Hooks/show-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ITEM = {
  id: number;
  is_checked: boolean;
};

const ExtraSignatureCheckList = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const hsChecklist = useSelector(
    (state: any) => state?.checkList?.hsChecklist,
  );
  const signatureFromStore = useSelector(
    (state: any) => state?.checkList?.signatures,
  );
  const ticketDetails: SpecificTicketDetailState = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail,
  );
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');

  const ref = useRef<SignatureViewRef>(null);

  const handleSignature = (signature: any) => {
    setSignature(signature);
  };
  useEffect(() => {
    getCheckList(ticketDetails?.activityId)
      .then((res: any) => {
        if (res?.data) {
          const newArray = Object.keys(res?.data?.hs_checklist)?.map(
            (key: any) => {
              return {
                id: parseInt(key, 10),
                name: res?.data?.hs_checklist[key].name,
                is_checked: res?.data?.hs_checklist[key].is_checked,
              };
            },
          );
          dispatch(setHSCheckList(newArray));
        } else {
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetAllCheckLists());
    };
  }, []);

  const postCheckList = () => {
    setLoading(true);
    const checklists = hsChecklist
      ?.filter((item: any) => item.is_checked)
      .map(({ id, is_checked }: ITEM) => ({ id, is_checked }));

    if (checklists?.length !== hsChecklist?.length) {
      setLoading(false);
      showToast({
        type: 'error',
        text1: 'Warning',
        text2: 'Please check all items',
      });
      return;
    }
    signatureFromStore.forEach((item: any) => {
      let formData = new FormData();
      formData.append('activity_id', ticketDetails?.activityId);
      formData.append('checklists', JSON.stringify(checklists));
      formData.append('full_name', JSON.stringify(item?.personName));
      formData.append('signature', {
        uri: item?.uri,
        type: item?.type,
        name: item?.name,
      });
      postHSSignature(formData)
        .then((res: any) => {
          postHSCheckList(formData)
            .then((res: any) => {
              if (res?.data) {
                showToast({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Checklist added successfully',
                });
                setLoading(false);
                setSignature('');
                dispatch(setIsHSCheck(true));
                navigation.navigate(SCREENS.DETAILS, { data: ticketDetails });
              } else {
                showToast({
                  type: 'error',
                  text1: 'Warning',
                  text2: 'Something Went Wrong',
                });
                navigation.navigate(SCREENS.DASHBOARD);
              }
            })
            .catch((err: any) => {
              setLoading(false);
              console.log('err in postHSCheckList', err);
            });
        })
        .catch((err: any) => {
          setLoading(false);
          console.log('err', err);
        });
    });
  };

  const handleCheckbox = (item: any) => {
    item.item.is_checked = !item?.item?.is_checked;
    dispatch(
      setHSCheckList(
        hsChecklist?.map((prevItem: { id: any }) =>
          prevItem.id === item.item.id
            ? { ...prevItem, is_checked: !item.item.is_checked }
            : prevItem,
        ),
      ),
    );
  };

  const onPressAnotherSignature = () => {
    let updatedSign = {
      uri: signature,
      type: 'image/png',
      name: `signature.png`,
      personName: name,
    };
    dispatch(setSignaturesInStore(updatedSign));
    ref.current?.clearSignature();
    setSignature('');
    setName('');
  };

  const renderItemVerticle = (item: any) => {
    return (
      <View style={styles.itemContainerVerticle}>
        <View
          style={{
            transform: [{ scale: 0.6 }],
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: colors.lightGreen,
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor:
              item?.item?.is_checked === true
                ? colors.lightGreen
                : 'transparent',
          }}
        >
          <Checkbox
            status={item?.item?.is_checked === true ? 'checked' : 'unchecked'}
            onPress={() => handleCheckbox(item)}
            color={colors.white}
            uncheckedColor="transparent"
          />
        </View>
        <View style={{ width: scale(220) }}>
          <Text style={styles.label} numberOfLines={4}>
            {item?.item?.name}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.noItem}>
        <Text style={styles.label} numberOfLines={1}>
          No Item found
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <Image
        source={require('../../Assets/Images/Logo.png')}
        style={styles.img}
      />
      <View style={styles.item}>
        <View style={styles.border}>
          <View style={styles.row}>
            <Text style={styles.name}>{ticketDetails?.name}</Text>
            <Text style={styles.time}>
              {moment(ticketDetails?.activities[0]?.date_deadline).format(
                'DD-MM-YYYY dddd',
              )}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
        }}
      >
        <Image
          source={require('../../Assets/Images/van.png')}
          style={{ marginRight: 5 }}
        />
        <Text style={{ color: colors.black, marginVertical: 5 }}>
          Health and Security Checklist
        </Text>
      </View>

      <ScrollView
        style={{ marginTop: 10, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={hsChecklist}
          renderItem={renderItemVerticle}
          keyExtractor={index => index?.toString()}
          ListEmptyComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 10 }}
        />
      </ScrollView>

      <View style={styles.acceptView}>
        <SignatureComponent
          ref={ref}
          onOK={handleSignature}
          onClear={() => {
            Keyboard.dismiss();
            setSignature('');
            setName('');
          }}
          onEnterName={text => {
            setName(text);
          }}
          clearBtnColor={
            signature.trim() !== '' && name.trim() !== ''
              ? colors.black
              : colors.lightGrey
          }
          clearBtnDisabled={signature === '' || name === ''}
          nameValue={name}
          onPressAccept={onPressAnotherSignature}
          onAcceptButtonLoader={false}
          btnText={'Save Signature'}
        />

        <TouchableOpacity
          disabled={signatureFromStore?.length === 0}
          onPress={postCheckList}
          style={[
            styles.signBtn,
            {
              backgroundColor:
                signatureFromStore?.length !== 0
                  ? colors.lightGreen
                  : colors.lightGrey,
            },
          ]}
        >
          {loading ? (
            <AppLoader
              color={colors.white}
              style={{ paddingVertical: scale(2) }}
            />
          ) : (
            <Text style={styles.signText}>Complete</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ExtraSignatureCheckList;
