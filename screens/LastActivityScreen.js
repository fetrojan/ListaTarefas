import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getData } from '../services/storage';

export default function LastActivityScreen() {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        async function fetchCompletedTasks() {
            const _tasks = await getData('tasks');
            if (_tasks) {
                // Filtra e ordena as tarefas completadas
                const completed = _tasks.filter(task => task.isDone).sort((a, b) => new Date(b.date) - new Date(a.date));
                setCompletedTasks(completed);
            }
        }

        fetchCompletedTasks();
    }, []);

    return (
        <View style={styles.container}>
            {completedTasks.length === 0 ? (
                <Text>Não há atividades completadas.</Text>
            ) : (
                completedTasks.map(task => (
                    <View key={task.id} style={styles.taskContainer}>
                        <Text style={styles.taskName}>{task.name}</Text>
                        <Text style={styles.taskDescription}>{task.description}</Text>
                        <Text style={styles.taskDate}>Concluída em: {new Date(task.date).toLocaleString()}</Text>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    taskContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    taskName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        color: '#555',
    },
    taskDate: {
        fontSize: 12,
        color: '#999',
    },
});