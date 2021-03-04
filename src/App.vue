<template>
  <v-app>
    <navigation-panel> </navigation-panel>
  </v-app>
</template>

<script>
import NavigationPanel from "./components/NavigationPanel.vue";

export default {
  name: "App",

  components: {
    NavigationPanel
  },

  data: () => ({
    //
  })
};
</script>
