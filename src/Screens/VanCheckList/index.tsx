import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {RootStackParamList, SCREENS} from '../../Navigation/MainNavigator';
import {getVanCheckList, postVanCheckList} from '../../Services/api/checklist';
import {setVanCheckList} from '../../Redux/Slicres/checkListSlicer';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './style';
import {useNavigation} from '@react-navigation/native';
import AppLoader from '../../Components/AppLoader';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../Theme/colors';
import {setIsVANCheck} from '../../Redux/Slicres/ticketManagement';
import {scale} from 'react-native-size-matters';
import SignatureComponent from '../../Components/Signature/signature';
import {SignatureViewRef} from 'react-native-signature-canvas';
import showToast from '../../Hooks/show-toast';
import NetInfo from '@react-native-community/netinfo';

type ITEM = {
  id: number;
  is_checked: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const VanCheckList = () => {
  const dispatch = useDispatch();
  const vanCheckist = useSelector((state: any) => state.checkList?.vanCheckist);
  const navigation = useNavigation<NavigationProp>();

  const [signature, setSignature] = useState('');

  const ref = useRef<SignatureViewRef>(null);
  const handleSignature = (signature: any) => {
    setSignature(signature);
  };
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false); //TODO keep it in sotre
  const [name, setName] = useState('');

  useEffect(() => {
    setListLoading(true);

    const Function = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        getVanCheckList()
          .then((res: any) => {
            setListLoading(false);
            if (Array.isArray(res?.data)) {
              dispatch(setVanCheckList(res?.data));
            }
          })
          .catch((err: any) => {
            setListLoading(false);
          });
      } else {
        Alert.alert('Warning', 'Need internet connection to continue');
        setListLoading(false);
      }
    };
    Function();
  }, []);

  const postCheckList = async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      setLoading(true);
      const checklists = vanCheckist
        ?.filter((item: any) => item.is_checked)
        .map(({id, is_checked}: ITEM) => ({id, is_checked}));
      // if (checklists?.length !== vanCheckist?.length) {
      //   setLoading(false);
      //   showToast({
      //     type: 'error',
      //     text1: 'Warning',
      //     text2: 'Please check all items',
      //   });
      //   return;
      // }
      let formData = new FormData();
      formData.append('checklist_items', JSON.stringify(checklists));
      formData.append('full_name', JSON.stringify(name));
      formData.append('signature', {
        uri: signature,
        type: 'image/png',
        name: 'signature.png',
      });
      postVanCheckList(formData)
        .then((response: any) => {
          if (response?.data) {
            setLoading(false);
            showToast({
              type: 'success',
              text1: 'Success',
              text2: 'Checklist submitted successfully',
            });
            setName('');
            setSignature('');
            dispatch(setIsVANCheck(true));
            navigation.navigate(SCREENS.DASHBOARD);
          } else {
            showToast({
              type: 'error',
              text1: 'Warning',
              text2: 'Something went Wrong',
            });
            navigation.navigate(SCREENS.DASHBOARD);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('error in postVanCheckList', error);
        });
    } else {
      Alert.alert('Warning', 'Need internet connection to continue');
      setListLoading(false);
    }
  };

  const handleCheckbox = (item: any, value: boolean) => {
    dispatch(
      setVanCheckList(
        vanCheckist?.map((prevItem: {id: any}) =>
          prevItem.id === item.item.id
            ? {...prevItem, is_checked: value}
            : prevItem,
        ),
      ),
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

  const renderItemVerticle = (item: any) => {
    return (
      <View style={styles.itemContainerVerticle}>
        {/* <View
          style={{
            transform: [{scale: 0.6}],
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
          }}></View> */}
        <View style={{width: '75%'}}>
          <Text style={styles.label} numberOfLines={4}>
            {item?.item?.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
          }}>
          <TouchableOpacity
            onPress={() => handleCheckbox(item, true)}
            style={{
              backgroundColor:
                item?.item?.is_checked === true
                  ? colors.lightGreen
                  : 'transparent',
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 5,
              marginRight: 5,
              borderWidth: 1,
              borderColor: colors.lightGreen,
            }}>
            <Text
              style={{
                color:
                  item?.item?.is_checked === true ? 'white' : colors.lightGreen,
              }}>
              Yes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCheckbox(item, false)}
            style={{
              backgroundColor:
                item?.item?.is_checked === false
                  ? colors.lightGreen
                  : 'transparent',
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.lightGreen,
            }}>
            <Text
              style={{
                color:
                  item?.item?.is_checked === false
                    ? 'white'
                    : colors.lightGreen,
              }}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../Assets/Images/LogoSub.png')}
        style={{
          width: scale(78),
          height: scale(41),
          marginTop: '3%',
          marginHorizontal: 20,
        }}
      />

      {listLoading ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <AppLoader color={colors?.lightGreen} size={'large'} />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              marginTop: 10,
              paddingHorizontal: 20,
            }}>
            <Image
              source={require('../../Assets/Images/van.png')}
              style={{marginRight: 5}}
            />
            <Text style={{color: colors.black, marginVertical: 5}}>
              Van Installation CheckList
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingHorizontal: 20}}>
            <FlatList
              data={vanCheckist}
              renderItem={renderItemVerticle}
              keyExtractor={index => index?.toString()}
              ListEmptyComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              style={{marginTop: 10, marginBottom: 10}}
            />
          </ScrollView>
          <View style={styles.mainView}>
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
                signature.trim() !== '' && name.trim() !== ''
                  ? colors.lightGreen
                  : colors.lightGrey
              }
              clearBtnDisabled={signature === '' || name === ''}
              nameValue={name}
              onPressAccept={postCheckList}
              onAcceptButtonLoader={loading}
              btnText={'Accept'}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default VanCheckList;
