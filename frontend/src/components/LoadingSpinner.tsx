import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => (
  <div className='flex justify-center'>
    <ClipLoader color='#000' size={50} />
  </div>
);

export default LoadingSpinner;