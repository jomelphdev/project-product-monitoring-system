export default {
    namespaced: true,
    state() {
      return {
        isDisabled : false // disabled the click of sidebar nav when the page is still loading
      };
    }
}