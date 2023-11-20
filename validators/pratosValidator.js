import * as Yup from 'yup';

const pratosValidator = Yup.object().shape({
    nome: Yup.string().strict()
      .min(2, 'Valor muito curto')
      .max(40, 'Valor muito grande')
      .required('Informe o nome do prato'),
    igredientes: Yup.string()
    .required('É necessario informar os ingredientes'),
    preco: Yup.string().strict()
    .required('Informe um preço'),
  },{ strict: true })

export default pratosValidator