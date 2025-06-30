import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import About from '../screens/About';

const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: 'Welcome', headerStyle: { backgroundColor: '#f4511e' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}
            />
            <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
        </Stack.Navigator>

    );
};

export default MyStack;