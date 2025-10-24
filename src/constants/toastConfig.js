import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const baseStyles = {
  style: { borderLeftWidth: 0, borderRadius: 12, minHeight: 56 },
  text1Style: { fontFamily: 'PoppinsSemiBold', fontSize: 15 },
  text2Style: { fontFamily: 'PoppinsRegular', fontSize: 13 },
};

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      {...baseStyles}
      style={[baseStyles.style, { backgroundColor: '#e7f7ee' }]}
      text1Style={baseStyles.text1Style}
      text2Style={baseStyles.text2Style}
      contentContainerStyle={{ paddingHorizontal: 14 }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      {...baseStyles}
      style={[baseStyles.style, { backgroundColor: '#fdecec' }]}
      text1Style={baseStyles.text1Style}
      text2Style={baseStyles.text2Style}
      contentContainerStyle={{ paddingHorizontal: 14 }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      {...baseStyles}
      style={[baseStyles.style, { backgroundColor: '#eef3ff' }]}
      text1Style={baseStyles.text1Style}
      text2Style={baseStyles.text2Style}
      contentContainerStyle={{ paddingHorizontal: 14 }}
    />
  ),
};

export default toastConfig;