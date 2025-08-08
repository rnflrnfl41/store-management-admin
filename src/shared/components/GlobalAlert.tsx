import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessage } from '@store/messageSlice';
import type { RootState } from '@types';
import Swal from 'sweetalert2';

const GlobalAlert: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (message) {
      const showAlert = async () => {
        await Swal.fire({
          html: message,
          icon: type,
          confirmButtonText: '확인',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        dispatch(clearMessage());
      };

      showAlert();
    }
  }, [message, type, dispatch]);

  return null;
};

export default GlobalAlert;
