import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import colors from '../styles/colors';
import userImg from '../assets/matheus.jpg';
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Header() {

    const [userName, setUserName] = useState<string>();

    useEffect(() => {
        async function loadStorageUserName() {
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }
        loadStorageUserName();

    }, [userName]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>
                    Olá,
                </Text>
                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>

            <Image source={userImg} style={styles.userImg} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 35,
        paddingBottom: 10
    },
    userImg: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    greeting: {
        fontSize: 32,
        fontFamily: fonts.text,
        color: colors.heading
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    }
})