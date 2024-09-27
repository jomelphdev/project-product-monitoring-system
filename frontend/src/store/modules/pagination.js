export default {
    namespaced: true,
    state() {
      return {
        pageNumber : 1,
        paginateValue : 10,
        searchItem : ''
      };
    },
}