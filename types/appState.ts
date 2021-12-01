import { Modal } from './modals'
import { User } from '@gadget-client/envoy'

export type AppState = {
  modal: null | Modal
  user: null | User
}

export type AppStatePatch =
  | ((state: AppState) => DeepPartial<AppState>)
  | DeepPartial<AppState>

export type AppStateContextType = {
  store: AppState
  update: (patch: AppStatePatch) => void
}
