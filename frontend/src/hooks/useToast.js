import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = (message, type = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#1E293B',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#1E293B',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        });
        break;
      case 'loading':
        return toast.loading(message);
      default:
        toast(message);
    }
  };

  const dismiss = (toastId) => toast.dismiss(toastId);

  return { showToast, dismiss };
};
