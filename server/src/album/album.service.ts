import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../track/schema/track.schema';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Album, AlbumDocument } from './schema/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  async getUserAlbums(id: ObjectId) {
    const albums = await this.albumModel.find({ user: id });
    return albums;
  }

  async getAlbumTracks(id) {
    const tracks = [];
    const album = await this.albumModel.findById(id);
    await Promise.all(
      album.tracks.map(async (trackId) => {
        tracks.push(await this.trackModel.findById(trackId));
      }),
    );
    return tracks;
  }

  async getOneAlbum(id: ObjectId) {
    const album = this.albumModel.findById(id);
    return album;
  }

  async create(dto) {
    const { title, userId } = dto;
    const album = await this.albumModel.create({
      title,
      user: userId,
      tracks: [],
      favorite: false,
    });
    const user = await this.userModel.findById(dto.userId);
    user.albums.push(album._id);
    await user.save();
    return album;
  }

  async addTrack(albumId: ObjectId, trackId: ObjectId) {
    const album = await this.albumModel.findById(albumId);
    const track = await this.trackModel.findById(trackId);
    album.tracks.push(track._id);
    await album.save();
    return album;
  }

  async removeTrack(albumId: ObjectId, trackId: ObjectId) {
    const album = await this.albumModel.findById(albumId);
    const track = await this.trackModel.findById(trackId);
    const index = album.tracks.indexOf(track._id);
    if (index != -1) {
      album.tracks.splice(index, 1);
      await album.save();
    }
  }

  async changeTitle(albumId: ObjectId, newTitle) {
    const album = await this.albumModel.findById(albumId);
    album.title = newTitle;
    await album.save();
    return album;
  }

  async deleteAlbum(id) {
    const album = await this.albumModel.findByIdAndDelete(id);
    const user = await this.userModel.findById(album.user);
    const index = user.albums.indexOf(album._id);
    if (index != -1) {
      user.albums.splice(index, 1);
      await user.save();
      return { user, album };
    } else {
      throw new Error('some error occured during deleting album');
    }
  }
}
