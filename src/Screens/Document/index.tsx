import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {colors} from '../../Theme/colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getDocumentsList} from '../../Services/api/documents';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../Navigation/MainNavigator';
import {setDocument} from '../../Redux/Slicres/documentSlicer';
import {useDispatch, useSelector} from 'react-redux';
import {scale} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FlashList} from '@shopify/flash-list';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Document = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const doc = useSelector((state: any) => state.document.document);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTotalPages(1);
        setCurrentPage(1);
        setSearch('');
        dispatch(setDocument([]));
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data: any = {page: currentPage, page_size: 10, search};
          if (search !== '') {
            data.document_name = search;
          }
          const res: any = await getDocumentsList(data);
          // if (currentPage === 1) {
            dispatch(setDocument(res?.data?.documents));
            // dispatch(setDocument([]));

          // } else {
          //   dispatch(setDocument([...doc, ...res?.data?.documents]));
          // }
          setLoading(false);
          // setTotalPages(res?.data?.pagination?.total_pages || 1);
        } catch (error) {
          setLoading(false);
          console.log('error in getting documents', error);
        }
      };
      fetchData();
    }, [currentPage, search]),
  );

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const onPressDocument = (item: any) => {
    navigation.navigate(SCREENS.DOCUMENTREADER, {
      data: item,
    });
  };





  const Item = (item: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onPressDocument(item?.item?.url);
      }}>
      <View style={styles.row}>
        <Image source={require('../../Assets/Images/doc.png')} />
        <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {item?.item?.name}
        </Text>
      </View>
      {/* <Text style={styles.mb}>5 MB</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.row, {paddingHorizontal: 20}]}>
        <Image
          source={require('../../Assets/Images/logoClear.png')}
          style={styles.imageStyle}
        />
        <View style={[styles.row, styles.input]}>
          <Image
            source={require('../../Assets/Images/search.png')}
            style={styles.iconStyle}
          />
          <TextInput
            value={search}
            placeholder={'Search...'}
            style={styles.inputStyle}
            onChangeText={text => {
              setSearch(text);
            }}
            placeholderTextColor={colors.grey}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
          <Image source={require('../../Assets/Images/filter.png')} />
        </View>
      </View>
      <Text style={styles.heading}>Documents</Text>
      <FlatList
        data={doc}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item.id}
        style={{marginTop: scale(10), paddingTop:scale(10)}}
        onEndReached={() => {
          loadMore();
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={colors.lightGreen}
              style={{marginVertical: 10}}
            />
          ) : null
        }
      />
    </View>
  );
};

export default Document;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: 35,
    width: 70,
    marginTop: 10,
    marginRight: 15,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.grey,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 4,
    marginTop: 7,
  },
  inputStyle: {
    flex: 1,
    height: scale(10),
    backgroundColor: 'transparent',
    fontSize: 12,
    padding: 0,
  },
  iconStyle: {
    height: 17,
    width: 17,
  },
  heading: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '400',
    marginTop: scale(30),
    marginHorizontal: scale(20),
  },
  heading2: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '400',
    marginTop: scale(250),
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  item: {
    backgroundColor: colors.white,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  name: {
    color: colors.black,
    marginLeft: 10,
    width: '80%',
  },
  mb: {
    color: colors.black,
    fontSize: 12,
  },
});
