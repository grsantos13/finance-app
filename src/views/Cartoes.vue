<template>
  <navigation-panel title="CARTÕES" :search="true" @filter="filter">
    <div class="mr-5">
      <v-card
        outlined
        elevation="2"
        class="mx-auto"
        height="83vh"
        width="800px"
        tile
      >
        <v-card-text>
          <v-row>
            <v-col cols="12" class="mx-auto">
              <v-data-table
                dense
                :headers="headers"
                :items="showCartoes"
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
            <span>Adicionar cartão</span>
          </v-tooltip>
        </v-card-text>
      </v-card>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Cadastrar Cartões</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="cartao.nome"
                    name="nome"
                    autofocus
                    id="nome"
                    type="text"
                    label="Nome"
                  />
                  <v-text-field
                    v-model="cartao.diaVencimento"
                    name="diaVencimento"
                    id="diaVencimento"
                    type="number"
                    label="Dia vencimento"
                    min="1"
                    max="31"
                  />
                  <v-text-field
                    v-model="cartao.diaFechamento"
                    name="diaFechamento"
                    id="diaFechamento"
                    type="number"
                    label="Dia fechamento"
                    min="1"
                    max="31"
                  />
                  <v-checkbox
                    v-model="cartao.mesVencimentoMesmoFechamento"
                    label="Mês fechamento mesmo do vencimento"
                  ></v-checkbox>
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
  name: "Cartoes",
  translation: new TranslationUtils(),
  components: {
    NavigationPanel
  },
  data: () => ({
    date: new DateUtils(),
    translation: new TranslationUtils(),
    headers: [
      { text: "Nome", value: "nome", align: "center" },
      {
        text: "Fechamento no mês do vencimento",
        value: "mesVencimentoMesmoFechamento",
        align: "center"
      },
      { text: "Dia vencimento", value: "diaVencimento", align: "center" },
      { text: "Dia fechamento", value: "diaFechamento", align: "center" },
      { text: "Ações", value: "actions", sortable: false, align: "center" }
    ],
    cartoes: [],
    showCartoes: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
    dialog: false,
    cartao: {
      nome: null,
      diaVencimento: null,
      diaFechamento: null,
      mesVencimentoMesmoFechamento: false
    }
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http
        .get("/cartoes")
        .then(response => {
          this.cartoes = response.data.map(cartao => {
            cartao.mesVencimentoMesmoFechamento = this.translation.translate(
              cartao.mesVencimentoMesmoFechamento,
              "bool"
            );
            return cartao;
          });
        })
        .then(() => {
          this.showCartoes = this.cartoes;
        });
    },
    filter: function(query) {
      this.showCartoes = this.cartoes.filter(cartao => {
        return cartao.nome.toLowerCase().includes(query.toLowerCase());
      });
    },
    save: function() {
      this.$http.post("/cartoes", this.cartao).then(() => {
        this.refresh();
        this.cartao = {
          nome: null,
          diaVencimento: null,
          diaFechamento: null,
          mesVencimentoMesmoFechamento: false
        };
        this.dialog = false;
      });
    }
  }
};
</script>
