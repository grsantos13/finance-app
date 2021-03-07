<template>
  <navigation-panel title="DESPESAS" :search="true" @filter="filter">
    <div class="mr-5">
      <v-card outlined elevation="2" height="83vh" tile>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            :items="saidas"
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
import NavigationPanel from "../components/NavigationPanel.vue";
import DateUtils from "../utils/dateUtils";
import TranslationUtils from "../utils/translationUtils";

export default {
  name: "Saidas",
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
      { text: "Data", value: "realizadaEm" },
      { text: "Status", value: "status" },
      { text: "Ações", value: "actions", sortable: false }
    ],
    saidas: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 10
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http.get("/despesas?orderBy=realizadaEm,DESC").then(response => {
        if (!response.data.empty) {
          this.saidas = response.data.content.map(despesa => {
            despesa.fixa = this.translation.translate(despesa.fixa, "bool");
            if (despesa.conta != undefined) {
              despesa.conta.nome = despesa.conta.nome.replace("_", " ");
            } else {
              despesa.conta = { nome: "N/A" };
            }
            despesa.realizadaEm = this.date.convertDate(despesa.realizadaEm);
            despesa.valorVariavel = this.translation.translate(
              despesa.valorVariavel,
              "bool"
            );

            despesa.valor = this.$curr.format(despesa.valor, {
              locale: "pt-BR"
            });

            var filtroStatusRealizado = despesa.transacoes.filter(transacao => {
              return transacao.status != "REALIZADO";
            });

            var filtroStatusPendente = despesa.transacoes.filter(transacao => {
              return transacao.status == "PENDENTE";
            });

            if (filtroStatusRealizado.length > 0) {
              if (filtroStatusPendente.length > 0) despesa.status = "PENDENTE";
              else despesa.status = "PLANEJADO";
            } else {
              despesa.status = "REALIZADO";
            }

            return despesa;
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
