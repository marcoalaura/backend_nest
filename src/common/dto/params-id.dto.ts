import { IsNumberString } from '../validation'

export class ParamIdDto {
  @IsNumberString()
  id: string
}
