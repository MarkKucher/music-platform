import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schema/track.schema';
import { Comment, CommentDocument } from './schema/comment.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';
import { User, UserDocument } from '../user/schema/user.schema';
import { UserDto } from '../user/dto/user.dto';
import { Album, AlbumDocument } from '../album/schema/album.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({
      ...dto,
      likes: 0,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async getAll(res, count = 10, offset = 0) {
    const tracks = await this.trackModel
      .find()
      .skip(Number(offset))
      .limit(Number(count));
    const allTracks = await this.trackModel.find();
    return res.json({ tracks, allTracks });
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(id)
      .populate({ path: 'comments' });
    return track;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    this.fileService.deleteFile(track.picture);
    this.fileService.deleteFile(track.audio);
    const albums = await this.albumModel.find();
    const changedAlbums = [];
    albums.map(async (alb) => {
      alb.tracks.map(async (trackId) => {
        if (trackId == track._id) {
          changedAlbums.push(alb);
        }
      });
    });
    await Promise.all(
      changedAlbums.map(async (alb) => {
        alb.tracks.filter((Id) => Id != track._id);
        await alb.save();
      }),
    );
    track.comments.map(async (commId) => {
      await this.commentModel.findByIdAndDelete(commId);
    });
    return track._id;
  }

  async deleteComment(id: ObjectId) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    const track = await this.trackModel.findById(comment.track);
    const index = track.comments.indexOf(comment._id);
    if (index != -1) {
      track.comments.splice(index, 1);
      await track.save();
    }
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({
      username: dto.username,
      text: dto.text,
      track: dto.trackId,
      userId: dto.userId,
      likes: 0,
    });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }

  async incrementLike(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.likes += 1;
    track.save();
  }

  async decrementLike(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.likes -= 1;
    track.save();
  }

  async incrementCommLike(id: ObjectId, userId: ObjectId) {
    const comment = await this.trackModel.findById(id);
    comment.likes += 1;
    await comment.save();
    const user = await this.userModel.findById(userId);
    user.likedComments.push(comment._id);
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async decrementCommLike(id: ObjectId, userId: ObjectId) {
    const comment = await this.trackModel.findById(id);
    comment.likes -= 1;
    await comment.save();
    const user = await this.userModel.findById(userId);
    const index = user.likedComments.indexOf(comment._id);
    if (index != -1) {
      user.likedComments.splice(index, 1);
    }
    await user.save();
    const userDto = new UserDto(user);
    return { user: userDto };
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }
}
