import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface CreateButtonProps extends TouchableOpacityProps {
  show: boolean;
}

export const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 30px;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 64px 0 24px;
`;

export const BackToSignIn = styled.TouchableOpacity<CreateButtonProps>`
  left: 0;
  bottom: 0;
  right: 0;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0;
  background: #312e38;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: ${props => (props.show ? 'absolute' : 'relative')};
  display: ${props => (props.show ? 'flex' : 'none')};
`;

export const BackToSignInText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;
