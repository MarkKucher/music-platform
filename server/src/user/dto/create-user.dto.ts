import { IsEmail } from 'class-validator';

export class CreateUserDto {
  readonly name;
  @IsEmail()
  readonly email;
  readonly password;
}
