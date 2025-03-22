import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LineChart, Grid, YAxis } from "react-native-svg-charts";
import { Easing } from "react-native-reanimated";

export default function App() {
  const [moneyLeft, setMoneyLeft] = useState(250);
  const [displayMoney, setDisplayMoney] = useState(moneyLeft);
  const [alertVisible, setAlertVisible] = useState(false);
  const [lowBalance, setLowBalance] = useState(false);
  const moneyAnim = useState(new Animated.Value(moneyLeft))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const [graphData, setGraphData] = useState([300, 275, 250]);

  useEffect(() => {
    moneyAnim.addListener(({ value }) => {
      setDisplayMoney(Math.round(value));
    });

    return () => {
      moneyAnim.removeAllListeners();
    };
  }, []);

  const handleTransaction = () => {
    if (moneyLeft <= 25) {
      // Prevent spending & show low balance alert
      setLowBalance(true);
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
      return;
    }

    const newAmount = Math.max(moneyLeft - 50, 0);
    setMoneyLeft(newAmount);
    setLowBalance(false);
    setAlertVisible(true);

    Animated.parallel([
      Animated.timing(moneyAnim, {
        toValue: newAmount,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
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

    setGraphData((prevData) => [...prevData.slice(1), newAmount]);
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
    const newAmount = moneyLeft + 25;
    setMoneyLeft(newAmount);
    handleCool();

    Animated.timing(moneyAnim, {
      toValue: newAmount,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    setGraphData((prevData) => [...prevData.slice(1), newAmount]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Coach</Text>

      {/* Money Card */}
      <View style={styles.card}>
        <Animated.Text style={styles.moneyLeft}>${displayMoney}</Animated.Text>
        <Text style={styles.subText}>Left this week</Text>
      </View>

      {/* Spend Button */}
      <TouchableOpacity style={styles.transaction} onPress={handleTransaction}>
        <Text style={styles.transactionText}>💳 - $50 on Takeout</Text>
      </TouchableOpacity>

      {/* Spending Graph */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Spending Trend</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // paddingRight: 15,
          }}
        >
          <YAxis
            data={[0, ...graphData]}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ fontSize: 12, fill: "#333" }}
            numberOfTicks={5}
            formatLabel={(value) => `$${value}`}
          />
          <LineChart
            style={styles.graph}
            data={[0, ...graphData]}
            svg={{ stroke: "#4CAF50", strokeWidth: 3 }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
          </LineChart>
        </View>
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
            {lowBalance
              ? "⚠️ Not enough balance left!"
              : `You spent $50—$${moneyLeft} left this week. Cool or cut back?`}
          </Text>

          {!lowBalance && (
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
          )}
        </Animated.View>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

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
    justifyContent: "center",
    alignItems: "center",
    bottom: 30,
    left: "5%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    gap: 15,
  },
  alertText: {
    fontSize: 18,

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
