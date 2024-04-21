import * as PlayerActionCreators from "../action-creators/player"
import * as UserActionCreators from "../action-creators/user"
import * as SelectedAlbumsActionCreators from "../action-creators/selectedAlbums"
import * as PlayNextActionCreators from "../action-creators/playNext"

export default {
    ...PlayerActionCreators,
    ...UserActionCreators,
    ...SelectedAlbumsActionCreators,
    ...PlayNextActionCreators
}

