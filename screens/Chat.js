import React, {useState}  from 'react';
import { View, FlatList, StatusBar, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const listData = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://images.pexels.com/photos/2811087/pexels-photo-2811087.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: 'Hey there, how are you?',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: 'Where are you?',
  },
  {
    name: 'Jenifar Lawrence',
    avatar_url:
      'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg',
    subtitle: 'I am good, how are you?',
  },
  {
    name: 'Tom Holland',
    avatar_url:
      'https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600',
    subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
  {
    name: 'Robert',
    avatar_url:
      'https://expertphotography.b-cdn.net/wp-content/uploads/2020/05/male-poses-squint.jpg',
    subtitle: 'Where does it come from?',
  },
  {
    name: 'downey junior',
    avatar_url:
      'https://www.apetogentleman.com/wp-content/uploads/2018/06/male-models-marlon.jpg',
    subtitle: 'Where can I get some?',
  },
  {
    name: 'Ema Watson',
    avatar_url:
      'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
    subtitle: 'I am good, how are you?',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: ' If you use this site regularly and would like to help keep the site',
  },
  {
    name: 'Jenifar Lawrence',
    avatar_url:
      'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg',
    subtitle: 'Why do we use it?',
  },
  {
    name: 'Tom Holland',
    avatar_url:
      'https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600',
    subtitle: ' If you use this site regularly and would like to help keep the site',
  },
];
function Chat() {
  const [search, setSearch] = useState('')
    const navigation = useNavigation();
  
    const renderItems = ({ item }) => {
      return (
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => navigation.navigate('SingleChat', { data: item })}
        >
          <Avatar source={{ uri: item.avatar_url }} rounded title={item.name} size="medium" />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    };
  
    const navigateToAllUser = () => {
      navigation.navigate('AllUser');
    };
  
    return (
      <View style={styles.container}>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <IconMaterialCommunityIcons color={"white"} size={30} name="keyboard-backspace" style={{marginRight: 10}} />
              <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> duongw</Text>
            </View>
              
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon color={"white"} size={25} name="plus-square" style={{marginRight: 10}} />
                <IconFeather color={"white"} size={25} name="menu" />
            </View>
          </View>
        </View>
        <View
          style={{ 
              elevation: 5,
              // height: 60,
              flexDirection:'row',
              alignItems:'center',
              paddingVertical:7,
              marginBottom: 10,
              justifyContent:'space-evenly'
          }}
        >
          <TextInput
            style={{
                backgroundColor: 'rgb(38, 38, 38)',
                width:'90%',
                borderRadius:25,
                borderWidth:0.5,
                borderColor: 'black',
                padding: 5,
                paddingHorizontal: 20,
                color: 'white',
            }}
            placeholder = "Searching.."
            placeholderTextColor = {'white'}
            multiline = {true}
            value={search}
            onChangeText={(val)=>setSearch(val)}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={listData}
          renderItem={renderItems}
        />
        <TouchableOpacity style={styles.button} onPress={navigateToAllUser}>
          <Icon color="#fff" size={20} name="users" />
        </TouchableOpacity>
      </View>
    );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: StatusBar.currentHeight || 0,
    },
    listItem: {
      paddingVertical: 8,
      marginVertical: 0,
      backgroundColor: '#000',
    },
    name: {
      fontSize: 14,
      color: '#fff',
    },
    subtitle: {
      fontSize: 12,
      color: '#fff',
    },
    button: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
});
  
  export default Chat;
