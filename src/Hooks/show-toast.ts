import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ShowToastProps {
  type: ToastType;
  text1: string;
  text2?: string;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
}

const showToast = ({
  type,
  text1,
  text2,
  position = 'top',
  visibilityTime = 4000,
  autoHide = true,
}: ShowToastProps) => {
  Toast.show({
    type,
    position,
    text1,
    text2,
    visibilityTime,
    autoHide,
    topOffset: 30,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
  });
};

export default showToast;
