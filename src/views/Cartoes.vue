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
        </v-card-text>
      </v-card>
    </div>
  </navigation-panel>
</template>
<script>
import NavigationPanel from '../components/NavigationPanel.vue';
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
      { text: "Vencimento", value: "diaVencimento", align: "center" },
      { text: "Fechamento", value: "diaFechamento", align: "center" },
      { text: "Ações", value: "actions", sortable: false, align: "center" }
    ],
    cartoes: [],
    showCartoes: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 8
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
    }
  }
};
</script>
