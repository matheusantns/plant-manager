import React from 'react';
import {
    SafeAreaView,
    Text,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
const statusBarHeight = Constants.statusBarHeight;

import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/core';

export function Welcome() {
    const navigation = useNavigation();

    function handleStart() {
        navigation.navigate('UserIdentification')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Gerencie{'\n'}
                suas plantas de{'\n'}
                forma fácil
            </Text>

            <Image
                style={styles.image}
                source={wateringImg}
                resizeMode="contain"
            />

            <Text style={styles.subtitle}>
                Não esqueça mais de regar suas plantas.
                Nós cuidamos de lembrar você sempre que precisar.
            </Text>

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.6}
                onPress={handleStart}
            >

                <Feather
                    name="chevron-right"
                    style={styles.buttonIcon}
                />

            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
        marginHorizontal: 55,
        marginVertical: 35
    },
    title: {
        fontSize: 28,
        lineHeight: 34,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: colors.heading,
        fontFamily: fonts.text
    },
    image: {
        height: Dimensions.get('window').width * 0.7
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.white,
        borderRadius: 16,
        height: 56,
        width: 56
    },
    buttonIcon: {
        fontSize: 32,
        color: colors.white
    }
})