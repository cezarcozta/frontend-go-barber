import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

const apiMock = new MockAdapter(api);

describe('Toast hook', () => {
  it('should be', () => {
    renderHook(() => useToast());

    apiMock.onPost();
  });
});
