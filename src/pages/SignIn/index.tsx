import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, Image, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/Auth';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [showCreateAccountButton, setShowCreateAccountButton] = useState<boolean>(true);

  const handleGoToPage = useCallback(
    (page: string): void => {
      navigation.navigate(page);
    },
    [navigation],
  );

  const handleSubmit = useCallback(
    async (data: SignInFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string().required('Informe o seu e-mail').email('Informe um endereço de e-mail válido'),
          password: Yup.string().required('Informe a sua senha'),
        });
        await schema.validate(data, { abortEarly: false });
        await signIn(data);
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(e));
          return;
        }
        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login. Verifique suas credenciais.');
      }
    },
    [signIn],
  );

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
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
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
                name="password"
                secureTextEntry
                icon="lock"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                placeholder="Senha"
              />
              <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
            </Form>
            <ForgotPassword onPress={() => handleGoToPage('ForgotPassword')}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccount show={showCreateAccountButton} onPress={() => handleGoToPage('SignUp')}>
        <Feather name="log-in" size={20} color="#ff9000" />
        <CreateAccountText>Criar conta</CreateAccountText>
      </CreateAccount>
    </>
  );
};

export default SignIn;
