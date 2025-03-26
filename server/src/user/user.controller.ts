import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import ApiError from '../exceptions/auth-error';
import { CLIENT } from '../utils';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/getUserIdByEmail/:email')
  async getUserIdByEmail(@Param('email') email, @Res() res) {
    try {
      const id = await this.userService.getUserIdByEmail(email);
      console.log(id);
      return res.json(id);
    } catch (err) {
      if (err instanceof ApiError) {
        return res
          .status(err.status)
          .json({ message: err.message, errors: err.errors });
      }
      return res.status(500).json({ message: 'Unhandled error' });
    }
  }

  @Post('/registration')
  async registration(@Body() dto: CreateUserDto, @Res() res) {
    try {
      const userData = await this.userService.registration(dto);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json(userData);
    } catch (err) {
      if (err instanceof ApiError) {
        return res
          .status(err.status)
          .json({ message: err.message, errors: err.errors });
      }
      return res.status(500).json({ message: 'Unhandled error' });
    }
  }

  @Post('/login')
  async login(@Body() dto, @Res() res) {
    try {
      const { email, password } = dto;
      const userData = await this.userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      if (err instanceof ApiError) {
        return res
          .status(err.status)
          .json({ message: err.message, errors: err.errors });
      }
      return res.status(500).json({ message: 'Unhandled error' });
    }
  }

  @Post('/logout')
  async logout(@Req() req, @Res() res) {
    try {
      const { refreshToken } = req.cookies;
      const token = await this.userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/activate/:link')
  async activate(@Param('link') link, @Res() res) {
    try {
      await this.userService.activate(link);
      return res.redirect(CLIENT);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/passwordForgot/:email/:hash')
  async redirect(@Res() res, @Param('email') email, @Param('hash') hash) {
    try {
      await this.userService.redirectedToPassword(email, hash);
      res.redirect(`${CLIENT}/user/settings`);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/passwordCheck')
  passwordCheck() {
    return this.userService.passwordCheck();
  }

  @Get('/refresh')
  async refresh(@Req() req, @Res() res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userData = await this.userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
      });
      return res.json(userData);
    } catch (err) {
      if (err instanceof ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors });
      }
      return res.status(500).json({ message: 'Unhandled error' });
    }
  }

  @Post('/changeUsername/:id')
  changeUsername(@Body() body, @Param('id') id) {
    const { username } = body;
    return this.userService.changeUsername(id, username);
  }

  @Post('/verifyPassword/:id')
  verifyPassword(@Body() body, @Param('id') id) {
    const { password } = body;
    return this.userService.verifyPassword(id, password);
  }

  @Post('/forgotPassword')
  forgotPassword(@Body() dto) {
    return this.userService.forgotPassword(dto);
  }

  @Post('/changePassword/:id')
  changePassword(@Body() body, @Param('id') id) {
    const { password } = body;
    return this.userService.changePassword(id, password);
  }

  @Post('/user/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  changeIcon(@UploadedFiles() files, @Param('id') id) {
    const { picture } = files;
    return this.userService.updatePicture(id, picture[0]);
  }

  @Post('/setDefaultPicture/:id')
  setDefaultPicture(@Param('id') id) {
    return this.userService.setDefaultPicture(id);
  }

  @Post('/pushLikedTrack/:id/:trackId')
  pushLikedTrack(@Param('trackId') trackId, @Param('id') userId) {
    return this.userService.pushLikedTrack(userId, trackId);
  }

  @Post('/removeLikedTrack/:id/:trackId')
  removeLikedTrack(@Param('trackId') trackId, @Param('id') userId) {
    return this.userService.removeLikedTrack(userId, trackId);
  }

  @Post('/pushListenedTrack/:id/:trackId')
  pushListenedTrack(@Param('trackId') trackId, @Param('id') userId) {
    return this.userService.pushListenedTrack(userId, trackId);
  }

  @Get('/users')
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get('/user/:id')
  getOne(@Param('id') id) {
    return this.userService.getOneUser(id);
  }
}
