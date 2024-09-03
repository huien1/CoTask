//home
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button, Text, SafeAreaView, Modal, Alert, TouchableOpacity, Pressable } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import dayjs from 'dayjs';
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateTask from './createTask';
import Icon from 'react-native-vector-icons/Octicons';
import { Swipeable } from 'react-native-gesture-handler';
import notifee from '@notifee/react-native';

var db = openDatabase({ name: 'database.db' });

const Home = ({ navigation }) => {
    const [usersAndTasks, setUsersAndTasks] = useState([]);
    const [completedTasksIndexes, setCompletedTasksIndexes] = useState([]);
    const [points, setPoints] = useState(0);
    const [taskBG, setTaskBG] = useState("white");
    const [modalVisible, setModalVisible] = useState(false);

    var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
    dayjs.extend(isSameOrBefore);


    const updateTaskBGColour = async () => {
        try {
            const value = await AsyncStorage.getItem("@taskBGColour");

            if (value !== null) {
                setTaskBG(value);
            }
        } catch (e) {
            // console.log(e)
            // alert('Failed to fetch the input from storage');
        }
    };

    const refreshData = async () => {

        // in case, async storage limitation
        // await AsyncStorage.clear();
        notificationPremission();

        try {
            const usersAndTasksData = await getTasksandUsersFromDB();
            setUsersAndTasks(usersAndTasksData);
        } catch (error) {
            console.error('Error refreshing data at home page:', error);
        }
        updateTaskBGColour();
        readCompletedTasksIndexes();
    };

    const notificationPremission = async () => {
        await notifee.requestPermission();
    };


    const getTasksandUsersFromDB = async () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Tasks INNER JOIN Users ON Tasks.user_id = Users.user_id', [], (tx, results) => {
                    const tasksData = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        tasksData.push(results.rows.item(i));
                    }
                    resolve(tasksData);
                }, (error) => {
                    reject(error);
                });
            });
        });
    };

    const storeCompletedTasksIndexes = async () => {
        try {
            await AsyncStorage.setItem("@CompletedTasksIndexes", JSON.stringify(completedTasksIndexes));
            // console.log('CompletedTasksIndexes successfully stored')
        } catch (e) {
            // console.log('Failed to store the CompletedTasksIndexes to the storage')
        }
    };

    const readCompletedTasksIndexes = async () => {
        try {
            const value = await AsyncStorage.getItem("@CompletedTasksIndexes");
            if (value !== null) {
                setCompletedTasksIndexes(JSON.parse(value));
            }

        } catch (error) {
            // console.log('Failed to retrieve the CompletedTasksIndexes to the storage')
        }
    };

    const viewTask = (task_id) => {
        navigation.navigate('ViewTask', { task_id });
    };

    const deleteTask = (task_id) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM Tasks WHERE task_id=?',
                [task_id],
            );
        });
        refreshData();
    };

    const completed_score = (due_date) => {
        if (dayjs().isSameOrBefore(dayjs(due_date), "day")) {
            return 50
        }
        else {
            return 0
        }

    };

    useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Tasks'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS Tasks', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Tasks(task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_title VARCHAR(50) NOT NULL, task_note VARCHAR(50) NULL, priority_level VARCHAR(5) NOT NULL, created_timestamp DATETIME NOT NULL, updated_date DATE NULL, due_date DATE NOT NULL, reminder BOOL NOT NULL, reminder_datetime DATETIME NOT NULL, repeat BOOL NOT NULL,repeat_frequency VARCHAR(7) NOT NULL, repeat_start_date DATE NOT NULL, repeat_end_date DATE NULL, attachment_name VARCHAR(255) NULL, attachment_path VARCHAR(255) NULL, completed BOOL NOT NULL, completed_date DATE NOT NULL, task_points INTEGER NOT NULL, user_id INTEGER NOT NULL,  FOREIGN KEY (user_id) REFERENCES Users (user_id))', []
                        );
                    }
                }
            );
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Users'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS Users', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_points INTEGER NOT NULL)',
                            []
                        );
                        txn.executeSql(
                            'INSERT INTO Users (user_points) VALUES (?)',
                            [0],
                        );
                    }
                }
            );
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Rewards'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS Rewards', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Rewards(reward_id INTEGER PRIMARY KEY AUTOINCREMENT, customisation_title VARCHAR(50) NOT NULL, customisation_colour VARCHAR(50) NULL)',
                            []
                        );
                        txn.executeSql(
                            'INSERT INTO Rewards (customisation_title, customisation_colour) VALUES (?,?)',
                            ["taskBGColour", "white"],
                        );
                    }
                }
            );
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Reward_Informations'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS Reward_Informations', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Reward_Informations(info_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, reward_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES Users (user_id) FOREIGN KEY (user_id) REFERENCES Rewards (user_id))',
                            []
                        );
                        txn.executeSql(
                            'INSERT INTO Reward_Informations (user_id, reward_id) VALUES (?,?)',
                            [1, +1],
                        );
                        txn.executeSql(
                            'INSERT INTO Reward_Informations (user_id, reward_id) VALUES (?,?)',
                            [1, +1],
                        );
                    }
                }
            );
        });
        navigation.addListener('focus', refreshData);
    }, []);

    let listItemView = (item) => {
        switch (item.priority_level) {
            case "low":
                task_colour = "#FFE79A"
                break;
            case "medium":
                task_colour = "#FFA952"
                break;
            case "high":
                task_colour = "#EF5A5A"
                break;
            default:
                task_colour = "gray"
        }

        switch (item.completed) {
            case 1:
                task_borderStyle = "solid"
            default:
                task_borderStyle = "dashed"
        }

        return (
            <Swipeable
                friction={2}
                leftThreshold={40}
                rightThreshold={40}
                renderRightActions={() => (
                    <View style={styles.deleteView}>
                        <Icon name="trash" size={30} color={"white"} />
                    </View>
                )}
                onSwipeableRightOpen={() => deleteTask(item.task_id)}
            >

                <View
                    key={item.task_id}
                    style={{ backgroundColor: taskBG, flexDirection: "row", marginBottom: 5, padding: 15, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }}
                    onPress={() => viewTask(item.task_id)}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 50 }}>
                        <CheckBox
                            tintColor={task_colour}
                            onCheckColor={task_colour}
                            onTintColor={task_colour}
                            value={item.completed}
                            disabled={false}
                            animationDuration="0.1"
                            onValueChange={(setSelection) => {
                                if (setSelection) {
                                    setPoints(points + item.task_points + completed_score());
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'UPDATE Tasks set completed_date=?, completed=? where task_id=?',
                                            [dayjs().format("YYYY-MM-DD"), true, item.task_id],
                                        );
                                        tx.executeSql(
                                            'UPDATE Users set user_points=? where user_id=?',
                                            [points + item.task_points + completed_score(), 1],
                                        );
                                    });
                                    // Alert.alert("Points gained:" + item.task_points);
                                    if (!completedTasksIndexes.includes(item.task_id)) {
                                        completedTasksIndexes.push(item.task_id);
                                        setCompletedTasksIndexes(completedTasksIndexes);
                                    }
                                }
                                else {
                                    setPoints(item.user_points - item.task_points - completed_score());
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'UPDATE Tasks set completed_date=?, completed=? where task_id=?',
                                            ["", false, item.task_id],
                                        );
                                        tx.executeSql(
                                            'UPDATE Users set user_points=? where user_id=?',
                                            [item.user_points - item.task_points - completed_score(), 1],
                                        );
                                    });
                                    if (completedTasksIndexes.includes(item.task_id)) {
                                        completedTasksIndexes.pop(item.task_id);
                                        setCompletedTasksIndexes(completedTasksIndexes);
                                    }
                                }
                                storeCompletedTasksIndexes();
                                refreshData();
                            }}
                        />
                    </View>
                    <Pressable style={styles.taskView} onPress={() => viewTask(item.task_id)}>
                        <View>
                            <Text numberOfLines={1} style={styles.titleText}>{item.task_title}</Text>
                            <Text style={{ color: "#787878" }}>On {dayjs(item.due_date).format("dddd, D MMMM YYYY")}</Text>
                        </View>
                        <View style={{ borderStyle: completedTasksIndexes.includes(item.task_id) ? "solid" : "dashed", padding: 5, borderWidth: 1, borderColor: "black" }}>
                            <Text style={[styles.pointsText, { color: task_colour }]}><Icon name="star-fill" size={13} color={task_colour} />{item.task_points + completed_score(item.due_date)}</Text>
                        </View>
                    </Pressable>
                </View>
            </Swipeable>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text style={styles.dateText}>Today: {dayjs().format("dddd, D MMMM")}</Text>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={usersAndTasks}
                        // ItemSeparatorComponent={listViewItemSeparator}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => listItemView(item)}
                    />
                </View>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                        <Text style={styles.text}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Reference 1: Modal - start */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.modalView}>
                        <View style={styles.topView}>
                            <View style={styles.topLeftView} >
                                <Text />
                            </View>
                            <View style={styles.topCenterView}>
                                <Text style={styles.headerText}>Create task</Text>
                            </View>
                            <View style={styles.topRightView}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <CreateTask customClick={() => { setModalVisible(false); refreshData(); }} />
                    </View>
                </Modal>
                {/* Reference 1: Modal - end */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskView: {
        flex: 4, justifyContent: "space-between", alignItems: "center", flexDirection: "row"
    },
    button: {
        backgroundColor: '#a2cffe',
        borderRadius: 50,
        padding: 10,
        elevation: 5,
        width: 50,
        height: 50,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    text: {
        color: '#ffffff',
        fontSize: 24,
    },
    dateText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
        left: 22
    },
    // Reference 1: Modal style - start
    modalView: {
        marginTop: '10%',
        paddingTop: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        height: '100%',
        width: '100%',
    },
    topView: {
        flex: 1,
        flexDirection: 'row',
        maxHeight: 30
    },
    topLeftView: {
        width: '33.33%',
        paddingLeft: 20
    },
    topCenterView: {
        width: '33.33%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topRightView: {
        width: '33.33%',
        alignItems: 'flex-end',
        paddingRight: 20,
        justifyContent: 'center'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelText: {
        fontSize: 15,
        color: 'red',
    },
    // Reference 1: Modal style - end
    pointsText: {
        textShadowColor: "#696969",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    deleteView: {
        flex: 1,
        backgroundColor: "#FF746C",
        marginBottom: 5,
        paddingRight: 15,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    titleText: {
        fontWeight: "bold",
        color: "black",
        width: 200
    }
});

export default Home;

// Reference
// 1. Modal and modal styles
// React Native. (2024) Modal [Online]. Available from: // https://reactnative.dev/docs/modal.html [19 July 2024]





