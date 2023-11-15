import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PratosStack from './telas/pratos/PratosStack';
import PedidoStack from './telas/pedido/PedidoStack';
import HistoricoStack from './telas/historico/HistoricoStack';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Pedidos"
              component={PedidoStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="room-service" size={26} />
                )
              }}
            />
            <Tab.Screen
              name="Pratos"
              component={PratosStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="food" size={26} />
                )
              }}
            />
            <Tab.Screen
              name="Historico"
              component={HistoricoStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="chart-bar" size={26} />
                )
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>

  );
}
