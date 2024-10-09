export const state = () => ({
  activated: false,
});

export const mutations = {
  activate(state) {
    state.activated = true;
  },
};
