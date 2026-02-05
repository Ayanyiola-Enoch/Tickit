import React, { useState, useEffect, useRef } from "react";
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
  Image,
  Animated,
  Keyboard,
  Modal,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SIZES, FONTS, icons } from "../constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "../utils/toast";

const Home = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets
    ? useSafeAreaInsets()
    : { top: 0, bottom: 0, left: 0, right: 0 };
  // Fallback offset for Android 3-button nav bars when safe area returns 0
  const baseBottomOffset = Math.max(
    insets.bottom || 0,
    Platform.OS === "android" ? 24 : 0,
  );
  const listRef = useRef(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Keyboard listeners to move input above the keyboard
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });
    const onHide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@todo_tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("@todo_tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const deleteTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const addTask = () => {
    const text = newTask.trim();
    if (text) {
      const newItem = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newItem, ...prev]);
      setNewTask("");
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
      });
    }
  };

  const handleAddTodo = () => {
    const text = newTask.trim();
    if (text) {
      const newItem = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newItem, ...prev]);
      setNewTask("");
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
      });
      toast.success("Task added");
    } else {
      toast.error("Enter a task");
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
    setOpenModal(false);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: editingText.trim() } : task,
        ),
      );
      setEditingId(null);
      setEditingText("");
    } else {
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
          onPress={() => {
            setOpenModal(true);
            deleteTask(taskId);
          }}
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
            <Text
              style={[styles.taskText, item.completed && styles.lineAcross]}
            >
              {item.text}
            </Text>
            {item.createdAt && (
              <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {new Date(item.createdAt).toLocaleDateString()} •{" "}
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {editingId === item.id ? (
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveIcon}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
              <Text style={styles.cancelIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.checkbox,
                item.completed && styles.checkboxChecked,
              ]}
              onPress={() => {
                setTasks((tasks) =>
                  tasks.map((t) =>
                    t.id === item.id ? { ...t, completed: !t.completed } : t,
                  ),
                );
              }}
            >
              {item.completed ? <View style={styles.innerCircle} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Image source={icons.trash} style={styles.deleteIcon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Swipeable>
  );

  // Platform-specific margin for input bar
  // const inputMarginBottom =
  //   Platform.OS === "ios"
  //     ? keyboardHeight + baseBottomOffset + 4
  //     : baseBottomOffset + 4;

  const KEYBOARD_EXTRA_MARGIN = 4; // <-- the “little push” you

  // ---- replace the old inputMarginBottom calculation ----
  const inputMarginBottom =
    Platform.OS === "ios"
      ? keyboardHeight + baseBottomOffset + KEYBOARD_EXTRA_MARGIN
      : keyboardHeight > 0
        ? keyboardHeight + KEYBOARD_EXTRA_MARGIN // Android: push up a bit
        : baseBottomOffset + KEYBOARD_EXTRA_MARGIN; // Android: normal rest position

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        <StatusBar style="auto" backgroundColor={"#f4511e"} />
        <View style={styles.headerContainer}>
          {tasks.length > 0 && (
            <Text style={{ ...FONTS.h4, color: "#333" }}>
              Uncompleted Tasks
            </Text>
          )}
          {tasks.length > 0 && (
            <TouchableOpacity onPress={clearAllTasks}>
              <Text style={styles.header}>Clear All Tasks</Text>
            </TouchableOpacity>
          )}
        </View>
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
            ref={listRef}
            contentContainerStyle={{
              // add keyboardHeight so last item is never hidden when input lifts
              paddingBottom:
                baseBottomOffset +
                56 +
                24 +
                (keyboardHeight > 0 ? keyboardHeight : 0),
              paddingTop: 0,
            }}
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {/* Bottom input anchored to safe area and lifts above keyboard */}
      <SafeAreaView
        edges={["bottom"]}
        style={styles.bottomSafe}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.inputBarAbsolute,
            {
              marginBottom: inputMarginBottom,
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Set a task"
            placeholderTextColor="#bbb"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal onRequestClose={() => setOpenModal(false)} visible={openModal}>
        <View>
          <Text>Are you sure you want to delete </Text>
        </View>
      </Modal>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignSelf: "flex-end",
    alignItems: "center",
    paddingHorizontal: SIZES.body3,
    marginBottom: SIZES.body5,
  },

  header: {
    ...FONTS.body5,
    color: "#aaa",
    padding: SIZES.body6,
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
    ...FONTS.body3,
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
    borderColor: "#2ed573",
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
    backgroundColor: "#2ed573",
  },
  inputBar: {
    display: "none",
  },
  inputBarAbsolute: {
    position: "absolute",
    left: SIZES.h3,
    right: SIZES.h3,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: SIZES.h1,
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    height: 56,
  },
  bottomSafe: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
    width: 65,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#f4511e",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
  },
  plus: {
    ...FONTS.h1,
    color: "#fff",
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
    width: SIZES.h4,
    height: SIZES.h4,
  },
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
    ...FONTS.h2,
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
  // Edit mode styles
  editInput: {
    flex: 1,
    ...FONTS.body4,
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
    ...FONTS.h4,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    ...FONTS.body4,
    color: "#999",
    textAlign: "center",
  },
});
