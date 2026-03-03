import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import {scale} from 'react-native-size-matters';
import MiniButton from '../../Components/Buttons/MiniButton';
import {styles} from './styles';

interface SignatureComponentProps {
  onOK: (signature: any) => void;
  onClear: () => void;
}

const SignatureWithOutNameComponent = forwardRef<
  SignatureViewRef,
  SignatureComponentProps
>(({onOK, onClear}, ref) => {
  const internalRef = useRef<SignatureViewRef>(null);

  useImperativeHandle(ref, () => ({
    readSignature: () => internalRef.current?.readSignature(),
    clearSignature: () => internalRef.current?.clearSignature(),
    changePenColor: () => {},
    changePenSize: () => {},
    cropWhitespace: (url: string) => {},
    draw: () => {},
    erase: () => {},
    getData: () => {},
    undo: () => {},
    redo: () => {},
  }));

  const handleEnd = () => {
    internalRef.current?.readSignature();
  };

  return (
    <View style={{height: scale(170)}}>
      <SignatureScreen
        ref={internalRef}
        onOK={onOK}
        onEnd={handleEnd}
        style={{
          borderColor: 'black',
          borderBottomWidth: 1,
        }}
        webStyle={`.m-signature-pad {background:${'rgb(255,255,255)'};border:none;box-shadow:none;height:${scale(
          170,
        )}px;} .m-signature-pad--body {border:none;} .m-signature-pad--footer  {display: none !important;} .m-signature-pad--body canvas {box-shadow: none !important;}`}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: scale(3),
        }}>
        <Text style={styles.signatureText}>Signature Here</Text>
        <MiniButton
          title="Clear"
          onPress={() => {
            internalRef.current?.clearSignature(), onClear();
          }}
        />
      </View>
    </View>
  );
});

export default SignatureWithOutNameComponent;
