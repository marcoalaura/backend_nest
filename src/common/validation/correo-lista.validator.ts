import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import { ValidationMessageEnum } from './i18n/es.enum'
import { Configurations } from '../params'

export const IS_CORREO_LISTA = 'correoLista'

export function correoLista(value?: string | null): boolean {
  const nameEmail = value?.substring(0, value?.lastIndexOf('@'))
  const domainEmail = value?.substring(value?.lastIndexOf('@') + 1)
  return domainEmail && nameEmail
    ? !Configurations.BLACK_LIST_EMAILS.some((domain) => domainEmail === domain)
    : false
}

export function CorreoLista(
  validationsOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'CORREO_LISTA',
      constraints: [],
      validator: {
        validate: (value): boolean => correoLista(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.CORREO_LISTA,
          validationsOptions
        ),
      },
    },
    validationsOptions
  )
}
