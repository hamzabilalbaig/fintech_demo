import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-svg-charts";

export default function App() {
  const [moneyLeft, setMoneyLeft] = useState(250);
  const [alertVisible, setAlertVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  const handleTransaction = () => {
    setMoneyLeft(moneyLeft - 50);
    setAlertVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCool = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setAlertVisible(false));
  };

  const handleCutBack = () => {
    setMoneyLeft((prev) => prev + 25);
    handleCool();
  };

  const data = [300, 275, 250, 230, 220, 200, moneyLeft];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Coach</Text>

      <View style={styles.card}>
        <Text style={styles.moneyLeft}>${moneyLeft}</Text>
        <Text style={styles.subText}>Left this week</Text>
      </View>

      <TouchableOpacity style={styles.transaction} onPress={handleTransaction}>
        <Text style={styles.transactionText}>💳 - $50 on Takeout</Text>
      </TouchableOpacity>

      {/* Spending Trend Graph */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Spending Trend</Text>
        <LineChart
          style={styles.graph}
          data={data}
          svg={{ stroke: "#4CAF50", strokeWidth: 3 }}
          contentInset={{ top: 20, bottom: 20 }}
        />
      </View>

      {/* Alert Box - Positioned at the Bottom */}
      {alertVisible && (
        <Animated.View
          style={[
            styles.alertBox,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.alertText}>
            You spent $50—${moneyLeft} left this week. Cool or cut back?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCool}>
              <Text style={styles.buttonText}>Cool</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cutBack]}
              onPress={handleCutBack}
            >
              <Text style={styles.buttonText}>Cut Back</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#4CAF50",
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 30,
  },
  moneyLeft: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 16,
    color: "#d9f7de",
  },
  transaction: {
    backgroundColor: "#FF7043",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  transactionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  alertBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    position: "absolute",
    bottom: 30, // Places the alert **ABOVE** the graph
    left: "5%",
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10, // Keeps alert **on top**
    zIndex: 10,
  },
  alertText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cutBack: {
    backgroundColor: "#FFCA28",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  graphContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 1, // Keeps graph below alert
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  graph: {
    height: 200,
    width: "100%",
  },
});
