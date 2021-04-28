<template>
  <navigation-panel title="MOVIMENTAÇÕES MENSAIS" :search="false">
    <v-row no-gutters>
      <v-col cols="6" xl="12">
        <v-card
          outlined
          elevation="2"
          class="mx-auto"
          height="83vh"
          max-width="500px"
          tile
        >
          <v-card-title>
            <span class="headline">Entradas</span>
          </v-card-title>
          <v-card-text>
            <v-divider />
            <div v-for="entrada in entradas" :key="entrada.id">
              <div
                style="display: grid; grid-gap: 50px; grid-template-columns: 25% 25%;"
              >
                <div style="margin-top: 25px">
                  {{ entrada.categoria.nome }}:
                </div>
                <v-text-field
                  :disabled="!entrada.valorVariavel"
                  v-model="entrada.valor"
                />
              </div>
              <div style="width: 70%; margin-top: 20px" class="mx-auto">
                <v-divider />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" xl="12">
        <v-card
          outlined
          elevation="2"
          class="mx-auto"
          height="83vh"
          max-width="500px"
          tile
        >
          <v-card-title>
            <span class="headline">Despesas</span>
          </v-card-title>
          <v-card-text>
            <v-divider />
            <div v-for="despesa in despesas" :key="despesa.id">
              <div
                style="display: grid; grid-gap: 50px; grid-template-columns: 25% 25%;"
              >
                <div style="margin-top: 25px">
                  {{ despesa.categoria.nome }}:
                </div>
                <v-text-field
                  :disabled="despesa.valorVariavel == 'NÃO'"
                  v-model="despesa.valor"
                />
              </div>
              <div style="width: 70%" class="mx-auto">
                <v-divider />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </navigation-panel>
</template>
<script>
import NavigationPanel from "../components/NavigationPanel.vue";
import DateUtils from "../utils/dateUtils";
import TranslationUtils from "../utils/translationUtils";

export default {
  name: "MovimentacaoMensal",
  components: {
    NavigationPanel
  },
  data: () => ({
    entradas: [],
    despesas: [],
    date: new DateUtils(),
    translation: new TranslationUtils()
  }),
  mounted: function() {
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.$http.get("/entradas/fixas").then(response => {
        this.entradas = response.data.map(entrada => {
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
      });

      this.$http.get("/despesas/fixas").then(response => {
        this.despesas = response.data.map(despesa => {
          despesa.fixa = this.translation.translate(despesa.fixa, "bool");
          if (despesa.conta != undefined) {
            despesa.conta = despesa.conta.replace("_", " ");
          } else {
            despesa.conta = { nome: "N/A" };
          }
          despesa.realizadaEm = this.date.convertDate(despesa.realizadaEm);
          despesa.vencimento = this.date.convertDate(
            despesa.transacoes[despesa.transacoes.length - 1].vencimento
          );
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
      });
    }
  }
};
</script>
