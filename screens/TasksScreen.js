import {View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, SafeAreaView, Button} from 'react-native'
import Task from '../components/Task/Task'
import {useState, useEffect} from 'react'
import {getData, storeData} from '../services/storage'

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
    const [activeFilter, setActiveFilter] = useState('All')

    useEffect(() => {
        async function getStorageData() {
          const _tasks = await getData('tasks')
          if (_tasks) {
            setOriginal(_tasks)
            setTasks(_tasks)
          }
        }
    
        getStorageData()
      }, [])

      const removeTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId)
        setTasks(updatedTasks);
        setOriginal(updatedTasks) // Remove a tarefa pelo ID
        storeData('tasks', updatedTasks)
    };

      const toggleTaskStatus = (taskId, newStatus) => {
        
        const updatedTasks = original.map(task => task.id === taskId ? { ...task, isDone: newStatus} : task)
        // Atualiza o status da tarefa pelo id
        setOriginal(updatedTasks)
        setTasks(updatedTasks)
        storeData('tasks', updatedTasks) 
    };

      useEffect(() => {
        const filteredTasks = original.filter(item =>
          item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

        if (activeFilter === 'Open') {
        setTasks(filteredTasks.filter(task => !task.isDone))
        } else if (activeFilter === 'Done') {
        setTasks(filteredTasks.filter(task => task.isDone))
        } else {
        setTasks(filteredTasks)
        }
      }, [search, original, activeFilter])

    function newTask() {
        const newTask = {
          id: Date.now().toString(),
          name: inputValue,
          description: "Exemplo de tarefa criada",
          date: "19 set 2024",
          isDone: false
        }
        
        const updatedTasks = [...original, newTask];
        setOriginal(updatedTasks);
        setTasks(updatedTasks);
        storeData('tasks', updatedTasks);
        setInputValue("");
        setModalVisible(false);
      }

    function handleFilterChange(filter) {
        setActiveFilter(filter)
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
                <TouchableOpacity style={[styles.buttonSelect, activeFilter === 'All' && styles.activeButton]} onPress={() => handleFilterChange('All')}>
                    <Text style={styles.taskType}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSelect, activeFilter === 'Open' && styles.activeButton]} onPress={() => handleFilterChange('Open')}>
                    <Text style={styles.taskType}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonSelect, activeFilter === 'Done' && styles.activeButton]} onPress={() => handleFilterChange('Done')}>
                    <Text style={styles.taskType}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.list}>
            {tasks.length === 0 
                ? 
                <Text>Não existem tarefas cadastradas.</Text> 
                : 
                tasks.map(task => (
                    <Task key={task.id}
                        id={task.id}
                        name={task.name}
                        description={task.description}
                        date={task.date}
                        isDone={task.isDone}
                        onToggleStatus={(newStatus) => toggleTaskStatus(task.id, newStatus)}
                        onRemoveTask={removeTask} 
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
    buttonSelect: {
        padding: 10,
        borderRadius: 10
    },
    activeButton: {
        backgroundColor: 'lightblue'
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