const brazilToUSAFormat =  (data) => {

    const parts = data.split('/');
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
}

const USAToBrazilFormat =  (data) => {
    const parts = data.split('-');
    return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`
}


export {brazilToUSAFormat,USAToBrazilFormat};