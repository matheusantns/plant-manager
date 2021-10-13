import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Platform, Alert } from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';

import waterdrop from '../assets/waterdrop.png';

import Constants from 'expo-constants';
import { FlatList } from 'react-native-gesture-handler';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
const statusBarHeight = Constants.statusBarHeight;


export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja removar a ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😢',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => oldData.filter((item) => item.id !== plant.id));

                    } catch (error) {
                        Alert.alert('Não foi possível remover')
                    }
                }
            }
        ])

    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Regue sua ${plantsStoraged[0].name} daqui ${nextTime}`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageData();

    }, [])

    if (loading)
        return (
            <View style={styles.containerLoad}>
                <Load />
                <Text style={styles.textLoad}>Você ainda não tem plantas</Text>
            </View>
        )

    return (
        <View style={styles.container}>

            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWatered}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => { handleRemove(item) }} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? statusBarHeight + 15 : 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        backgroundColor: colors.background,
    },
    spotlight: {
        width: '100%',
        backgroundColor: colors.blue_light,
        marginVertical: 15,
        marginHorizontal: 30,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60,
        marginRight: 15
    },
    spotlightText: {
        flex: 1,
        fontFamily: fonts.text,
        fontSize: 15,
        lineHeight: 23,
        color: colors.blue,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 25
    },
    containerLoad: {
        flex: 1,
    },
    textLoad: {
        paddingBottom: 200,
        fontFamily: fonts.text,
        fontSize: 17,
        color: colors.heading,
        textAlign: 'center'

    }
});