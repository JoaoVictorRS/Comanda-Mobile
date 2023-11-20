import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Card, Dialog, Divider, FAB, IconButton, Portal, Text } from 'react-native-paper'

const Pedido = ({ navigation }) => {

  const [pedido, setPedido] = useState([])
  const [prato, setPrato] = useState([])
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
    AsyncStorage.getItem('pedido').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setPedido(resultado)
    })

    AsyncStorage.getItem('prato').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setPrato(resultado)
    })
  }

  function confirmarExclusao(id) {
    setIdExcluir(id)
    setVisible(true)
  }

  function excluir() {
    pedido.splice(idExcluir, 1)
    AsyncStorage.setItem('pedido', JSON.stringify(pedido))
    carregarDados()
    setVisible(false)
  }

  // Função para extrair o preço de uma string de prato
  function extrairPreco(pratoString) {
    const precoArray = pratoString.split(' - R$ ');
    if (precoArray.length === 2) {
      return parseFloat(precoArray[1].replace(',', '.')); // Retorna o preço convertido para float
    }
    return 0; // Retorna 0 se o preço não for encontrado
  }

  function calcularTotalItem(prato) {
    let totalItem = 0;
    prato.forEach(nomePrato => {
      totalItem += extrairPreco(nomePrato);
    });
    return totalItem;
  }

  const finalizarPedido = (index) => {
    const pedidoFinalizado = pedido[index];

    // Captura a hora atual ao finalizar o pedido
    const horaAtual = new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Adiciona a hora de finalização ao pedido antes de movê-lo para o histórico
    pedidoFinalizado.dataHoraFinalizado = horaAtual;

    AsyncStorage.getItem('historico').then(historico => {
      historico = JSON.parse(historico) || [];
      historico.push(pedidoFinalizado);
      AsyncStorage.setItem('historico', JSON.stringify(historico)).then(() => {
        pedido.splice(index, 1);
        AsyncStorage.setItem('pedido', JSON.stringify(pedido)).then(() => {
          carregarDados(); // Atualiza a exibição após a remoção
        });
      });
    });
  };

  return (
    <>
      <ScrollView style={{ padding: 15 }}>
        {pedido.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 20 }}>Não há pedidos</Text>
        ) : (
          pedido.map((item, i) => (
            <Card key={i} mode='outlined' style={{ marginBottom: 10 }}>
              <Card.Content>
                <Text variant="titleLarge" style={{ marginBottom: '2%' , fontWeight: 'bold'}}>{item.nome}</Text>
                <Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>Refeições:</Text>
                <Divider style={{ marginBottom: '1%', marginTop: '1%' }} />
                {item.prato.map((nomePrato, i) => (
                  <View key={i}>
                    <Text>{nomePrato}</Text>
                  </View>
                ))}
                {item.observacoes ? (
                  <View>
                    <Text variant='bodyLarge' style={{ fontWeight: 'bold', color: '#EE3333', marginTop: '2%' }}>Observações: <Text variant='bodyMedium'>{item.observacoes}</Text></Text>
                  </View>
                ) : null}

                <Divider style={{ marginBottom: '1%', marginTop: '1%' }} />
                <Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>Criado: <Text>{item.dataHora}</Text></Text>
                <Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>Total: <Text style={{ color: 'green', fontWeight: 'bold' }}>R$ {`${calcularTotalItem(item.prato).toFixed(2)}`}</Text></Text>
              </Card.Content>
              
              <Card.Actions>
                <IconButton
                  icon='pencil-outline'
                  onPress={() => navigation.push('pedido-form', { id: i, pedido: item })}
                  iconColor='black'
                />
                <IconButton
                  icon='trash-can-outline'
                  onPress={() => confirmarExclusao(i)}
                  style={{ backgroundColor: '#FF512C' }}
                  iconColor='black'
                />
                <IconButton
                  icon='check'
                  onPress={() => finalizarPedido(i)}
                  style={{ backgroundColor: '#48FE43' }}
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

      {prato.length === 0 ? (
        <></>
      ) : (
        <FAB
        icon="plus"
        size='small'
        style={{ position: 'absolute', right: 10, bottom: 10 }}
        onPress={() => navigation.push('pedido-form')}
      />
      )}
    </>
  )
}

export default Pedido