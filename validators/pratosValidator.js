import * as Yup from 'yup';

const pratosValidator = Yup.object().shape({
    nome: Yup.string().strict()
      .min(2, 'Valor muito curto')
      .max(40, 'Valor muito grande')
      .required('Campo obrigatório'),
    igredientes: Yup.string()
    .required('Campo obrigatorio'),
    preco: Yup.string().strict()
    .required('Campo obrigatorio'),
  },{ strict: true })

export default pratosValidator