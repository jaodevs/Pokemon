import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  DivContainer,
} from './styles';
import api from '../services/api';

export default class Main extends Component {
  state = {
    name: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    try {
      const {name, users, loading} = this.state;

      this.setState({loading: true});
      const response = await api.get(`/pokemon/${name}`);
      const data = {
        image: response.data.sprites.front_default,
        name: response.data.name,
      };

      this.setState({
        users: [data, ...users],
        name: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      alert('Usuário não encontrado');
      this.setState({loading: false});
    }
  };

  render() {
    const {name, users, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={name}
            onChangeText={text => this.setState({name: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          showVerticalScrollIndicator={false}
          data={users}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.image}} />
              <Name>{item.name}</Name>
            </User>
          )}
        />
      </Container>
    );
  }
}
