import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import api from '../../src/api'

export default function HomeScreen() {
  const [email, setEmail] = useState('ahmed@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [interests, setInterests] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      Alert.alert('Success', `Welcome ${user.fullName}!`)
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeInterests = async () => {
    setLoading(true)
    try {
      const response = await api.get('/auth/analyze-interests')
      Alert.alert('Analysis', JSON.stringify(response.data.analysis, null, 2))
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Analysis failed')
    }
  }

  const handleUpdateInterests = async () => {
    if (!interests) return
    setLoading(true)
    try {
      await api.put('/auth/profile', {
        interests: interests.split(',').map(i => i.trim())
      })
      Alert.alert('Success', 'Interests updated!')
      setInterests('')
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Welcome, {user.fullName}!</Text>
        <Text style={styles.subtitle}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Interests</Text>
          <Text style={styles.interests}>
            {user.interests?.join(', ') || 'No interests yet'}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Add interests (comma separated)"
          placeholderTextColor="#666"
          value={interests}
          onChangeText={setInterests}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateInterests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Updating...' : 'Update Interests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={handleAnalyzeInterests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#4F46E5" />}
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ShareChat</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4F46E5" />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  email: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  analyzeButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interests: {
    fontSize: 14,
    color: '#666',
  },
})