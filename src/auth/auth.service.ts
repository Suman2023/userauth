import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from './schemas/auth.schema';
import { Model } from 'mongoose';
import { UserCreationResponse } from './dto/usercreated.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthUser.name) private authUserModel: Model<AuthUser>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(signupDto: SignUpDto): Promise<UserCreationResponse> {
    let response: UserCreationResponse = {
      statusCode: HttpStatus.CREATED,
      message: 'User Created Successfully',
      access_token: '',
    };
    try {
      const { email, password } = signupDto;

      // Check if user exist
      const userExist = await this.authUserModel.findOne({ email: email });
      if (userExist) {
        console.log('This user already exist. Please Login');
        throw new Error('This user already exist. Please Login');
      }

      // Hash the plain password
      const saltRounds = await this.configService.get('saltRounds');
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the auth user
      // TODO: Need a way to revery back the creation on failure someting like session on mongodb
      const newUser = await this.authUserModel.create({
        email: email,
        password: hashedPassword,
      });
      const { _id: userId, email: userEmail } = newUser;
      const profileCreated = await this.userService.createProfile(email);
      if (!profileCreated) {
        throw new Error("Couldn't create profile");
      }
      // Create an access_token
      const payload = { id: userId, email: userEmail };
      response.access_token = await this.jwtService.signAsync(payload);
    } catch (error) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = error.message;
    }
    return response;
  }

  async logIn(userCred: SignUpDto): Promise<UserCreationResponse> {
    let response: UserCreationResponse = {
      statusCode: HttpStatus.FOUND,
      message: 'User Logged In Successfully',
      access_token: '',
    };
    try {
      const { email, password } = userCred;

      const userExist = await this.authUserModel.findOne({ email: email });
      if (!userExist) {
        throw new Error('No such user exist');
      }
      const {
        _id: userId,
        email: userEmail,
        password: hashedPassword,
      } = userExist;
      const isValidCred = await bcrypt.compare(password, hashedPassword);
      if (!isValidCred) {
        throw new Error('Incorrect password');
      }

      const payload = { id: userId, email: userEmail };
      response.access_token = await this.jwtService.signAsync(payload);
    } catch (error) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = error.message;
    }
    return response;
  }
}
