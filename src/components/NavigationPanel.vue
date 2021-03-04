<template>
  <v-app>
    <v-app-bar color="primary" app clipped-left clipped-right dark>
      <v-toolbar-title>STUDIO CAROL</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="drawer = !drawer" title="Notificações" icon>
        <v-badge
          v-if="notifications > 0"
          color="secondary"
          :content="notifications"
          overlap
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app clipped permanent bottom>
      <v-list nav dense>
        <v-list-item to="/">
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/entradas">
          <v-list-item-icon><v-icon>mdi-cash</v-icon></v-list-item-icon>
          <v-list-item-title>Entradas</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-app-bar color="transparent" bottom absolute>
        <v-list nav dense>
          <v-list-item>
            <v-list-item-icon><v-icon>mdi-power</v-icon></v-list-item-icon>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-app-bar>
    </v-navigation-drawer>
    <v-card-text style="min-height: 0;">
      <v-main>
        <slot />
      </v-main>
    </v-card-text>
  </v-app>
</template>
<script>
export default {
  name: "NavigationPanel",
  data: () => ({
    notifications: []
  })
};
</script>
<style scoped>
.menu-icon {
  width: auto;
}
.user {
  font-size: 13px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  margin-top: 1px;
  color: white;
}
.gradient {
  background-image: linear-gradient(#1976d2, #2196f3);
}
</style>
