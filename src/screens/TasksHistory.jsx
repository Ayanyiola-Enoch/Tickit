import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SIZES, FONTS } from "../constants";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TasksHistory = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const insets = useSafeAreaInsets
    ? useSafeAreaInsets()
    : { top: 0, bottom: 0, left: 0, right: 0 };

  useEffect(() => {
    loadAllTasks();
  }, []);

  useEffect(() => {
    // Group tasks by date whenever tasks or completedTasks change
    groupTasksByDate();
  }, [tasks, completedTasks]);

  const loadAllTasks = async () => {
    try {
      // Load active tasks
      const storedTasks = await AsyncStorage.getItem("@todo_tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      // Load completed tasks
      const storedCompletedTasks = await AsyncStorage.getItem(
        "@todo_completed_tasks",
      );
      if (storedCompletedTasks) {
        setCompletedTasks(JSON.parse(storedCompletedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const groupTasksByDate = () => {
    const allTasks = [...tasks, ...completedTasks];
    const grouped = {};

    allTasks.forEach((task) => {
      if (task.createdAt) {
        const date = new Date(task.createdAt).toDateString();
        if (!grouped[date]) {
          grouped[date] = {
            active: [],
            completed: [],
          };
        }

        if (completedTasks.some((ct) => ct.id === task.id)) {
          grouped[date].completed.push(task);
        } else {
          grouped[date].active.push(task);
        }
      }
    });

    // Sort dates in descending order (newest first)
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });

    setGroupedTasks(sortedGrouped);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const renderTask = (task, isCompleted = false) => (
    <View
      key={task.id}
      style={[
        styles.taskCard,
        isCompleted && styles.completedTaskCard,
      ]}
    >
      <View style={styles.iconBox} />
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.taskText,
            isCompleted && styles.completedTaskText,
          ]}
        >
          {task.text}
        </Text>
        {task.createdAt && (
          <Text style={styles.timeText}>
            {new Date(task.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.statusBadge,
          isCompleted ? styles.completedBadge : styles.activeBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isCompleted ? styles.completedStatusText : styles.activeStatusText,
          ]}
        >
          {isCompleted ? "Done" : "Active"}
        </Text>
      </View>
    </View>
  );

  const renderDateSection = ({ item: date }) => {
    const dayTasks = groupedTasks[date];
    const totalTasks = dayTasks.active.length + dayTasks.completed.length;
    const completedCount = dayTasks.completed.length;

    return (
      <View style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateTitle}>{formatDate(date)}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {completedCount}/{totalTasks} completed
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Active tasks */}
        {dayTasks.active.map((task) => renderTask(task, false))}

        {/* Completed tasks */}
        {dayTasks.completed.map((task) => renderTask(task, true))}
      </View>
    );
  };

  const dates = Object.keys(groupedTasks);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor={"#f4511e"} />
      
      {dates.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📊</Text>
          <Text style={styles.emptyStateText}>No task history yet!</Text>
          <Text style={styles.emptyStateSubtext}>
            Your completed and active tasks will appear here organized by date
          </Text>
        </View>
      ) : (
        <FlatList
          data={dates}
          renderItem={renderDateSection}
          keyExtractor={(date) => date}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default TasksHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceef0",
  },
  listContainer: {
    padding: SIZES.body2,
    paddingBottom: 100,
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
    paddingHorizontal: 40,
  },
  dateSection: {
    marginBottom: SIZES.h2,
  },
  dateHeader: {
    marginBottom: SIZES.body3,
    paddingHorizontal: SIZES.body4,
  },
  dateTitle: {
    ...FONTS.h3,
    color: "#333",
    marginBottom: SIZES.body5,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsText: {
    ...FONTS.body5,
    color: "#666",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginLeft: SIZES.body4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#f4511e",
    borderRadius: 3,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: SIZES.body5,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedTaskCard: {
    opacity: 0.7,
    backgroundColor: "#f8f9fa",
  },
  iconBox: {
    width: 4,
    height: 32,
    backgroundColor: "#f4511e",
    borderRadius: 2,
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    ...FONTS.body4,
    color: "#333",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  timeText: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: "#e8f4fd",
  },
  completedBadge: {
    backgroundColor: "#e8f5e8",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  activeStatusText: {
    color: "#2563eb",
  },
  completedStatusText: {
    color: "#16a34a",
  },
});