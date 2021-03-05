<template>
  <v-app>
    <navigation-panel>
      <router-view></router-view>
    </navigation-panel>
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
