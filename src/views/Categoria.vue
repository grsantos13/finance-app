<template>
  <navigation-panel title="CATEGORIAS" :search="true" @filter="filter">
    <div class="mr-5">
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
                :items="showCategorias"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                @page-count="pageCount = $event"
              >
                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="item.status == 'REALIZADO'"
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
            <span>Adicionar categoria</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Cadastrar Categorias</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="categoria.nome"
                    name="nome"
                    autofocus
                    id="nome"
                    type="text"
                    label="Nome"
                  />
                  <v-checkbox v-model="categoria.umaPorMes" label="Mensal" />
                  <v-radio-group v-model="categoria.movimento" row>
                    <v-radio
                      v-for="movimento in movimentos"
                      :key="movimento"
                      :label="movimento"
                      :value="movimento"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue lighten-1" text @click="dialog = false"
              >Fechar</v-btn
            >
            <v-btn color="blue lighten-1" text @click="save()">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </navigation-panel>
</template>
<script>
import NavigationPanel from "../components/NavigationPanel.vue";
import DateUtils from "../utils/dateUtils";
import TranslationUtils from "../utils/translationUtils";

export default {
  name: "Categorias",
  translation: new TranslationUtils(),
  components: {
    NavigationPanel
  },
  data: () => ({
    date: new DateUtils(),
    translation: new TranslationUtils(),
    headers: [
      { text: "Categoria", value: "nome", align: "center" },
      { text: "Mensal", value: "umaPorMes", align: "center" },
      { text: "Tipo", value: "movimento", align: "center" },
      { text: "Ações", value: "actions", sortable: false, align: "center" }
    ],
    dialog: false,
    categorias: [],
    showCategorias: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
    movimentos: ["ENTRADA", "DESPESA"],
    categoria: {
      nome: null,
      umaPorMes: false,
      movimento: null
    }
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http
        .get("/categorias?movimentos=ENTRADA,DESPESA")
        .then(response => {
          this.categorias = response.data.map(categoria => {
            categoria.umaPorMes = this.translation.translate(
              categoria.umaPorMes,
              "bool"
            );
            return categoria;
          });
        })
        .then(() => {
          this.showCategorias = this.categorias;
        });
    },
    filter: function(query) {
      this.showCategorias = this.categorias.filter(categoria => {
        return categoria.nome.toLowerCase().includes(query.toLowerCase());
      });
    },
    save: function() {
      this.$http.post("/categorias", this.categoria).then(() => {
        this.refresh();
        this.categoria = {
          nome: null,
          umaPorMes: false,
          movimento: null
        };
        this.dialog = false;
      });
    }
  }
};
</script>
