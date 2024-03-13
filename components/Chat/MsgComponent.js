// import moment from 'moment';
import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import TimeDelivery from './TimeDelivery';
import { getAvatarSource } from "../../utils/getImageSource";
// import ImageSize from 'react-native-image-size';

const MsgComponent = (props) => {
    const { sender, item, sendTime } = props;
    return (
        <Pressable
            style={{ marginVertical: 0 }}
        >
            {item.content? (
                <View
                    style={[styles.masBox, {
                        alignSelf: sender ? 'flex-end' : 'flex-start',
                        // borderWidth:1,
                        backgroundColor: sender ? '#3797f0' : '#262626'
                    }]}
                >
                    
                    <Text style={{ paddingLeft: 5, color: 'white', fontSize:12.5 }}>
                        {item.content}
                    </Text>
                    

                    <TimeDelivery
                        sender={sender}
                        item={item}
                    />

                </View>
            ): null}
            {item.media && item.media.map((m, index) => {
                // ImageSize.getSize(m)
                //     .then(({ width, height }) => {
                //     const ratio = width / height;

                    return (
                        <View style={{ maxWidth: '45%', maxHeight: 200 }} key={index}>
                            <Image
                                style={[styles.media, { aspectRatio: 1 }]}
                                source={{ uri: m }}
                            />
                        </View>
                    );
                    // })
                    // .catch(error => {
                    // console.error('Error getting image size:', error);
                    // return null;
                    // });
            })}
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
    media: {
        width: '100%',
        marginTop: 10,
        maxHeight: 200,
        borderRadius: 10,
        resizeMode: 'cover',
        borderColor: "#212121",
        borderWidth: 1,
        marginLeft: 15,
      },
});

export default MsgComponent;