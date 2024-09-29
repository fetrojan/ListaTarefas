import {View, Text, Button} from 'react-native'
import { clearData } from '../services/storage'

export default function MessagesScreen() {

    return (
        <View>
            <Text>Não existem mensagens recentes.</Text>
            <Button title='Limpar' onPress={clearData} />
        </View>
    )
}