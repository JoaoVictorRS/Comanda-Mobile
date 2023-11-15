import AsyncStorage from '@react-native-async-storage/async-storage'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { Picker } from 'react-native'
import pedidoValidator from '../../validators/pedidoValidator'

const PedidoForm = ({ navigation, route }) => {

  let pedido = {
    nome: '',
    prato: [],
    observacoes: ''
  }

  const [prato, setPratos] = useState([])

  const id = route.params?.id

  if (id >= 0) {
    pedido = route.params?.pedido

  }

  useEffect(() => {
    AsyncStorage.getItem('prato').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setPratos(resultado)
    })
  }, [])

  const getCurrentDateTime = () => {
    const currentDateTime = new Date();

    const formattedDate = `${String(currentDateTime.getDate()).padStart(2, '0')}/${String(currentDateTime.getMonth() + 1).padStart(2, '0')}/${currentDateTime.getFullYear()
      }`;

    const formattedTime = `${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')
      }`;

    return `${formattedTime} - ${formattedDate}`;
  };

  function salvar(dados) {
    const pedidoComDataHora = { ...dados, dataHora: getCurrentDateTime() };

    AsyncStorage.getItem('pedido').then(resultado => {
      const pedido = JSON.parse(resultado) || [];

      if (id >= 0) {
        pedido.splice(id, 1, pedidoComDataHora);
      } else {
        pedido.push(pedidoComDataHora);
      }

      AsyncStorage.setItem('pedido', JSON.stringify(pedido));

      navigation.goBack();
    });
  }

  return (
    <ScrollView style={{ margin: 15 }}>
      <Text>Informações do Pedido</Text>

      <Formik
        initialValues={pedido}
        validationSchema={pedidoValidator}
        onSubmit={values => salvar(values)}
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
          <View>
            <TextInput
              style={{ marginTop: 10, marginBottom: 15 }}
              label='Nome ou mesa'
              mode='outlined'
              value={values.nome}
              onChangeText={handleChange('nome')}
            />
            {(errors.nome && touched.nome) &&
              <Text style={{ color: 'red', marginTop: 5 }}>
                {errors.nome}
              </Text>
            }

            <Picker
              selectedValue={values.prato_id}
              onValueChange={pratoId => setFieldValue('prato_id', pratoId)}
            >
              <Picker.Item label="Escolha um Prato" value="" />
              {prato.map((item, i) => (
                <Picker.Item
                  key={i}
                  label={`${item.nome} - ${item.preco}`}
                  value={item.id}
                />
              ))}
            </Picker>

            <Button
              style={{ marginTop: 15, marginBottom: 15 }}
              mode='outlined'
              onPress={() => {
                if (values.prato_id) {
                  setFieldValue('prato', [...values.prato, values.prato_id]);
                  setFieldValue('prato_id', ''); // Reseta o valor do prato selecionado
                }
              }}
            >
              Adicionar Prato
            </Button>

            <TextInput
              style={{ marginBottom: 15 }}
              label='Observações'
              mode='outlined'
              value={values.observacoes}
              onChangeText={handleChange('observacoes')}
            />

            <Button onPress={handleSubmit} mode='contained'>Salvar</Button>

          </View>
        )}
      </Formik>

    </ScrollView>
  )
}

export default PedidoForm