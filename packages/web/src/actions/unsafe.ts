import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

export type UnsafeDispatch = ThunkDispatch<any, any, AnyAction>;
