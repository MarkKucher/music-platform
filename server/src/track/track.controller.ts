import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const { picture, audio } = files;
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Res() res,
  ) {
    return this.trackService.getAll(res);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Delete('/comment/:id')
  deleteComment(@Param('id') id: ObjectId) {
    return this.trackService.deleteComment(id);
  }

  @Post('/comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }

  @Post('/incrementLike/:id')
  incrementLike(@Param('id') id: ObjectId) {
    return this.trackService.incrementLike(id);
  }

  @Post('/decrementLike/:id')
  decrementLike(@Param('id') id: ObjectId) {
    return this.trackService.decrementLike(id);
  }

  @Post('/decrementCommLike/:id/:userId')
  decrementCommLike(
    @Param('id') id: ObjectId,
    @Param('userId') userId: ObjectId,
  ) {
    return this.trackService.decrementCommLike(id, userId);
  }

  @Post('/incrementCommLike/:id/:userId')
  incrementCommLike(@Param('id') id: ObjectId, @Param('userId') userId) {
    return this.trackService.incrementCommLike(id, userId);
  }
}
