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
  Platform,
} from "react-native";
import { SIZES, FONTS } from "../constants";

const Home = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const deleteTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.iconBox} />
      <Text style={[styles.taskText, item.completed && styles.lineAcross]}>
        {item.text}
      </Text>
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
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor={"#f4511e"} />

        <TouchableOpacity onPress={clearAllTasks}>
          <Text style={styles.header}>Clear All Tasks</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 1 }}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Set a task"
            placeholderTextColor="#bbb"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask} // Add task on Enter key
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceef0",
    paddingTop: SIZES.body2,
  },
  header: {
    position: "relative",
    // top: 0,
    ...FONTS.body4,
    color: "#aaa",
    alignSelf: "flex-end",
    padding: SIZES.body6,
    marginBottom: SIZES.body5,
  },
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
    textDecorationLine: "line-through",
  },
  lineAcross: {
    textDecorationLine: "line-through",
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
    backgroundColor: "#f4511e",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  plus: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    ...FONTS.body3c,
    color: "#333",
    textDecorationLine: "underline",
  },
  deleteButton: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#ffeaea",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    fontSize: 20,
    color: "#f4511e",
  },
});
