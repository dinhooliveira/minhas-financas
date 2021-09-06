export default class TipoReceita{
    id: Number = null;
    descricao: String = null;

    setId(id: Number){
        this.id = id;
        return this;
    }

    getId(){
        return this.id;
    }

    setDescricao(descricao: String){
        this.descricao = descricao;
        return this;
    }

    getDescricao(){
        return this.id;
    }

}