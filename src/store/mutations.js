import * as types from './mutation-types'

const mutations = {
  [types.SET_IM_CLIENT]: (state, data) => {
    state.imClient = data
  }
}

export default mutations