import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { Token, TokenDocument } from '../schema/token.schema';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { TokenService } from './token.service';
import { UserDto } from '../dto/user.dto';
import { SendMailService } from './send-mail-servise/send-mail.service';
import { Track, TrackDocument } from '../../track/schema/track.schema';
import { FileService, FileType } from '../../file/file.service';
import { Album, AlbumDocument } from '../../album/schema/album.schema';
import ApiError from '../../exceptions/auth-error';
import { HOST } from '../../utils';
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

let redirected = false;

eventEmitter.on('redirected', () => {
  redirected = true;
});

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private tokenService: TokenService,
    private sendMailService: SendMailService,
    private fileService: FileService,
  ) {}

  async getUserIdByEmail(email) {
    const candidate = await this.userModel.findOne({ email });
    if (!candidate) {
      throw ApiError.BadRequest(`User with email '${email}' is not registered`);
    }
    return candidate.id;
  }

  async registration(dto: CreateUserDto) {
    const { email, name, password } = dto;
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email '${email}' is already exist`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      activationLink,
      likedTracks: [],
      listenedTracks: [],
      picture: Math.floor(Math.random() * 16777215).toString(16),
      likedComments: [],
      albums: [],
    });
    await this.sendMailService.sendConfirmMail(
      email,
      `${HOST}/api/activate/${activationLink}`,
    );
    const favoriteAlbum = await this.albumModel.create({
      user: user._id,
      title: 'Favorite tracks',
      tracks: [],
      favorite: true,
    });
    user.albums.push(favoriteAlbum);
    await user.save();
    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await this.userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Wrong activation link');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Wrong email');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Wrong password');
    }
    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.BadRequest('No refresh token');
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    const user = await this.userModel.findById(userData.id);

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async changeUsername(id, username) {
    const user = await this.userModel.findById(id);
    user.name = username;
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async verifyPassword(id, password) {
    const user = await this.userModel.findById(id);
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error('Wrong password');
    }
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async forgotPassword(dto) {
    const {email} = dto;
    let hash = await bcrypt.hash(email, 3)

    hash = hash.replace(/\//g, "slash");

    await this.sendMailService.forgotPasswordMail(
      email,
      `${HOST}/api/passwordForgot/${email}/${hash}`,
    );
  }

  async redirectedToPassword(email, hash) {
    const shouldPass = await bcrypt.compare(email, hash.replace(/slash/g, "/"))

    if(!shouldPass) {
      throw new Error('wrong link')
    }

    eventEmitter.emit('redirected');
  }

  passwordCheck() {
    if (redirected) {
      redirected = false;
      return true;
    } else {
      return false;
    }
  }

  async changePassword(id, password) {
    const user = await this.userModel.findById(id);
    const hashedPassword = await bcrypt.hash(password, 4);
    user.password = hashedPassword;
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async updatePicture(userId, picture) {
    const user = await this.userModel.findById(userId);
    if(user.picture.includes('/')) {
      this.fileService.deleteFile(user.picture)
    }
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    user.picture = picturePath;
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async setDefaultPicture(userId) {
    const user = await this.userModel.findById(userId);
    if(user.picture.includes('/')) {
      this.fileService.deleteFile(user.picture)
    }
    user.picture = `${Math.floor(Math.random() * 16777215).toString(16)}`;
    user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async pushLikedTrack(userId, trackId) {
    const user = await this.userModel.findById(userId);
    user.likedTracks.push(trackId);
    await user.save();
    let favoriteAlbum;
    await Promise.all(
      user.albums.map(async (albId) => {
        const alb = await this.albumModel.findById(albId);
        if (alb.favorite) {
          favoriteAlbum = alb;
        }
      }),
    );
    favoriteAlbum.tracks.push(trackId);
    await favoriteAlbum.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async removeLikedTrack(userId, trackId) {
    const user = await this.userModel.findById(userId);
    const index = user.likedTracks.indexOf(trackId);
    if (index > -1) {
      user.likedTracks.splice(index, 1);
    } else {
      throw new Error('no such liked track');
    }
    let favoriteAlbum;
    await Promise.all(
      user.albums.map(async (albId) => {
        const alb = await this.albumModel.findById(albId);
        if (alb.favorite) {
          favoriteAlbum = alb;
        }
      }),
    );
    favoriteAlbum.tracks = favoriteAlbum.tracks.filter((id) => id != trackId);
    await favoriteAlbum.save();
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async pushListenedTrack(userId, trackId) {
    const user = await this.userModel.findById(userId);
    user.listenedTracks.push(trackId);
    await user.save();
    const userData = new UserDto(user);
    return { user: userData };
  }

  async getOneUser(id) {
    const user = await this.userModel.findById(id);
    const userData = new UserDto(user);
    return { user: userData };
  }
}
