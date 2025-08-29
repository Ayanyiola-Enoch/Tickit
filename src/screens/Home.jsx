import React, { useState, useEffect } from "react";
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
  Animated,
} from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIZES, FONTS } from "../constants";

const Home = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever tasks array changes
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@todo_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('@todo_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

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

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTasks(tasks =>
        tasks.map(task =>
          task.id === editingId
            ? { ...task, text: editingText.trim() }
            : task
        )
      );
      setEditingId(null);
      setEditingText("");
    } else {
      // If text is empty, delete the task
      deleteTask(editingId);
      setEditingId(null);
      setEditingText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Right action for swipe (delete)
  const renderRightActions = (taskId) => {
    return (
      <Animated.View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => deleteTask(taskId)}
        >
          <Text style={styles.deleteActionText}>Delete</Text>
          <Text style={styles.deleteActionIcon}>🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };



  const renderTask = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      rightThreshold={40}
    >
      <View style={styles.taskCard}>
        <View style={styles.iconBox} />
        {editingId === item.id ? (
          <TextInput
            style={styles.editInput}
            value={editingText}
            onChangeText={setEditingText}
            onSubmitEditing={saveEdit}
            onBlur={saveEdit}
            autoFocus
            returnKeyType="done"
            multiline={false}
          />
        ) : (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => startEditing(item.id, item.text)}
          >
            <Text style={[styles.taskText, item.completed && styles.lineAcross]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        
        {editingId === item.id ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveEdit}
            >
              <Text style={styles.saveIcon}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEdit}
            >
              <Text style={styles.cancelIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </Swipeable>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
    >
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor={"#f4511e"} />

        <TouchableOpacity onPress={clearAllTasks}>
          <Text style={styles.header}>Clear All Tasks</Text>
        </TouchableOpacity>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📝</Text>
            <Text style={styles.emptyStateText}>No tasks yet!</Text>
            <Text style={styles.emptyStateSubtext}>
              Add a task below to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={styles.inputBarAbsolute}>
        <TextInput
          style={styles.input}
          placeholder="Set a task"
          placeholderTextColor="#bbb"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
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
    display: 'none', // Hide the old inputBar
  },
  inputBarAbsolute: {
    position: 'absolute',
    left: SIZES.h3,
    right: SIZES.h3,
    bottom: Platform.OS === 'ios' ? 30 : 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: SIZES.h1,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
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
  // New swipe action styles
  rightActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    marginRight: 20,
  },
  deleteAction: {
    backgroundColor: "#ff4757",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 20,
  },
  deleteActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  deleteActionIcon: {
    fontSize: 20,
  },
  leftActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 20,
    marginLeft: 20,
  },
  editAction: {
    backgroundColor: "#3742fa",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 20,
  },
  editActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  editActionIcon: {
    fontSize: 20,
    color: "#fff",
  },
  // Edit mode styles
  editInput: {
    flex: 1,
    fontSize: 18,
    color: "#222",
    borderBottomWidth: 1,
    borderBottomColor: "#3742fa",
    paddingBottom: 2,
    marginRight: 10,
  },
  editButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    marginRight: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#e8f5e8",
    alignItems: "center",
    justifyContent: "center",
  },
  saveIcon: {
    fontSize: 16,
    color: "#2ed573",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#ffeaea",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelIcon: {
    fontSize: 16,
    color: "#ff4757",
    fontWeight: "bold",
  },
  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});