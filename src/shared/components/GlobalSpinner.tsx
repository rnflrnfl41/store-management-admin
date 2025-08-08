import { useSelector } from 'react-redux';
import type { RootState } from '@types';
import '@css/GlobalSpinner.css';

const GlobalSpinner = () => {
    const loading = useSelector((state: RootState) => state.loading);

    if (!loading) return null;

    return (
        <div className="global-spinner-overlay">
            <div className="spinner" />
        </div>
    );
};

export default GlobalSpinner;
