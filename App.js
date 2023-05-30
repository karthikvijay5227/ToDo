import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard, Image, ScrollView } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Orientation from 'react-native-orientation-locker';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // useEffect(() => {
  //   Orientation.lockToPortrait(); // Locks the app to portrait mode
  //   loadTasksFromStorage();
  //   return () => {
  //     Orientation.unlockAllOrientations(); // Unlocks all orientations when the component is unmounted
  //   };
  // }, []);


  useEffect(() => {
    saveTasksToStorage();
  }, [taskItems]);

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks !== null) {
        setTaskItems(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Error loading tasks from storage:', error);
    }
  };

  const saveTasksToStorage = async () => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(taskItems));
    } catch (error) {
      console.log('Error saving tasks to storage:', error);
    }
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      Keyboard.dismiss();
      setTaskItems([...taskItems, task]);
      setTask('');
    }
  };

  const completeTask = (index) => {
    const itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <ScrollView style={styles.items}>
          {taskItems.map((item, index) => (
            <View key={index}>
              <Task key={index} text={item} index={index} onCompleteTask={completeTask} />
            </View>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          placeholderTextColor="#bfbfbf"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Image source={require('./assets/plus.png')} style={styles.addImage} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
    maxHeight: '90%', // Adjust the height as needed
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 20, // Adjust the position as needed
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    width: '80%',
    borderWidth: 1,
    color: 'black',
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    color: 'black',
  },
  addImage: {
    width: 30,
    height: 30,
  },
});
