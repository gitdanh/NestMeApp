// import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import TimeDelivery from './TimeDelivery';

const MsgComponent = (props) => {
    const { sender, massage, item, sendTime } = props;
    return (
        <Pressable
            style={{ marginVertical: 0 }}
        >
            <View
                style={[styles.masBox, {
                    alignSelf: sender ? 'flex-end' : 'flex-start',
                    // borderWidth:1,
                    backgroundColor: sender ? '#3797f0' : '#262626'
                }]}
            >

                <Text style={{ paddingLeft: 5, color: 'white',fontSize:12.5 }}>
                    {item.message}
                </Text>

                <TimeDelivery
                    sender={sender}
                    item={item}
                />

                

            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    masBox: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        minWidth: 80,
        maxWidth: '80%',
        paddingHorizontal: 10,
        marginVertical: 5,
        paddingTop: 5,
        borderRadius: 8
    },
});

export default MsgComponent;