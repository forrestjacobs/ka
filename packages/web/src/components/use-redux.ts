import { createUseMapState, useActionCreators } from "@epeli/redux-hooks";
import * as allActions from "../actions";
import { RootState } from "../state";

type RemoveReturnTypes<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any) => any
    ? (...args: Parameters<T[K]>) => void
    : never
};

export const useMapState = createUseMapState<RootState>();

export function useActions(): RemoveReturnTypes<typeof allActions> {
  return useActionCreators(allActions);
}
