import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Table, Row, Rows } from "react-native-table-component";
import axios from "axios";
import moment from "moment";

const DashboardScreen = () => {
  const renderItemUser = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Image
          style={styles.profileImg}
          source={{
            uri:
              item.profile_picture !== ""
                ? item.profile_picture
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
        />
      </View>

      {/* <Text style={styles.cell}>{item.name}</Text> */}
      <View style={styles.cell}>
        <Text>{item.username}</Text>
      </View>
      <View style={styles.cell}>
        <Text>{moment(item.created_at).format("DD/MM/YYYY")}</Text>
      </View>
    </View>
  );
  const renderItemPost = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Image
          style={styles.profileImg}
          source={{
            uri:
              item.profile_picture !== ""
                ? item.profile_picture
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
        />
      </View>

      {/* <Text style={styles.cell}>{item.name}</Text> */}
      <View style={styles.cell}>
        <Text>{item.username}</Text>
      </View>
      <View style={styles.cell}>
        <Text>{item.posts_count}</Text>
      </View>
      <View style={styles.cell}>
        <Text>{item.latest_post.content}</Text>
      </View>
    </View>
  );
  const [weekOverviewUser, setWeekOverviewUser] = useState([]);
  const [weekOverviewPost, setWeekOverviewPost] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [usersMostPost, setUsersMostPost] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const accessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmZlZmNlZTIxZDdiYmQyZDk1YWEzZCIsInB3IjoiJDJiJDEwJG9TZ3NOaWpDbVN3Rks0WkpTZ0NtRi5lV0hVU0M1VUVwci9FTjQxMGZiUTJlbDVWaGVQT25DIiwiZm4iOiJOZ3V54buFbiBWxINuIEEiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzEyMDQ2MDM3LCJleHAiOjE3MTIwNzQ4Mzd9.0YyjHlpBUR0dhviBwAkSIaleeKlsjun9quBlgKfrSLQ";
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const response0 = await axios.get(
          "https://nestme-server.onrender.com/api/admin/statistic",
          config
        );
        const response1 = await axios.get(
          "https://nestme-server.onrender.com/api/admin/user?page=1&limit=5&search=",
          config
        );
        const response2 = await axios.get(
          "https://nestme-server.onrender.com/api/admin/user/mostpost",
          config
        );
        setWeekOverviewUser(response0.data[0].graphCardInfo.data);
        setWeekOverviewPost(response0.data[1].graphCardInfo.data);
        setLatestUsers(response1.data.users);
        setUsersMostPost(response2.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };
    getUsers();
  }, []);

  const pattern = [
    { value: 0, dataPointText: "30", label: "Mon" },
    { value: 20, dataPointText: "20", label: "Tue" },
    { value: 18, dataPointText: "18", label: "Wed" },
    { value: 40, dataPointText: "40", label: "Thu" },
    { value: 36, dataPointText: "36", label: "Fri" },
    { value: 100, dataPointText: "100", label: "Sat" },
    { value: 54, dataPointText: "54", label: "Sun" },
  ];
  const userData = pattern.map((item, index) => ({
    ...item,
    value: weekOverviewUser[index],
    dataPointText: weekOverviewUser[index],
  }));
  const postData = pattern.map((item, index) => ({
    ...item,
    value: weekOverviewPost[index],
    dataPointText: weekOverviewPost[index],
  }));

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Week Overviews</Text>
          </View>
          <LineChart
            data={userData}
            data2={postData}
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
            yAxisLabelWidth={8}
            disableScroll
            onlyPositive
            yAxisThickness={false}
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
        </View>

        <View style={styles.containerTableView}>
          <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Lastest Users</Text>
          </View>
          <View style={styles.header}>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Avatar</Text>
            </View>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Name</Text>
            </View>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Joined at</Text>
            </View>
          </View>
          <FlatList
            data={latestUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderItemUser}
            //scrollEnabled={false} // Tắt hiệu ứng lướt
          />
        </View>

        <View style={styles.containerTableView}>
          <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Top Authors</Text>
          </View>
          <View style={styles.header}>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Avatar</Text>
            </View>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Author</Text>
            </View>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Posts</Text>
            </View>
            <View style={styles.headercontainer}>
              <Text style={styles.heading}>Latest Post</Text>
            </View>
          </View>
          <FlatList
            data={usersMostPost}
            keyExtractor={(item) => item._id}
            renderItem={renderItemPost}
            //scrollEnabled={false} // Tắt hiệu ứng lướt
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor: "#1A3461",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
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
    color: "black",
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
  containerTableView: {
    marginTop: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  head: { height: 44, backgroundColor: "darkblue" },
  /////////////////
  headercontainer: {
    flex: 1,
    alignItems: "center",
    elevation: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    padding: 9,
  },
  ///////////////////////
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
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  heading: { flex: 1, fontSize: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: { width: 5, height: 7 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 40,
  },
});
