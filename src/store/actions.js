import * as types from './mutation-types'

export default {
  setIMClient({ commit }, data){
    commit(types.SET_IM_CLIENT, data)
  }
}