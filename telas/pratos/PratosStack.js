import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Pratos from './Pratos';
import PratosForm from './PratosForm';

const Stack = createNativeStackNavigator();

const PratosStack = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="pratos" component={Pratos} options={{ title: 'Pratos' }} />
        <Stack.Screen name="pratos-form" component={PratosForm} options={{ title: 'Adicionar/Editar Prato' }} />
      </Stack.Navigator>
    </>
  )
}

export default PratosStack