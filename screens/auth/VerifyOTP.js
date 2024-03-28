import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import useHttpClient from "../../axios/public-http-hook";
export default function VerifyOTP({ navigation, route }) {
    const pulicHttpRequest = useHttpClient();
    const [otp, setOTP] = useState('');
    const { formData } = route.params;

    const handleVerifyOTP = async () => {
        if (otp === '') {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }
        const formWithOTP = { ...formData, otp };
        try {
        
            const response = await pulicHttpRequest.publicRequest(
                "/auth/signup",
                "post",
                formWithOTP,
                { headers: { "Content-type": "application/json" } }
            );
            
            console.log('Registration successful:', response.data);
            navigation.navia('Login');
        } catch (error) {
            //console.error('Error registering:', error);
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };

    const handleCancel = () => {
        console.log('Cancel button pressed');
        navigation.replace('Register');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Please enter OTP:</Text>
            <TextInput
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
                onChangeText={text => setOTP(text)}
                value={otp}
                keyboardType="numeric"
            />
            <Button title="Verify OTP" onPress={handleVerifyOTP} />
            <Button title="Cancel" onPress={handleCancel} />
        </View>
    );
};
