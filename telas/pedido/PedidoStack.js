import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Pedido from './Pedido';
import PedidoForm from './PedidoForm';

const Stack = createNativeStackNavigator();

const PedidoStack = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="pedido" component={Pedido} options={{ title: 'Pedidos' }} />
        <Stack.Screen name="pedido-form" component={PedidoForm} options={{ title: 'Adicionar/Editar Pedido' }} />
      </Stack.Navigator>
    </>
  )
}

export default PedidoStack