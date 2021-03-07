<template>
  <navigation-panel title="ENTRADAS" :search="true" @filter="filter">
    <div class="mr-5">
      <v-card outlined elevation="2" height="83vh" tile>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            :items="entradas"
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
  name: "Entradas",
  components: {
    NavigationPanel
  },
  data: () => ({
    date: new DateUtils(),
    translation: new TranslationUtils(),
    headers: [
      { text: "Categoria", value: "categoria.nome" },
      { text: "Descrição", value: "descricao" },
      { text: "Pagamento", value: "formaDePagamento" },
      { text: "Valor", value: "valor" },
      { text: "Conta", value: "conta.nome" },
      { text: "Data", value: "realizadaEm" },
      { text: "Status", value: "status" },
      { text: "Ações", value: "actions", sortable: false }
    ],
    entradas: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 10
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http.get("/entradas?orderBy=realizadaEm,DESC").then(response => {
        if (!response.data.empty) {
          this.entradas = response.data.content.map(entrada => {
            entrada.fixa = this.translation.translate(entrada.fixa, "bool");
            entrada.conta.nome = entrada.conta.nome.replace("_", " ");
            entrada.realizadaEm = this.date.convertDate(entrada.realizadaEm);
            entrada.valorVariavel = this.translation.translate(
              entrada.valorVariavel,
              "bool"
            );
            entrada.valor = this.$curr.format(entrada.valor, {
              locale: "pt-BR"
            });
            return entrada;
          });
        }
      });
    },
    filter: function(query) {
      alert(query);
    }
  }
};
</script>
