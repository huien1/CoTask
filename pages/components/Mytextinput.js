import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const Mytextinput = (props) => {
  return (
    <View
      style={{
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor="gray"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={[props.style, {marginLeft: 10}]}
        blurOnSubmit={false}
        defaultValue={props.defaultValue}
        autoFocus={props.autoFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#A9A9A9",
    fontSize: 13,
    marginLeft: 10,
    marginTop: 10
  }
});

export default Mytextinput;