export default class TipoDespesa {
    id: Number = null;
    descricao: String = null;
    data_registro: Date;

    setId(id: Number) {
        this.id = id;
        return this;
    }

    getId() {
        return this.id;
    }

    setDescricao(descricao: String) {
        this.descricao = descricao;
        return this;
    }

    getDescricao() {
        return this.descricao;
    }

    setDataRegistro(data_registro: Date) {
        this.data_registro = data_registro;
        return this;
    }

    getDataRegistro() {
        return this.data_registro;
    }

}