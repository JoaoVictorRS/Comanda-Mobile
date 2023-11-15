import AsyncStorage from '@react-native-async-storage/async-storage'
import { Formik } from 'formik'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { mask } from 'remask'
import pratosValidator from '../../validators/pratosValidator'

const PratosForm = ({ navigation, route }) => {

  let prato = {
    nome: '',
    igredientes: '',
    preco: ''
  }

  const id = route.params?.id

  if (id >= 0) {
    prato = route.params?.prato

  }

  function salvar(dados) {

    AsyncStorage.getItem('prato').then(resultado => {

      const prato = JSON.parse(resultado) || []

      if (id >= 0) {
        prato.splice(id, 1, dados)
      } else {
        prato.push(dados)
      }

      AsyncStorage.setItem('prato', JSON.stringify(prato))

      navigation.goBack()
    })

  }

  return (
    <ScrollView style={{ margin: 15 }}>
      <Text>Informações do Prato</Text>

      <Formik
        initialValues={prato}
        validationSchema={pratosValidator}
        onSubmit={values => salvar(values)}
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
          <View>
            <TextInput
              style={{ marginTop: 10 }}
              mode='outlined'
              label='Nome'
              value={values.nome}
              onChangeText={handleChange('nome')}
            />
            {(errors.nome && touched.nome) &&
              <Text style={{ color: 'red', marginTop: 5 }}>
                {errors.nome}
              </Text>
            }

            <TextInput
              style={{ marginTop: 10 }}
              mode='outlined'
              label='Igredientes'
              value={values.igredientes}
              onChangeText={handleChange('igredientes')}
            />
            {(errors.igredientes && touched.igredientes) &&
              <Text style={{ color: 'red', marginTop: 5 }}>
                {errors.igredientes}
              </Text>
            }

            <TextInput
              style={{ marginTop: 10 }}
              mode='outlined'
              label='Preço'
              value={values.preco}
              onChangeText={(value) => { setFieldValue('preco', mask(value, 'R$ 99,99')) }}
            />
            {(errors.preco && touched.preco) &&
              <Text style={{ color: 'red', marginTop: 5 }}>
                {errors.preco}
              </Text>
            }

            <Button style={{marginTop: '5%'}} mode='contained' onPress={handleSubmit}>Salvar</Button>
          </View>
        )}

      </Formik>

    </ScrollView>
  )
}

export default PratosForm