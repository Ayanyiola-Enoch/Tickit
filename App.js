import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import toastConfig from "./src/constants/toastConfig";
import MyStack from "./src/navigator/MyStack";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Satoshi-Bold": require("./src/assets/fonts/Satoshi-Bold.otf"),
    "Satoshi-Black": require("./src/assets/fonts/Satoshi-Black.otf"),
    "Satoshi-Regular": require("./src/assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Light": require("./src/assets/fonts/Satoshi-Light.otf"),
    "Satoshi-Medium": require("./src/assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Italic": require("./src/assets/fonts/Satoshi-Italic.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Root" component={MyStack} />
          </Stack.Navigator>
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
}
