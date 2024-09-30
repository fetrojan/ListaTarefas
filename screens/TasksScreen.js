import {View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, SafeAreaView, Button, ScrollView} from 'react-native'
import Task from '../components/Task/Task'
import {useState, useEffect} from 'react'
import {getData, storeData} from '../services/storage'
import DateTimePicker from '@react-native-community/datetimepicker';

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
    const [descriptionValue, setDescriptionValue] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
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
        setOriginal(updatedTasks)
        storeData('tasks', updatedTasks)
    };

        const toggleTaskStatus = (taskId, newStatus) => {
            const updatedTasks = original.map(task => {
                if (task.id === taskId) {
                    return { 
                        ...task, 
                        isDone: newStatus, 
                        finishedAt: newStatus ? new Date() : null 
                    };
                }
                return task;
        });
    
        setOriginal(updatedTasks);
        setTasks(updatedTasks);
        storeData('tasks', updatedTasks);
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

        const formattedDate = dueDate.toLocaleDateString('en-GB', {
            month: 'long',
            day: '2-digit',
        });

        if (!inputValue.trim()) {
            alert("O título da tarefa não pode estar vazio");
            return;
        }
        
        if (!descriptionValue.trim()) {
            alert("A descrição da tarefa não pode estar vazia");
            return;
        }

        const newTask = {

          id: Date.now().toString(),
          name: inputValue,
          description: descriptionValue,
          date: formattedDate,
          isDone: false
        }
        
        const updatedTasks = [...original, newTask];
        setOriginal(updatedTasks);
        setTasks(updatedTasks);
        storeData('tasks', updatedTasks);
        setInputValue("");
        setDescriptionValue("")
        setDueDate(new Date())
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

            <ScrollView style={styles.list}>
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
            </ScrollView>

            <Modal  animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Nova Tarefa</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.modalInput}
                        placeholder='Digite o nome da tarefa'
                        value={inputValue} onChangeText={setInputValue}/>

                        <Text style={styles.label}>Descrição</Text>
                        <TextInput style={styles.modalInput} placeholder='Digite uma breve descrição' value={descriptionValue}
                        onChangeText={setDescriptionValue}/>

                        <Text style={styles.label}>Data de Vencimento</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text>{dueDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate}
                                mode='date'
                                display='calendar'
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setDueDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={newTask} style={styles.modalSalvar}><Text>Salvar</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelar}><Text>Cancelar</Text></TouchableOpacity>
                        </View>
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
        backgroundColor: '#007AFF',
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
        borderBlockColor: '#007AFF',
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
      },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      modalTitle:{
        fontSize: 20,
        marginBottom: 15
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
        alignSelf: 'flex-start',
     },
      modalInput: {
        marginBottom: 15,
        borderWidth: 1,
        padding: 5,
        width: 300
      },
      dateButton: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignSelf: 'flex-start'
        },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 20
    },
      modalSalvar: {
        backgroundColor: '#4b9c4b',
        padding: 10,
        borderRadius: 15,
        marginBottom: 15,
        width: 100,
        alignItems: 'center'
      },
      modalCancelar: {
        backgroundColor: '#CCC',
        padding: 10,
        borderRadius: 15,
        marginBottom: 15,
        width: 100,
        alignItems: 'center'
      }
})