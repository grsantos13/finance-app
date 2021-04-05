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
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Cadastrar Entrada</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-select
                  :items="categorias"
                  label="Categoria"
                  item-text="nome"
                  item-value="id"
                  v-model="entradaRequest.idCategoria"
                />
                <v-checkbox
                  v-model="entradaRequest.fixa"
                  label="Entrada fixa"
                />
                <v-select
                  :items="contas"
                  label="Conta"
                  item-text="nome"
                  item-value="id"
                  v-model="entradaRequest.idConta"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="formasDePagamento"
                  label="Pagamento"
                  v-model="entradaRequest.formaDePagamento"
                />
                <v-checkbox
                  :disabled="!entradaRequest.fixa"
                  v-model="entradaRequest.valorVariavel"
                  label="Valor variável"
                />
                <v-select
                  :items="status"
                  label="Status"
                  v-model="entradaRequest.status"
                />
              </v-col>
              <v-col cols="12" style="margin-top: -30px">
                <v-text-field v-model="entradaRequest.valor" label="Valor" />
              </v-col>
              <v-col cols="12" style="margin-top: -30px">
                <v-textarea
                  v-model="entradaRequest.descricao"
                  label="Descrição"
                  rows="3"
                />
              </v-col>
            </v-row>
            <v-col cols="12" style="margin-top: -30px">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="entradaRequest.data"
                    label="Data de entrada"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="entradaRequest.realizadaEm"
                  @input="menu = false"
                  locale="pt-BR"
                />
              </v-menu>
            </v-col>
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
      <span>Adicionar entrada</span>
    </v-tooltip>
  </navigation-panel>
</template>
<script>
import NavigationPanel from "../components/NavigationPanel.vue";
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
    dialog: false,
    menu: false,
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
    itemsPerPage: 10,
    categorias: [],
    formasDePagamento: ["CREDITO", "DEBITO", "PIX", "DINHEIRO"],
    status: ["PLANEJADO", "PENDENTE", "REALIZADO"],
    contas: [],
    entradaRequest: {
      idCategoria: null,
      formaDePagamento: null,
      fixa: false,
      valorVariavel: false,
      conta: null,
      status: "PLANEJADO",
      descricao: null,
      valor: null,
      realizadaEm: null,
      data: null
    }
  }),
  mounted: function() {
    this.refresh();
    this.getCategorias();
    this.getContas();
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
    save: function() {
      this.$http
        .post("/entradas", this.entradaRequest)
        .then(() => {
          this.entradaRequest = {
            idCategoria: null,
            formaDePagamento: null,
            fixa: false,
            valorVariavel: false,
            idConta: null,
            status: "PLANEJADO",
            descricao: null,
            valor: null,
            realizadaEm: null,
            data: null
          };
          this.$toastr.s("Entrada registrada com sucesso!");
          this.refresh();
        })
        .catch(error => {
          error.response.data._embedded.errors.map(error => {
            var message = error.message.split(": ")[1];
            var field = error.message.split(": ")[0].split(".")[1];
            this.$toastr.e(message, field);
          });
        });
    },
    filter: function(query) {
      alert(query);
    },
    getCategorias: function() {
      this.$http.get("/categorias?movimentos=ENTRADA").then(response => {
        this.categorias = response.data.filter(c => {
          return c.movimento.includes("ENTRADA");
        });
      });
    },
    getContas: function() {
      this.$http.get("/contas").then(response => {
        this.contas = response.data;
      });
    }
  },
  watch: {
    "entradaRequest.realizadaEm"(val) {
      this.entradaRequest.data = this.date.convertDate(val);
    }
  }
};
</script>
