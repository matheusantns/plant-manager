import React from 'react';
import {
    SafeAreaView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight;
import { Button } from '../components/Button';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import { useNavigation, useRoute } from '@react-navigation/core';

interface Params {
    title: string;
    subtitle: string;
    buttonTitle: string;
    icon: 'smile' | 'hug';
    nextScreen: string;
}

const emojis = {
    hug: '🤗',
    smile: '😄'
}

export function Confirmation() {

    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        subtitle,
        buttonTitle,
        icon,
        nextScreen
    } = routes.params as Params;

    function handleStart() {
        navigation.navigate(nextScreen)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>
                    {emojis[icon]}
                </Text>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>
                <View style={styles.footer}>
                    <Button
                        title={buttonTitle}
                        onPress={handleStart}
                    />
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    content: {
        padding: 50
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.heading,
        textAlign: 'center',
        color: colors.heading,
        lineHeight: 38,
        marginVertical: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize: 17,
        paddingHorizontal: 20,
        color: colors.heading
    },
    emoji: {
        fontSize: 96,
        textAlign: 'center',
        marginVertical: 15
    },
    footer: {
        marginTop: 30,
        paddingHorizontal: '10%'
    }
})
