import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Historico from './Historico';

const Stack = createNativeStackNavigator();

const HistoricoStack = () => {
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen name="Historico" component={Historico} options={{ title: 'Historico' }} />
            </Stack.Navigator>
        </>
    )
}

export default HistoricoStack