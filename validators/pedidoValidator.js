import * as Yup from 'yup';

const pedidoValidator = Yup.object().shape({
    nome: Yup.string().strict()
      .max(20, 'Valor muito grande')
      .required('Campo obrigatório'),
  },{ strict: true })

export default pedidoValidator