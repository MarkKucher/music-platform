export interface playNextState {
    shouldPlayNext: boolean;
}

export enum playNextActionTypes {
    SetShouldPlay = 'SetShouldPlay',
    SetShouldNotPlay = 'SetShouldNotPlay'
}

interface ShouldPlayAction {
    type: playNextActionTypes.SetShouldPlay
}

interface ShouldNotPlayAction {
    type: playNextActionTypes.SetShouldNotPlay
}

export type playNextAction = ShouldPlayAction | ShouldNotPlayAction;