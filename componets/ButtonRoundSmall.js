import React from 'react';
import {
    TouchableOpacity
    , Image
} from 'react-native';
import editarIMG from '../assets/icon/editar.png';
import excluirIMG from '../assets/icon/excluir.png';


export default function ButtonRoundSmall({ actionClick, typeAction }) {

    let img = null;
    let color = null;
    switch (typeAction) {
        case 'edit':
            img = editarIMG;
            color = '#3498DB'
            break;
        case 'delete':
            img = excluirIMG;
            color = 'red';
            break;
    }

    if(typeAction === null || typeAction === ''){
        return false;
    }

    return (
        <TouchableOpacity
            style={{
                backgroundColor: color,
                padding: 10,
                borderRadius: 50,
                margin: 5,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignContent: 'center'

            }}
            onPress={() => { typeof actionClick === 'function' ? actionClick() : console.error("type actionClick not is function"); }}
        >
            <Image source={img} style={{ width: '100%' }} />
        </TouchableOpacity>
    );

}