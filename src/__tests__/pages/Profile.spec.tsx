import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../../pages/Profile';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedCallback = jest.fn();
const mockedFormData = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
      user: {
        name: 'John Doe',
        email: 'johndoe@exemple.com',
      },
      updateUser: mockedUpdateUser,
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

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUpdateUser.mockClear();
    mockedAddToast.mockClear();
    mockedCallback.mockClear();
    mockedFormData.mockClear();
  });

  it('should be able to change profile', async () => {
    const apiResponse = {
      user: {
        name: 'John Doe',
        email: 'johndoe@exemple.com',
        old_password: 'testpassword',
        password: 'newpassword',
        password_confimartion: 'newpassword',
      },
    };

    apiMock.onPut('/profile').reply(200, apiResponse);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const password_confirmationField = getByPlaceholderText('Confirmar senha');
    const buttomElement = getByText('Alterar Perfil');

    fireEvent.change(oldPasswordField, {
      target: { value: 'old-password' },
    });

    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.change(password_confirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(apiResponse.user.password_confimartion).toBeTruthy();
      expect(mockedUpdateUser).toHaveBeenCalledWith(apiResponse);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to change profile I DONT KNOW WHY', async () => {
    mockedUpdateUser.mockImplementation(() => {
      throw new Error();
    });

    apiMock.onPost('/profile').reply(401);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const password_confirmationField = getByPlaceholderText('Confirmar senha');
    const buttomElement = getByText('Alterar Perfil');

    fireEvent.change(oldPasswordField, {
      target: { value: 'old-password' },
    });

    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.change(password_confirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not be able to change profile with invalids credentials', async () => {
    mockedUpdateUser.mockImplementation(() => {
      throw new Error();
    });

    apiMock.onPost('/profile').reply(401);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const password_confirmationField = getByPlaceholderText('Confirmar senha');
    const buttomElement = getByText('Alterar Perfil');

    fireEvent.change(oldPasswordField, {
      target: { value: 'old-password' },
    });

    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.change(password_confirmationField, {
      target: { value: 'not-the-same' },
    });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should be able to go back to dashboard', async () => {
    const { getByTestId } = render(<Profile />);

    const LinkElement = getByTestId('backLink');

    fireEvent.click(LinkElement);

    await wait(() => {
      expect(fireEvent.click(LinkElement)).toBeTruthy();
    });
  });

  it('should be able to change Avatar', async () => {
    const data = {};
    const apiResponse = {
      updateUser: () => ({
        avatar: 'file.png',
      }),
    };

    apiMock
      .onPatch('/users/avatar', {
        data,
      })
      .reply(200, { apiResponse });

    const { getByTestId } = render(<Profile />);
    const avatarInput = getByTestId('avatarInput');

    fireEvent.change(avatarInput, {
      target: { files: 'avatar-file' },
    });

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalledWith(apiResponse);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });
});
