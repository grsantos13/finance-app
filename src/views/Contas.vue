<template>
  <div class="mr-5">
    <navigation-panel title="CONTA BANCÁRIA" :search="true" @filter="filter">
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
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                @click="dialog = true"
                color="blue"
                dark
                fixed
                bottom
                right
                fab
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Adicionar conta</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="300px">
          <v-card>
            <v-card-title>
              <span class="headline">Cadastrar Contas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field 
                      v-model="conta.nome"
                      name="nome"
                      id="nome"
                      type="text"
                      label="Nome"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="blue lighten-1" text @click="dialog = false">Fechar</v-btn>
              <v-btn color="blue lighten-1" text @click="save()">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
    dialog: false,
    conta: {
      nome: null
    }
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http
        .get("/contas")
        .then(response => {
          this.contas = response.data
          this.showContas = response.data
        });
    },
    filter: function(query) {
      this.showContas = this.contas.filter(conta => {
        return conta.nome.toLowerCase().includes(query.toLowerCase());
      });
    },
    save: function(){
      this.$http.post("/contas", this.conta)
        .then(() => {
          this.refresh();
          this.conta = {
            nome: null
          }
          this.dialog = false;
        });
    }
  }
};
</script>
