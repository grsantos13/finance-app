<template>
  <v-app>
    <v-app-bar color="purple darken-4" app clipped-left clipped-right dark>
      <v-menu bottom tile left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
            <v-list-item-icon
              ><v-icon :color="item.iconColor">{{
                item.icon
              }}</v-icon></v-list-item-icon
            >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="4" class="ml-auto mt-3">
          <v-text-field
            v-if="search"
            v-model="query"
            type="text"
            name="query"
            id="query"
            label="Buscar"
            @keypress.enter="filter(query)"
          />
        </v-col>
      </v-row>
    </v-app-bar>
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
  props: {
    title: String,
    search: Boolean
  },
  data: () => ({
    notifications: [],
    searchInput: true,
    query: null,
    items: [
      { title: "HOME", icon: "mdi-home", iconColor: "white", to: "/" },
      {
        title: "ENTRADAS",
        icon: "mdi-cash-plus",
        iconColor: "success",
        to: "/entradas"
      },
      {
        title: "DESPESAS",
        icon: "mdi-cash-minus",
        iconColor: "error",
        to: "/despesas"
      },
      {
        title: "CATEGORIAS",
        icon: "mdi-shape",
        iconColor: "white",
        to: "/categorias"
      },
      {
        title: "CONTAS BANCÁRIAS",
        icon: "mdi-bank",
        iconColor: "white",
        to: "/contas"
      },
      {
        title: "CARTÕES",
        icon: "mdi-credit-card-settings-outline",
        iconColor: "white",
        to: "/cartoes"
      },
      {
        title: "MOVIMENTAÇÃO MENSAL",
        icon: "mdi-folder-plus",
        iconColor: "white",
        to: "/movimentacao"
      }
    ]
  }),
  methods: {
    filter: function(query) {
      this.$emit("filter", query);
    }
  }
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
