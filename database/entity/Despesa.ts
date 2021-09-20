import TipoDespesa from "./TipoDespesa";
import { mascaraTextMoedaPTBR } from '../../resource/helper/Moeda';

export default class Despesa {
    id: Number;
    descricao: String;
    TipoDespesa: TipoDespesa;
    tipoDespesaId: Number;
    valor: Number;
    data: Date;
    dataRegistro: Date;

    setId(id: number) {
        this.id = id;
        return this;
    }

    getId() {
        return this.id;
    }

    setDescricao(descricao: string) {
        this.descricao = descricao;
        return this;
    }

    getDescricao() {
        return this.descricao;
    }

    setTipoDespesa(TipoDespesa: TipoDespesa) {

        this.TipoDespesa = TipoDespesa;
        return this;
    }

    getTipoDespesa() {
        return this.TipoDespesa;
    }

    setData(data: Date) {
        this.data = data;
        return this;
    }

    getData() {
        return this.data;
    }
    

    setDataRegistro(data: Date) {
        this.dataRegistro = data;
        return this;
    }

    getDataRegistro() {
        return this.dataRegistro;
    }

    setTipoDespesaId(tipoDespesaId: Number) {
        this.tipoDespesaId = tipoDespesaId;
        return this;
    }

    getTipoDespesaId() {
        return this.tipoDespesaId;
    }

    setValor(valor: Number) {
        this.valor = valor;
        return this;
    }

    getValor() {
        return this.valor;
    }

    getValorPtBR(){
        return mascaraTextMoedaPTBR(this.valor.toString());
    }

}