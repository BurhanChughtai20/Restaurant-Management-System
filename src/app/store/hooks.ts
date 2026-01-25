// store/hooks.ts
import { 
  TypedUseSelectorHook, 
  useDispatch, 
  useSelector,
  shallowEqual 
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useShallowSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector, shallowEqual);

type SelectorFunction<T = unknown> = (state: RootState) => T;

type SelectorMap = Record<string, SelectorFunction>;

type SelectorResults<T extends SelectorMap> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export const useBatchSelector = <T extends SelectorMap>(
  selectors: T
): SelectorResults<T> => {
  return useSelector((state: RootState) => {
    const result = {} as SelectorResults<T>;
    let key: keyof T;
    for (key in selectors) {
      if (Object.prototype.hasOwnProperty.call(selectors, key)) {
        result[key] = selectors[key](state) as ReturnType<T[typeof key]>;
      }
    }
    return result;
  }, shallowEqual);
};

type SelectorTuple = readonly SelectorFunction[];

type TupleResults<T extends SelectorTuple> = {
  [K in keyof T]: T[K] extends SelectorFunction<infer R> ? R : never;
};

export const useAppSelectors = <T extends SelectorTuple>(
  ...selectors: T
): TupleResults<T> => {
  return useSelector((state: RootState) => {
    return selectors.map(selector => selector(state)) as TupleResults<T>;
  }, shallowEqual);
};