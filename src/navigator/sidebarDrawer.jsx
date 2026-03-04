import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import TasksHistory from "../screens/TasksHistory";

const Drawer = createDrawerNavigator();

const SidebarDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
        },
        drawerActiveTintColor: "#f4511e",
        drawerInactiveTintColor: "#666",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          marginLeft: -20,
        },
        drawerItemStyle: {
          marginVertical: 5,
          borderRadius: 10,
        },
        drawerContentStyle: {
          backgroundColor: "#fff",
          paddingTop: 20,
        },
      }}
    >
      <Drawer.Screen
        name="TasksTab"
        component={Home}
        options={{
          title: "Today's Tasks",
          drawerLabel: "✓ Today's Tasks",
        }}
      />
      <Drawer.Screen
        name="HistoryTab"
        component={TasksHistory}
        options={{
          title: "Tasks History",
          drawerLabel: "📊 Tasks History",
        }}
      />
    </Drawer.Navigator>
  );
};

export default SidebarDrawerNavigator;
