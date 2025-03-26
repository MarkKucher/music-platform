import * as PlayerActionCreators from "./player"
import * as UserActionCreators from "./user"
import * as SelectedAlbumsActionCreators from "./selectedAlbums"
import * as PlayNextActionCreators from "./playNext"

export default {
    ...PlayerActionCreators,
    ...UserActionCreators,
    ...SelectedAlbumsActionCreators,
    ...PlayNextActionCreators
}

