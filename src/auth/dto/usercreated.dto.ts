import { BaseResponse } from 'src/common/dto/baseresponse.dto';

export class UserCreationResponse extends BaseResponse {
  access_token: string;
}
