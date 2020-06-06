import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, Image, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [showCreateAccountButton, setShowCreateAccountButton] = useState<boolean>(true);

  const handleSubmit = useCallback(
    async (data: SignUpFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Informe o seu nome'),
          email: Yup.string().required('Informe o seu e-mail').email('Informe um endereço de e-mail válido'),
          password: Yup.string().min(6, 'Digite, no mínimo, 6 dígitos'),
        });
        await schema.validate(data, { abortEarly: false });
        await api.post('users', data);
        Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação.');
        navigation.goBack();
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(e));
          return;
        }
        Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer seu cadastro. Tente novamente.');
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  useEffect((): any => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowCreateAccountButton(false);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowCreateAccountButton(true);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="name"
                autoCapitalize="words"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                name="email"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                icon="lock"
                placeholder="Senha"
              />
              <Button onPress={() => formRef.current?.submitForm()}>Cadastrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn show={showCreateAccountButton} onPress={handleGoBack}>
        <Feather name="arrow-left" size={20} color="#ffffff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
