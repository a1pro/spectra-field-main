import {Platform, Alert, PermissionsAndroid} from 'react-native';
import {
  PERMISSIONS,
  Permission,
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

import Geolocation from 'react-native-geolocation-service';

type Result = 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited';

export async function useCameraPermission() {
  const status = await request(
    // @ts-ignore
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  );
  return status;
}

export async function useMediaPermission() {
  const statusRead = await request(
    // @ts-ignore
    Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
  );

  const statusWrite = await request(
    // @ts-ignore
    Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
  );
  return {statusRead, statusWrite};
}

export async function requestUserPermission() {
  const status = await request(
    // @ts-ignore
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  );

  return status;
}

export function checkPermission(permission: Permission) {
  return new Promise((resolve, reject) => {
    check(permission)
      .then((result: Result) => {
        resolve(result);
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
}

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        console.log('error', error);
        if (error?.message == 'No location provider available.') {
          Alert.alert(
            'Alert',
            'Please enable your location services to continue.',
            [
              {
                text: 'Cancel',
                onPress: () => getLocation(),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => getLocation(),
              },
            ],
            {cancelable: true},
          );
        } else {
          reject(error);
        }
      },
      {
        accuracy: {
          android: 'balanced',
          ios: 'best',
        },
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 0,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  });
};

export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    let permissions = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });

    // @ts-ignore
    checkPermission(permissions)
      .then(result => {
        if (result === 'granted') {
          return result;
        } else {
          return requestUserPermission()
            .then((permissionResult: Result) => {
              if (permissionResult === 'granted') return permissionResult;
            })
            .catch(error => {
              return error;
            });
        }
      })
      .then(result => {
        return getLocation();
      })
      .then(result => {
        resolve(result);
      })

      .catch(error => {
        reject(error);
      });
  });
}

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED;
  }
  return false;
};

export const requestCameraPermission = async () => {
  const result = await request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  );
  if (result === RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
};

export const requestGalleryPermission = async () => {
  const result = await request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  );
  if (result === RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
};
