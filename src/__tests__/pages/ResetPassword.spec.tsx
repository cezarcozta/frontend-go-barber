import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();
const mockedReplace = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: () => ({
        replace: mockedReplace,
      }),
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
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

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
    apiMock.reset();
  });

  it('should be able to reset password', async () => {
    const apiResponse = {
      password: '123123',
      password_confirmation: '123123',
      token: 'token-123',
    };

    apiMock.onPost('password/reset', { apiResponse }).reply(200, apiResponse);

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova Senha');
    const passwordField = getByPlaceholderText('Confirme a senha');
    const buttomElement = getByText('Alterar Senha');

    fireEvent.change(newPasswordField, {
      target: { value: '123123' },
    });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(apiResponse.password).toBeTruthy();
      expect(apiResponse.password).toEqual('123123');
      expect(apiResponse.password_confirmation).toBeTruthy();
      expect(apiResponse.password_confirmation).toEqual('123123');
    });
  });

  it('should not be able to reset password with invalid credential', async () => {
    const apiResponse = {
      password: '123123',
      password_confirmation: '123123',
      token: 'no-token',
    };

    apiMock.onPost('password/reset').reply(401, apiResponse);

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova Senha');
    const passwordField = getByPlaceholderText('Confirme a senha');
    const buttomElement = getByText('Alterar Senha');

    fireEvent.change(newPasswordField, {
      target: { value: '123456' },
    });
    fireEvent.change(passwordField, { target: { value: 'not-same' } });

    fireEvent.click(buttomElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
});
