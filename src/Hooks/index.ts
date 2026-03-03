import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

const usePermission = (permission: any) => {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(permission);
          setIsGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn('Permission request error:', err);
          setIsGranted(false);
        }
      } else {
        setIsGranted(true);
      }
    };

    requestPermission();
  }, [permission]);

  return isGranted;
};

export default usePermission;
