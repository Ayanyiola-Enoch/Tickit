import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./src/navigator/MyStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import toastConfig from "./src/constants/toastConfig";

const App = () => {
  const [fontsLoaded] = useFonts({
    "Satoshi-Bold": require("./src/assets/fonts/Satoshi-Bold.otf"),
    "Satoshi-Black": require("./src/assets/fonts/Satoshi-Black.otf"),
    "Satoshi-Regular": require("./src/assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Light": require("./src/assets/fonts/Satoshi-Light.otf"),
    "Satoshi-Medium": require("./src/assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Italic": require("./src/assets/fonts/Satoshi-Italic.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
        <Toast
          config={toastConfig}
          position="top"
          topOffset={32}
          visibilityTime={2200}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
