import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./src/navigator/MyStack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from "expo-font";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );

  const [fontsLoaded] = useFonts({
    PoppinsBold: require("./src/assets/font/Poppins-Bold.ttf"),
    PoppinsBlack: require("./src/assets/font/Poppins-Black.ttf"),
    PoppinsRegular: require("./src/assets/font/Poppins-Regular.ttf"),
    PoppinsThin: require("./src/assets/font/Poppins-Thin.ttf"),
    PoppinsExtraBold: require("./src/assets/font/Poppins-ExtraBold.ttf"),
    PoppinsMedium: require("./src/assets/font/Poppins-Medium.ttf"),
    "RobotoSlab-SemiBold": require("./src/assets/font/RobotoSlab-SemiBold.ttf"),
    "RobotoSlab-Medium": require("./src/assets/font/RobotoSlab-Medium.ttf"),
    "RobotoSlab-Light": require("./src/assets/font/RobotoSlab-Light.ttf"),
    "RobotoSlab-Regular": require("./src/assets/font/RobotoSlab-Regular.ttf"),
    "Inter-Regular": require("./src/assets/font/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./src/assets/font/Inter-SemiBold.ttf"),
  });
};
export default App;
