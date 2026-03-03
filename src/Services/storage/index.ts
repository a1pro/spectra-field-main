import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string) {
  const value = await AsyncStorage.getItem(key);

  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  AsyncStorage.removeItem(key);
}

export async function removeAllItems() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log('AsyncStorage cleared successfully.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    // Handle error as needed
  }
}
