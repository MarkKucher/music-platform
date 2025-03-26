import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ObjectId } from 'mongoose';

@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('/:id')
  getAllByUser(@Param('id') id) {
    return this.albumService.getUserAlbums(id);
  }

  @Get('/getAlbumTracks/:id')
  getAlbumTracks(@Param('id') id) {
    return this.albumService.getAlbumTracks(id);
  }

  @Get('/one/:id')
  getOneAlbum(@Param('id') id) {
    return this.albumService.getOneAlbum(id);
  }

  @Post('/create')
  create(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }

  @Post('/changeTitle/:id')
  setNewTitle(@Body() dto, @Param('id') id: ObjectId) {
    const { title } = dto;
    return this.albumService.changeTitle(id, title);
  }

  @Post('/addTrack/:albumId/:trackId')
  pushTrack(
    @Param('albumId') albumId: ObjectId,
    @Param('trackId') trackId: ObjectId,
  ) {
    return this.albumService.addTrack(albumId, trackId);
  }

  @Post('/removeTrack/:albumId/:trackId')
  removeTrack(
    @Param('albumId') albumId: ObjectId,
    @Param('trackId') trackId: ObjectId,
  ) {
    return this.albumService.removeTrack(albumId, trackId);
  }

  @Delete('/:id')
  delete(@Param('id') id: ObjectId) {
    return this.albumService.deleteAlbum(id);
  }
}
