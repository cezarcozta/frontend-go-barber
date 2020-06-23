import React from 'react';
import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Dashboard from '../../pages/Dashboard';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedLocationSearch = jest.fn();
const mockedFormat = jest.fn();
const mockedSelectedDate = jest.fn();
const mockedCallback = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-day-picker', () => {
  return {
    DayModifiers: () => ({}),
  };
});

jest.mock('date-fns/esm', () => {
  return {
    parseISO: () => ({}),
  };
});

jest.mock('date-fns', () => {
  return {
    foramt: () => ({}),
    isToday: () => ({}),
    isAfter: () => ({}),
  };
});

jest.mock('react', () => {
  return {
    useEffect: () => ({
      selectDate: mockedSelectedDate,
    }),
    useState: () => ({
      state: mockedSelectedDate,
    }),
    useCallback: () => ({
      callback: mockedSelectedDate,
    }),
    useMemo: () => ({
      format: mockedSelectedDate,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('Dashboard Page', () => {
  it('should be', () => {
    apiMock.onGet();
    render(<Dashboard />);
  });
});
