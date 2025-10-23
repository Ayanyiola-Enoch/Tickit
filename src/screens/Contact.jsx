import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { useStore } from "../../stores/useStore.js";

const Contact = () => {
  const {count} = useStore((state) => state);
  return (
    <View>
      <Text style={styles.text}>Contact {count}</Text>
      <Button title="Increment" onPress={() => useStore.getState().incrementAsync()} />
        <Button title ="Decrement" onPress={()=>useStore.getState().decrement()}/>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
