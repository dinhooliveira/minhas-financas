
import React,{useEffect} from 'react';
import HomeScreen from './screens/Home/HomeScreen';
import ReceitaCreateScreen from './screens/Receita/ReceitaCreateScreen';
import ReceitaListScreen from './screens/Receita/ReceitaListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { color } from './resource/const/Color';
import DatabaseInit from './database/databaseInit';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(()=>{
    new DatabaseInit()},
    []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Minhas Finanças',
            headerTintColor: color.white,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: color.primary,
            }
          }}
        />
         <Stack.Screen name="receita_lista" component={ReceitaListScreen}
          options={{
            title: 'Minhas Receitas',
            headerTintColor: color.white,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: color.primary,
            }

          }}
        />
        <Stack.Screen name="receita" component={ReceitaCreateScreen}
          options={{
            title: 'Nova Receita',
            headerTintColor: color.white,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: color.primary,
            }

          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}