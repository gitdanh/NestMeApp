//import liraries
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const TimeDelivery = (props) => {
    const { sender, item } = props;
    return (
        <View
            style={[styles.mainView, {
                justifyContent: 'flex-end',
            }]}
        >
            <Text style={{
                fontSize: 7,
                color: sender ? 'white' : 'gray'
            }}>
                {moment(item.createAt).format('LLL')}
            </Text>
                <Icon style={{color: item.seen ? 'black' : 'white' , fontSize: 15, marginLeft: 5}} size={20} name="checkmark-done" />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    }
});

//make this component available to the app
export default TimeDelivery;