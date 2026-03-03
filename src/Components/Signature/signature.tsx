import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import {scale} from 'react-native-size-matters';
import MiniButton from '../../Components/Buttons/MiniButton';
import {styles} from './styles';
import AppLoader from '../AppLoader';
import {colors} from '../../Theme/colors';

interface SignatureComponentProps {
  onOK: (signature: any) => void;
  onClear: () => void;
  onEnterName: (text: any) => any;
  clearBtnColor: any;
  clearBtnDisabled: any;
  nameValue: string;
  onPressAccept: () => any;
  onAcceptButtonLoader: boolean;
  btnText: string;
}

const SignatureComponent = forwardRef<
  SignatureViewRef,
  SignatureComponentProps
>(
  (
    {
      onOK,
      onClear,
      onEnterName,
      clearBtnColor,
      clearBtnDisabled,
      nameValue,
      onPressAccept,
      onAcceptButtonLoader,
      btnText,
    },
    ref,
  ) => {
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
      <View style={{height: scale(210)}}>
        <View style={styles.mainView}>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter Your Name"
            placeholderTextColor={colors.lightGrey}
            value={nameValue}
            onChangeText={text => {
              onEnterName(text);
            }}
          />
          <MiniButton
            title="Clear"
            onPress={() => {
              internalRef.current?.clearSignature(), onClear();
            }}
          />
        </View>
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
          <TouchableOpacity
            style={[
              styles.button1,
              {
                backgroundColor: clearBtnColor,
              },
            ]}
            disabled={clearBtnDisabled}
            onPress={onPressAccept}>
            {onAcceptButtonLoader ? (
              <AppLoader
                color={colors.white}
                style={{paddingVertical: scale(2)}}
              />
            ) : (
              <Text style={styles.buttonText}>{btnText}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export default SignatureComponent;
