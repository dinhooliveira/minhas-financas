const mascaraIputMoedaPTBR = (value) => {
    value = value.replace(/\D/g, '');
    value = value.padStart(4, 0);
    value = value.replace(/([0-9]{2})$/g, ",$1")
    if (value.length > 6)
        value = value.replace(/([0-9]{3})[',']([0-9]{2}$)/u, ".$1,$2");
    if (value.length > 10)
        value = value.replace(/([0-9]{3})['.']([0-9]{3})[',']([0-9]{2}$)/u, ".$1.$2,$3");


    if (value.match(/^0+[1-9]['.']/u) || value.match(/^0+['.']0+[1-9]/ug)) {
        value = value.replace(/^0+/u, '').replace(/^['.']/u, '');
    }

    if (value.match(/^0+[1-9][',']/u)) {
        value = value.replace(/^0+/u, '');
    }

    if (value.match(/^0+[',']/u)) {
        value = value.substring(1, 5);
    }

    return value;
}

const mascaraTextMoedaPTBR = (value) => {
    require('intl');
    require('intl/locale-data/jsonp/pt-BR');
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2
    }).format(value);
}

const removeMascaraMoedaPtBrParaFloat = (value) => {
    value = value.replace(/\D/g, '');
    value = value.padStart(4, 0);
    value = value.replace(/([0-9]{2})$/g, ".$1")
    return value;
}

export { mascaraTextMoedaPTBR, removeMascaraMoedaPtBrParaFloat, mascaraIputMoedaPTBR }