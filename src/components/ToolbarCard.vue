<template>
  <v-toolbar :color="color" :dark="dark">
    <v-toolbar-title>{{ label }}</v-toolbar-title>
    <v-spacer />
    <input
      v-if="searchInput"
      style="background-color: #FFF; border: 1px solid #CCC"
      type="text"
      name="query"
      id="query"
      v-model="query"
      placeholder="Buscar"
      class="pa-1"
      @keypress.enter="filter(query)"
    />
  </v-toolbar>
</template>
<script>
export default {
  name: "ToolbarCard",
  data: () => ({
    query: null
  }),
  props: {
    label: String,
    color: String,
    dark: Boolean,
    searchInput: Boolean
  },
  methods: {
    filter: function(query) {
      this.$emit("filter", query);
    }
  }
};
</script>
