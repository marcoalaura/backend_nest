import { IsUUID } from '../validation'

export class ParamUuidDto {
  @IsUUID()
  id: string
}
