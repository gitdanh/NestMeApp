import { useState } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Table, Row, Rows } from "react-native-table-component";

const dataTableahihi = [
  { id: 1, name: "Ahsan", username: "ahsannn", age: 17 },
  { id: 2, name: "Ali", username: "aliali", age: 18 },
  { id: 3, name: "Ahmad", username: "ahmad13", age: 24 },
  { id: 4, name: "Usman", username: "usmankhan", age: 18 },
  { id: 5, name: "Shehzaad", username: "shehzadali", age: 124 },
];

const tableData = {
  tableHead: ["Crypto Name", "Value", "Mkt Cap"],
  tableData: [
    ["Bitcoin", "$44,331", "$839,702,328,904"],
    ["Ethereum", "$3000.9", "$359,080,563,225"],
    ["Tether", "$1", "$79,470,820,738"],
    ["BNB", "$413.44", "$69,446,144,361"],
    ["USD Coin", "$1", "$53,633,260,549"],
  ],
};

const DashboardScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Image
          style={styles.profileImg}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/socialweb-ce3cd.appspot.com/o/images%2F1703651703208?alt=media&token=b57097e1-8fb9-4168-ba18-a40729b3dd73",
          }}
        />
      </View>

      {/* <Text style={styles.cell}>{item.name}</Text> */}
      <Text style={styles.cell}>{item.username}</Text>
      <Text style={styles.cell}>{item.age}</Text>
    </View>
  );
  const [data, setData] = useState(tableData);
  const postData = [
    { value: 50, dataPointText: "30", label: "Mon" },
    { value: 20, dataPointText: "20", label: "Tue" },
    { value: 18, dataPointText: "18", label: "Wed" },
    { value: 40, dataPointText: "40", label: "Thu" },
    { value: 36, dataPointText: "36", label: "Fri" },
    { value: 100, dataPointText: "100", label: "Sat" },
    { value: 54, dataPointText: "54", label: "Sun" },
  ];

  const userData = [
    { value: 0, dataPointText: "30", label: "Mon" },
    { value: 40, dataPointText: "20", label: "Tue" },
    { value: 78, dataPointText: "18", label: "Wed" },
    { value: 20, dataPointText: "40", label: "Thu" },
    { value: 36, dataPointText: "36", label: "Fri" },
    { value: 11, dataPointText: "100", label: "Sat" },
    { value: 54, dataPointText: "54", label: "Sun" },
  ];

  // Dữ liệu mẫu cho Latest Users và Top Authors
  const latestUsersData = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Williams" },
  ];

  const topAuthorsData = [
    { id: 1, name: "Michael Brown", postCount: 24 },
    { id: 2, name: "Emily Davis", postCount: 20 },
    { id: 3, name: "William Wilson", postCount: 18 },
    { id: 4, name: "Olivia Taylor", postCount: 15 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Week Overview</Text>
      <LineChart
        data={postData}
        data2={userData}
        initialSpacing={6}
        spacing={55}
        textFontSize={13}
        thickness={5}
        hideRules
        hideYAxisText
        yAxisColor="#1A3461"
        showVerticalLines
        verticalLinesColor="rgba(14,164,164,0.5)"
        xAxisColor="#0BA5A4"
        color1="skyblue"
        color2="orange"
        dataPointsColor1="blue"
        dataPointsColor2="red"
        textColor1="green"
        textShiftY={-8}
        textShiftX={15}
        xAxisLabels={userData.map((dataPoint) => dataPoint.label)}
        xAxisLabelsVerticalShift={6}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "blue" }]} />
          <Text style={styles.legendText}>User</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>Post</Text>
        </View>
      </View>
      <View style={styles.containers}>
        <View style={styles.headerTopBar}>
          <Text style={styles.headerTopBarText}>Users</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.heading}>Avatar</Text>
          <Text style={styles.heading}>Name</Text>
          <Text style={styles.heading}>Joined at</Text>
        </View>
        <FlatList
          data={dataTableahihi}
          keyExtractor={(item) => {
            item.id.toString();
          }}
          renderItem={renderItem}
          scrollEnabled={false} // Tắt hiệu ứng lướt
        />
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#1A3461",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginRight: 5,
  },
  legendText: {
    color: "white",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#264653",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  gridContent: {
    color: "white",
    marginTop: 5,
  },
  containers: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  head: { height: 44, backgroundColor: "darkblue" },
  headText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, fontWeight: "bold", textAlign: "center" },
  headerTopBar: {
    backgroundColor: "#6AB7E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 15,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerTopBarText: {
    color: "#fff",
    justifyContent: "space-between",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  heading: { flex: 1, fontSize: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cell: { flex: 1 },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 40,
  },
});
