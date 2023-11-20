import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Card, Dialog, Divider, IconButton, Portal, Text } from 'react-native-paper'

const Historico = ({ navigation }) => {

  const [historico, setHistorico] = useState([])
  const [totalGeral, setTotalGeral] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, [])
  );

  function carregarDados() {
    AsyncStorage.getItem('historico').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setHistorico(resultado)
      calcularTotalGeral(resultado)
    })
  }

  function confirmarExclusaoTodos() {
    setShowConfirmation(true);
  }

  function excluir(id) {
    historico.splice(id, 1)
    AsyncStorage.setItem('historico', JSON.stringify(historico))
    carregarDados()
  }

  function extrairPreco(pratoString) {
    const precoArray = pratoString.split(' - R$ ');
    if (precoArray.length === 2) {
      return parseFloat(precoArray[1].replace(',', '.')); // Retorna o preço convertido para float
    }
    return 0; // Retorna 0 se o preço não for encontrado
  }

  
  function limparHistorico() {
    AsyncStorage.removeItem('historico');
    setHistorico([]);
    setTotalGeral(0);
    setShowConfirmation(false);
  }
  
  function calcularTotalItem(prato) {
    let totalItem = 0;
    prato.forEach(nomePrato => {
      totalItem += extrairPreco(nomePrato);
    });
    return totalItem;
  }
  
  function calcularTotalGeral(historico) {
    let total = 0;
    historico.forEach((item) => {
      total += calcularTotalItem(item.prato);
    });
    setTotalGeral(total);
  }
  
  
  return (
    <>
      <ScrollView style={{ padding: 15 }}>
        {historico.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 25, marginTop: 10 }}>
            <Button mode="outlined" onPress={confirmarExclusaoTodos}>Limpar Histórico</Button>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              Total Geral: <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 20 }}>R$ {totalGeral.toFixed(2)}</Text>
            </Text>
          </View>
        )}
        {historico.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: '50%', fontSize: 20 }}>Historico Limpo</Text>
        ) : (
          historico.map((item, i) => (
            <Card key={i} mode='outlined' style={{ marginBottom: 10 }}>
              <Card.Content>
                <Text variant="titleLarge" style={{ marginBottom: '2%', fontWeight: 'bold' }}>{item.nome}</Text>
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
                <Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>Finalizado: <Text>{item.dataHoraFinalizado}</Text></Text>
                <Text variant='bodyLarge' style={{ fontWeight: 'bold' }}>Total: <Text style={{ color: 'green', fontWeight: 'bold' }}>R$ {`${calcularTotalItem(item.prato).toFixed(2)}`}</Text></Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon='trash-can-outline'
                  onPress={() => excluir(i)}
                  style={{ backgroundColor: '#FF512C' }}
                  iconColor='black'
                />
              </Card.Actions>
            </Card>
          ))
        )}

        <Portal>
          <Dialog visible={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
            <Dialog.Title>Confirmação</Dialog.Title>
            <Dialog.Content>
              <Text>Deseja realmente apagar todo o histórico?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => limparHistorico()}>Sim</Button>
              <Button onPress={() => setShowConfirmation(false)}>Não</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView >
    </>
  )
}

export default Historico