import { Controller, Post, Body, Res, HttpStatus, HttpException, Get, Param } from '@nestjs/common';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/create')
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            const newUser = await this.userService.create(createUserDto);
            return newUser;
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Get('/username')
    async findByUsername(@Param('username') username: string) {
        try {
            const user = await this.userService.findByUsername(username);
            return user;
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Post('/forgot_password')
    async recoverPassword(@Body() recoverPasswordDTO: RecoverPasswordDto, @Res() res: any) {
        try {
              await this.userService.recoverPassword(recoverPasswordDTO);
              return res.status(HttpStatus.OK).send({ message: 'Uma senha temporária foi enviada para o seu email' });
        } catch (error) {
            throw new HttpException(error.message || error.response, error.status);
    }
}

}
