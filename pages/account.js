//account
import React, { useState, useEffect, useRefresh } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Button, Text, View, SafeAreaView, Alert, TouchableHighlight } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Octicons';

var db = openDatabase({ name: 'database.db' });

export default Account = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hiddenIndexes, setHiddenIndexes] = useState([0]);
  const [taskBGColours, setTaskBGColours] = useState([]);

  // const taskBGColours = [];

  const taskBGColourOptions = [
    { colour: "white", backgroundColor: "white", borderColor: "#A9A9A9", points: 1000 },
    { colour: "orange", backgroundColor: "#FEC89A", borderColor: "#FEC89A", points: 1000 },
    { colour: "pink", backgroundColor: "#FFC8DD", borderColor: "#FFC8DD", points: 1000 },
    { colour: "blue", backgroundColor: "#A2CFFE", borderColor: "#A2CFFE", points: 1000 },
    { colour: "purple", backgroundColor: "#CDB4DB", borderColor: "#CDB4DB", points: 1000 },
  ];

  const refreshData = async () => {
    readTaskBGOptionIndex();
    readHiddenIndex();

    try {
      const users = await retrieveUsersFromDB();
      setUsers(users);
      const rewards = await retrieveRewardsFromDB();
      setRewards(rewards);
    } catch (error) {
      console.error('Error refreshing data at account page:', error);
    }
  };

  const retrieveUsersFromDB = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Users WHERE user_id=1', [], (tx, results) => {
          const users = [];
          for (let i = 0; i < results.rows.length; ++i) {
            users.push(results.rows.item(i));
          }
          resolve(users);
        }, (error) => {
          reject(error);
        });
      });
    });
  };

  const retrieveRewardsFromDB = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Rewards', [], (tx, results) => {
          const rewards = [];
          for (let i = 0; i < results.rows.length; ++i) {
            rewards.push(results.rows.item(i));
          }
          resolve(rewards);
        }, (error) => {
          reject(error);
        });
      });
    });
  };

  useEffect(() => {

    navigation.addListener('focus', refreshData);
    db.transaction((tx) => {
      tx.executeSql(
        'SElECT * FROM Users WHERE user_id=1',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setUsers(temp);
        }
      );
    });
  });

  const storeHiddenIndex = async () => {
    try {
      await AsyncStorage.setItem("@HiddenIndex", JSON.stringify(hiddenIndexes));
      // console.log('HiddenIndex successfully stored')
    } catch (e) {
      // console.log('Failed to store the HiddenIndex to the storage')
    }
  };

  const readHiddenIndex = async () => {
    try {
      const value = await AsyncStorage.getItem("@HiddenIndex");
      if (value !== null) {
        setHiddenIndexes(JSON.parse(value));
      }

    } catch (error) {
      // console.log('Failed to retrieve the HiddenIndex to the storage')
    }
  };

  const storeTaskBGOptionIndex = async (index) => {
    setSelectedIndex(index);
    try {
      await AsyncStorage.setItem("@TaskBGOptionIndex", index.toString())
      // console.log('TaskBGOptionIndex successfully stored')
    } catch (e) {
      // console.log('Failed to store the TaskBGOptionIndex to the storage')
    }
  };

  const readTaskBGOptionIndex = async () => {
    try {
      const value = await AsyncStorage.getItem("@TaskBGOptionIndex");
      setSelectedIndex(parseInt(value));
      if (value !== null) {
        setSelectedIndex(parseInt(value));
      }
      else {
        setSelectedIndex(0);
      }

    } catch (error) {
      // console.log('Failed to retrieve the TaskBGOptionIndex to the storage')
    }
  };

  const change_task_BG_colour = async (colour) => {
    try {
      await AsyncStorage.setItem("@taskBGColour", colour)
    } catch (e) {
      alert('Failed to store task background colour')
    }
  };

  const redeem_reward = (index, name, colour, points) => {
    for (i in rewards) {
      if (!taskBGColours.includes(rewards[i].customisation_colour)) {
        setTaskBGColours([...taskBGColours, rewards[i].customisation_colour]);
      }
    };

    if (taskBGColours.includes(colour)) {
      storeTaskBGOptionIndex(index);
      change_task_BG_colour(colour);
    }
    else {
      if (users[0].user_points >= points && !(hiddenIndexes.includes(index))) {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE Users set user_points=? where user_id=?',
            [users[0].user_points - points, (users[0].user_id).toString()],
          );
          tx.executeSql(
            'INSERT INTO Rewards (customisation_title, customisation_colour) VALUES (?,?)',
            [name, colour],
          );
          tx.executeSql(
            'INSERT INTO Reward_Informations (user_id, reward_id) VALUES (?,?)',
            [1, +1],
          );
        });
        taskBGColours.push(colour);
        setTaskBGColours([...taskBGColours, colour]);
        hiddenIndexes.push(index);
        setHiddenIndexes(hiddenIndexes);
        storeHiddenIndex();
        change_task_BG_colour(colour);
        storeTaskBGOptionIndex(index);
      }
      else if (users[0].user_points <= points && hiddenIndexes.includes(index)) {
        change_task_BG_colour(colour);
        storeTaskBGOptionIndex(index);
      }
      else {
        Alert.alert("Cannot redeem! Insufficient points.");
      }
    }
  };

  let listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.2,
          width: '100%',
          backgroundColor: '#808080'
        }}
      />
    );
  };

  let listItemView = (item) => {
    return (
      <View
        key={item.user_id}
        style={{ backgroundColor: 'white', padding: 20 }}>
        <Text>Id: {item.user_id}</Text>
        <Text>My points: <Icon name="star-fill" size={13} color="black" />{item.user_points} </Text>

        <View style={styles.divisor}>
          <Text>Task Background Color</Text>
          <View style={styles.fiveRows}>
            {taskBGColourOptions.map((option, index) => (
              <View key={index} style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => redeem_reward(index, "taskBGColour", option.backgroundColor, option.points)}
                  style={[
                    {
                      backgroundColor: option.backgroundColor,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: selectedIndex === index ? 'black' : option.borderColor,
                      padding: 25,
                    },
                  ]}
                />
                {hiddenIndexes.includes(index) ? null : (
                  <Text style={{ marginTop: 5 }}><Icon name="star-fill" size={13} color="black" />{option.points}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.divisor}>
          <Text>Surprise coming soon...</Text>
        </View>
      </View>

    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={users}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  divisor: {
    marginTop: 10,
    flexDirection: 'column',
    borderTopColor: 'black',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  fiveRows: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    backgroundColor: "white",
    borderColor: 'black',
  }
});


