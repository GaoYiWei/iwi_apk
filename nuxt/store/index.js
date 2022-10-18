export const state = () => ({
    user: { account: null, pwd: null, depart: null },
    inventory: {}
})

export const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
    setInventory(state, payload) {
        state.inventory = payload
    }
}