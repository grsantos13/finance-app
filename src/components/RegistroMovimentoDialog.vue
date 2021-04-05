<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Cadastrar {{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-select
                :items="categorias"
                label="Categoria"
                item-text="nome"
                item-value="id"
                v-model="request.idCategoria"
              />
              <v-select
                :items="cartoes"
                label="Cartão"
                item-text="nome"
                item-value="id"
                v-model="request.idCartao"
                v-if="
                  request.formaDePagamento == 'CREDITO' && type == 'DESPESA'
                "
              />
              <v-checkbox v-model="request.fixa" label="Despesa fixa" />
              <v-select
                :items="contas"
                label="Conta"
                item-text="nome"
                item-value="id"
                v-model="request.idConta"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                :items="formasDePagamento"
                label="Pagamento"
                v-model="request.formaDePagamento"
              />
              <v-text-field
                v-model="request.numeroDeParcelas"
                label="Número de parcelas"
                type="number"
                v-if="
                  request.formaDePagamento == 'CREDITO' && type == 'DESPESA'
                "
              />
              <v-checkbox
                :disabled="!request.fixa"
                v-model="request.valorVariavel"
                label="Valor variável"
              />
              <v-select
                :items="status"
                label="Status"
                v-model="request.status"
              />
            </v-col>
            <v-col cols="12" style="margin-top: -30px">
              <v-text-field v-model="request.valor" label="Valor" />
            </v-col>
            <v-col cols="12" style="margin-top: -30px">
              <v-textarea
                v-model="request.descricao"
                label="Descrição"
                rows="3"
              />
            </v-col>
            <v-col
              :cols="type == 'DESPESA' ? '6' : '12'"
              style="margin-top: -30px"
            >
              <v-menu
                v-model="menuMovimento"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="request.dataMovimento"
                    :label="`Data de ${title}`"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="request.realizadaEm"
                  @input="menuMovimento = false"
                  locale="pt-BR"
                />
              </v-menu>
            </v-col>
            <v-col v-if="type == 'DESPESA'" cols="6" style="margin-top: -30px">
              <v-menu
                v-model="menuVencimento"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="request.dataVencimento"
                    label="Data de vencimento"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="request.vencimento"
                  @input="menuVencimento = false"
                  locale="pt-BR"
                />
              </v-menu>
            </v-col>
          </v-row>
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
</template>
<script>
import DateUtils from "../utils/dateUtils";
export default {
  name: "RegistroMovimento",
  props: {
    title: String,
    type: String,
    endpoint: String,
    dialog: Boolean
  },
  data: () => ({
    date: new DateUtils(),
    request: {
      realizadaEm: null,
      idCategoria: null,
      descricao: null,
      numeroDeParcelas: 1,
      formaDePagamento: null,
      valor: null,
      vencimento: null,
      idCartao: null,
      idConta: null,
      fixa: false,
      valorVariavel: false,
      statusPagamento: "PENDENTE",
      dataDespesa: null,
      dataVencimento: null
    },
    categorias: [],
    cartoes: [],
    contas: [],
    formasDePagamento: ["CREDITO", "DEBITO", "PIX", "DINHEIRO"],
    status: ["PLANEJADO", "PENDENTE", "REALIZADO"],
    menuMovimento: false,
    menuVencimento: false
  }),
  mounted: function() {
    this.getCategorias();
    this.getContas();
    if (this.type == "DESPESA") this.getContas();
  },
  methods: {
    getCategorias: function() {
      this.$http.get(`/categorias?movimentos=${this.type}`).then(response => {
        this.categorias = response.data;
      });
    },
    getContas: function() {
      this.$http.get("/contas").then(response => {
        this.contas = response.data;
      });
    },
    getCartoes: function() {
      this.$http.get("/cartoes").then(response => {
        this.cartoes = response.data;
      });
    },
    save: function() {
      this.$http
        .post(`/${this.endpoint}`, this.request)
        .then(() => {
          this.request = {
            realizadaEm: null,
            idCategoria: null,
            descricao: null,
            numeroDeParcelas: 1,
            formaDePagamento: null,
            valor: null,
            vencimento: null,
            idCartao: null,
            idConta: null,
            fixa: false,
            valorVariavel: false,
            statusPagamento: "PENDENTE",
            dataDespesa: null,
            dataVencimento: null
          };
          this.$toastr.s(`${this.title} registrada com sucesso!`);
          this.$emit("refresh");
          this.dialog = false;
        })
        .catch(error => {
          error.response.data._embedded.errors.map(error => {
            var message = error.message.split(": ")[1];
            var field = error.message.split(": ")[0].split(".")[1];
            this.$toastr.e(message, field);
          });
        });
    }
  },
  watch: {
    "request.realizadaEm"(val) {
      this.request.dataMovimento = this.date.convertDate(val);
    },
    "request.vencimento"(val) {
      this.request.dataVencimento = this.date.convertDate(val);
    }
  }
};
</script>
