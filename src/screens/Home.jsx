import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { SIZES, FONTS } from "../constants";

const Home = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.iconBox} />
      <Text style={[styles.taskText,item.completed && styles.lineAcross]}>{item.text}</Text>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={() => {
          setTasks((tasks) =>
            tasks.map((t) =>
              t.id === item.id ? { ...t, completed: !t.completed } : t
            )
          );
        }}
      >
        {item.completed ? <View style={styles.innerCircle} /> : null}
      </TouchableOpacity>
    </View>
  );

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor={"#f4511e"} />

      {/* <Text style={styles.header}>Today's tasks</Text> */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
      <KeyboardAvoidingView style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Write a task"
          placeholderTextColor="#bbb"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceef0",
    paddingTop: SIZES.body2,
  },
  //   header: {
  //     marginLeft: 20,
  //     ...FONTS.h2,
  //     marginBottom: 30,
  //     color: '#222',
  //   },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  taskText: {
    flex: 1,
    fontSize: 18,
    color: "#222",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f4511e",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    borderColor: "#4fc3f7",
    backgroundColor: "#e3f6ff",
     textDecorationLine:'line-through'
  },
  lineAcross:{
     textDecorationLine:'line-through'
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4fc3f7",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: SIZES.h1,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: SIZES.h1 * 1.4,
    marginHorizontal: SIZES.h3,
  },
  input: {
    flex: 1,
    height: 50,
    ...FONTS.body4,
    color: "#222",
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eceef0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  plus: {
    fontSize: 32,
    color: "#bbb",
    fontWeight: "bold",
  },
  text: {
    ...FONTS.body3c,
    color: "#333",
    textDecorationLine: "underline",
  },
});
