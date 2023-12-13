import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_.-])[A-Za-z\d!@#$%^&*()_.-]*$/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  @IsString()
  password: string;
}
