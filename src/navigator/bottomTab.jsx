import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import Home from "../screens/Home";
import TasksHistory from "../screens/TasksHistory";
import { FONTS, SIZES } from "../constants";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 25,
        height: 25,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: focused ? "#f4511e" : "#8e8e93",
        }}
      >
        {icon}
      </Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#f4511e",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Satoshi-Italic",
          fontSize: 18,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === "TasksTab") {
            icon = "✓";
          } else if (route.name === "HistoryTab") {
            icon = "📊";
          }

          return <TabIcon focused={focused} icon={icon} />;
        },
      })}
    >
      <Tab.Screen
        name="TasksTab"
        component={Home}
        options={{
          title: "Today's Tasks",
          tabBarLabel: "Tasks",
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={TasksHistory}
        options={{
          title: "Tasks History",
          tabBarLabel: "History",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
