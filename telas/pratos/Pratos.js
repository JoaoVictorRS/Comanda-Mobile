import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Card, Dialog, FAB, IconButton, MD3DarkTheme, Portal, Text } from 'react-native-paper'

const Pratos = ({ navigation }) => {

  const [prato, setPratos] = useState([])
  const [idExcluir, setIdExcluir] = useState(0)

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, [])
  );

  function carregarDados() {
    AsyncStorage.getItem('prato').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setPratos(resultado)
    })
  }

  function confirmarExclusao(id) {
    setIdExcluir(id)
    setVisible(true)
  }

  function excluir() {
    prato.splice(idExcluir, 1)
    AsyncStorage.setItem('prato', JSON.stringify(prato))
    carregarDados()
    setVisible(false)
  }

  return (
    <>

      <ScrollView style={{ padding: 15 }}>
        {prato.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 20 }}>Não há pratos cadastrados</Text>
        ) : (
          prato.map((item, i) => (
            <Card key={i} mode='outlined' style={{ marginBottom: 10 }}>
              <Card.Content>
                <Text style={{ marginBottom: '2%', fontWeight: 'bold' }} variant="titleLarge">{item.nome}</Text>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Igredientes: {item.igredientes}</Text>
              </Card.Content>
              <Card.Actions>
                <Text style={{ marginEnd: '40.5%', fontWeight: 'bold' }} variant="bodyLarge">Preço: <Text style={{ color: 'green' }}>{item.preco}</Text></Text>
                <IconButton
                  icon='pencil-outline'
                  onPress={() => navigation.push('pratos-form', { id: i, prato: item })}
                  iconColor='black'
                />
                <IconButton
                  icon='trash-can-outline'
                  onPress={() => confirmarExclusao(i)}
                  style={{ backgroundColor: '#FF512C' }}
                  iconColor='black'
                />
              </Card.Actions>
            </Card>
          ))
        )}

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Text variant="bodyMedium">Deseja realmente excluir o registro?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={excluir}>Sim</Button>
              <Button onPress={hideDialog}>Não</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </ScrollView>

      <FAB
        icon="plus"
        size='small'
        style={{ position: 'absolute', right: 10, bottom: 10 }}
        onPress={() => navigation.push('pratos-form')}
      />

    </>
  )
}

export default Pratos