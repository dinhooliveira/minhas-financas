import TipoReceita from "./TipoReceita";
import { mascaraTextMoedaPTBR } from '../../resource/helper/Moeda';

export default class Receita {
    id: Number;
    descricao: String;
    TipoReceita: TipoReceita;
    tipoReceitaId: Number;
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

    setTipoReceita(TipoReceita: TipoReceita) {

        this.TipoReceita = TipoReceita;
        return this;
    }

    getTipoReceita() {
        return this.TipoReceita;
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

    setTipoReceitaId(tipoReceitaId: Number) {
        this.tipoReceitaId = tipoReceitaId;
        return this;
    }

    getTipoReceitaId() {
        return this.tipoReceitaId;
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