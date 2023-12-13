import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema, AuthUser } from './schemas/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        global: true,
        signOptions: { expiresIn: configService.get('jwt.expiry') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
