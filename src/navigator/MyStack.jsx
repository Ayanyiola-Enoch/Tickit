import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SidebarDrawerNavigator from "./sidebarDrawer";
import Home from "../screens/Home";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={SidebarDrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MyStack;
