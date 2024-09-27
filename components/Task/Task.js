import {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

function Task({ name, description, date, onToggleStatus}) {

    const [isDone, setIsDone] = useState(false)

    const toggleTaskStatus = () => {
        setIsDone(!isDone)
        onToggleStatus(!isDone)
    }

    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.dataCompletion}>Due Date:{date}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, isDone ? styles.buttonDone : styles.buttonPending]} onPress={toggleTaskStatus}>
                    <Text style={styles.buttonText}>{isDone ? "✔️ Done" : 'Finish'}</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

export default Task;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFC107',
        height: 'auto',
        padding: 14,
        borderRadius: 5,
        margin: 15,
        justifyContent: 'space-between'
    },
    textContainer: {
        maxWidth: '70%',
        marginRight: 15
    },
    title: {
        color: '#333333',
        fontSize: 20,
        fontWeight: 'bold'
    },
    description: {
        flexWrap: 'wrap',

    },
    dataCompletion: {
        fontWeight: 'bold'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%'
    },
    button: {
        backgroundColor: "#303030",
        width: 80,
        height: 30,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 8,
        marginRight: 15
    },
    buttonPending: {
        backgroundColor: "#303030",
    },
    buttonDone: {
        backgroundColor: "#4CAF50",
    },
    buttonText: {
        color: '#FFF'
    }
})