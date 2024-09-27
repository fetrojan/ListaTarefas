import {View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, SafeAreaView, Button} from 'react-native'
import Task from '../components/Task/Task'
import {useState, useEffect} from 'react'

export default function TasksScreen() {

    const today = new Date()
    const weekDays= [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const formattedDate = `${weekDays[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`

    const [inputValue, setInputValue] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [tasks, setTasks] = useState([])
    const [original, setOriginal] = useState([])
    const [search, setSearch] = useState("")

    const toggleTaskStatus = (taskId, newStatus) => {
        // Atualiza o status da tarefa pelo id
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, isDone: newStatus } : task
        ));
    };

    useEffect(() => {
        async function getStorageData() {
          const _tasks = await getData('tasks')
          if (_tasks) {
            setOriginal(_tasks)
          }
        }
    
        getStorageData()
      }, [])

    function newTask() {
        const newTask = {
          id: tasks.length + 1,
          name: inputValue,
          description: "Exemplo de tarefa criada",
          date: "19 set 2024",
          isDone: false
        }
        
        setTasks(prev => [...prev, newTask])
        setOriginal(prev => [...prev, newTask])
        setInputValue("")    
        setModalVisible(false)
      }

    return (
        
        <SafeAreaView style={styles.safe}>
            <View style={styles.containerFirst}>
                <View>
                    <Text style={styles.title}>To-Do List</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}><Text style={styles.buttonText}>+ New Task</Text></TouchableOpacity>
                </View>
            </View>

            <TextInput style={styles.searchInput} placeholder='Buscar tarefa' onChangeText={setSearch} value={search} />

            <View style={styles.containerTasksTypes}>
                <Text style={styles.taskType}>All</Text>
                <Text style={styles.taskType}>Open</Text>
                <Text style={styles.taskType}>Done</Text>
            </View>

            <View style={styles.list}>
            {tasks.length === 0 
                ? 
                <Text>Não existem tarefas cadastradas.</Text> 
                : 
                tasks.map(task => (
                    <Task key={task.id}
                        name={task.name}
                        description={task.description}
                        date={task.date}
                        onToggleStatus={(newStatus) => toggleTaskStatus(task.id, newStatus)} 
                    />
                ))
            }
            </View>

            <Modal  animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Nova Tarefa</Text>
                        <TextInput 
                        placeholder='Digite o nome da tarefa'
                        value={inputValue} onChangeText={setInputValue}/>
                        <Button title='Cancelar' onPress={() => setModalVisible(false)} />
                        <Button title='Salvar' onPress={newTask} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1
    },
    containerFirst: {
        flexDirection: 'row',
        padding: 15
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 18
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 15,
        marginLeft: 45,
        marginTop: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18
    },
    searchInput: {
        width: '98%',
        height: 32,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 18
      },
    containerTasksTypes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        padding: 5,
        borderBlockColor: 'blue',
    },
    taskType: {
        fontSize: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
})