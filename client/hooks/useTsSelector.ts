import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../store/reducers";


export const useTsSelector: TypedUseSelectorHook<RootState> = useSelector