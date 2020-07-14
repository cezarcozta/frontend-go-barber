import { renderHook, act } from '@testing-library/react-hooks';
import { useToast, ToastProvider } from '../../hooks/toast';

describe('Toast hook', () => {
  it('should be able to add Toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'success',
        title: 'TestToastSuccess',
        description: 'descrp...',
      });
    });

    expect(result.current.addToast).toBeTruthy();
  });

  it('should be able to remove Toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.removeToast('testid');
    });

    expect(result.current.removeToast).toBeTruthy();
  });
});
