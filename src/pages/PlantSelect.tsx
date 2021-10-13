import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { Header } from '../components/Header'
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Load } from '../components/Load';

import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../libs/storage';
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight;

interface EnvironmentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);

    function handleEnvironmentSelected(environment: string) {
        setEnvironmentSelected(environment);

        if (environment == 'all')
            return setfilteredPlants(plants);

        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setfilteredPlants(filtered);
    }

    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if (!data)
            setLoading(true);

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data])
            setfilteredPlants(oldValue => [...oldValue, ...data]);
        } else {
            setPlants(data);
            setfilteredPlants(data);
        }

        setLoading(false);
        setLoadMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', { plant });
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnvironments([{
                key: 'all',
                title: 'Todos',
            },
            ...data]
            );
        }

        fetchEnvironment();

    }, [])

    useEffect(() => {

        fetchPlants();

    }, [])

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
            </View>

            <View>
                <FlatList
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnvironmentButton
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={() => handleEnvironmentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadMore ?
                            <ActivityIndicator color={colors.green} style={styles.footerloading}></ActivityIndicator>
                            : <></>
                    }
                >

                </FlatList>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
    },
    header: {
        marginHorizontal: 30,
    },
    title: {
        fontFamily: fonts.heading,
        fontSize: 17,
        color: colors.heading,
        marginTop: 15,
        lineHeight: 22,
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        color: colors.heading,
        lineHeight: 22,
    },
    environmentList: {
        height: 40,
        paddingBottom: 5,
        marginLeft: 30,
        marginVertical: 30,
        paddingRight: 30
    },
    plants: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    footerloading: {
        paddingVertical: 20
    }
})