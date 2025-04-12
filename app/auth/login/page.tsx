import { Suspense } from 'react';
import { BeatLoader } from 'react-spinners';
import LoginForm from './_components/login-form';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center'>
            <BeatLoader size={8} color='#000000' />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
