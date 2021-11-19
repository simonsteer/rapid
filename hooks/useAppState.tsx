import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import u from 'updeep'
import { AppState, AppStateContextType, AppStatePatch } from 'types'

const DEFAULT_APP_STATE: AppState = {
  modal: null,
  count: 0,
}

const AppStateContext = createContext<AppStateContextType>({
  store: DEFAULT_APP_STATE,
  update(patch) {
    console.log('Empty update fn', patch)
  },
})

export const AppStateProvider = ({
  children = null,
  initialValue = DEFAULT_APP_STATE,
}: {
  children?: React.ReactNode
  initialValue?: Partial<AppState>
}) => {
  const [store, _update] = useState({ ...DEFAULT_APP_STATE, ...initialValue })
  const update = useCallback(
    (patch: AppStatePatch) => {
      const changes = typeof patch === 'function' ? patch(store) : patch
      const { ...nextState } = u(changes, store)

      // we do this imperative mutation here because updeep strips non-serializable values, but we may have a
      // modal which accepts something like a callback function as one of its props, for example. We apply modal
      // updates after our call to updeep to ensure such values still get passed to the modal component.
      if ('modal' in changes) {
        nextState.modal = changes.modal
      }

      _update(nextState)
    },
    [_update, store]
  )

  return (
    <AppStateContext.Provider value={{ store, update }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const { store, update } = useContext(AppStateContext)
  return useMemo(() => [store, update] as const, [store, update])
}

export function useUpdateAppState() {
  const update = useAppState()[1]
  return useMemo(() => update, [update])
}

export function useSelectAppState<ReturnValue extends any>(
  selector: (state: AppState) => ReturnValue,
  getMemoizationValue = (r => r) as (value: ReturnValue) => any
) {
  const [store] = useAppState()
  const result = selector(store)
  const memoized = getMemoizationValue(result)

  return useMemo(() => result, [memoized])
}
