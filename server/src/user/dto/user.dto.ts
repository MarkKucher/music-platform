export class UserDto {
  name;
  email;
  picture;
  listenedTracks;
  likedTracks;
  likedComments;
  albums;
  id;
  isActivated;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.picture = model.picture;
    this.listenedTracks = model.listenedTracks;
    this.likedTracks = model.likedTracks;
    this.likedComments = model.likedComments;
    this.albums = model.albums;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}
