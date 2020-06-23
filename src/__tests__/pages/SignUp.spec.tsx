import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedSignUp = jest.fn();
const mockedAddToast = jest.fn();
const mockedPost = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../services/api', () => {
  return {
    api: () => ({
      post: mockedPost,
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignUp,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  // it('should be able to sign up', async () => {
  //   const { getByPlaceholderText, getByText } = render(<SignUp />);

  //   const nameField = getByPlaceholderText('Nome:');
  //   const emailField = getByPlaceholderText('E-mail:');
  //   const passwordField = getByPlaceholderText('Senha:');
  //   const buttomElement = getByText('Cadastrar');

  //   fireEvent.change(nameField, { target: { value: 'John Doe' } });
  //   fireEvent.change(emailField, { target: { value: 'johndoe@exemple.com' } });
  //   fireEvent.change(passwordField, { target: { value: '123456' } });

  //   fireEvent.click(buttomElement);

  //   await wait(() => {
  //     expect(mockedPost).toHaveBeenCalledWith();
  //     expect(mockedHistoryPush).toHaveBeenCalledWith('/');
  //   });
  // });

  it('should not be able to sign up with invalid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome:');
    const emailField = getByPlaceholderText('E-mail:');
    const passwordField = getByPlaceholderText('Senha:');
    const buttomElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'not-valid-name' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, {
      target: { value: 'not-valid-password' },
    });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  // it('should display an succeess if logon works', async () => {
  //   const { getByPlaceholderText, getByText } = render(<SignUp />);

  //   const nameField = getByPlaceholderText('Nome:');
  //   const emailField = getByPlaceholderText('E-mail:');
  //   const passwordField = getByPlaceholderText('Senha:');
  //   const buttomElement = getByText('Cadastrar');

  //   fireEvent.change(nameField, { target: { value: 'John Doe' } });
  //   fireEvent.change(emailField, { target: { value: 'johndoe@exemple.com' } });
  //   fireEvent.change(passwordField, { target: { value: '123456' } });

  //   fireEvent.click(buttomElement);

  //   await wait(() => {
  //     expect(mockedAddToast).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         type: 'success',
  //       }),
  //     );
  //   });
  // });

  it('should display an error if logon fails', async () => {
    mockedSignUp.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome:');
    const emailField = getByPlaceholderText('E-mail:');
    const passwordField = getByPlaceholderText('Senha:');
    const buttomElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@exemple.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
