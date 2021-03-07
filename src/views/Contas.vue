<template>
  <div class="mr-5">
    <navigation-panel title="CONTA BANCÁRIA" :search="true">
      <v-card
        outlined
        elevation="2"
        class="mx-auto"
        height="83vh"
        width="500px"
        tile
      >
        <v-card-text>
          <v-row>
            <v-col cols="12" class="mx-auto">
              <v-data-table
                dense
                :headers="headers"
                :items="showContas"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                @page-count="pageCount = $event"
              >
                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="filter(item)"
                        v-bind="attrs"
                        v-on="on"
                        icon
                        color="green"
                      >
                        <v-icon small>
                          mdi-check
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Ativar / Desativar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="300px"> </v-dialog>
      </v-row>
    </navigation-panel>
  </div>
</template>
<script>
import NavigationPanel from '../components/NavigationPanel.vue';
export default {
  components: { NavigationPanel },
  name: "Contas",
  data: () => ({
    headers: [
      { text: "Conta", value: "nome", align: "center" },
      { text: "Ações", value: "actions", sortable: false, align: "center" }
    ],
    contas: [],
    showContas: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
    dialog: false
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http
        .get("/contas")
        .then(response => {
          this.contas = response.data.map(conta => {
            conta.nome = conta.nome.replace("_", " ");
            return conta;
          });
        })
        .then(() => {
          this.showContas = this.contas;
        });
    },
    filter: function(query) {
      this.showContas = this.contas.filter(conta => {
        return conta.nome.toLowerCase().includes(query.toLowerCase());
      });
    }
  }
};
</script>
