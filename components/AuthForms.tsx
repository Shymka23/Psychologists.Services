import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { Button } from './Button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthFormsProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
}).required();

const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
}).required();

export const AuthForms: React.FC<AuthFormsProps> = ({ mode, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isRegister = mode === 'register';
  const schema = isRegister ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    // Casting resolver to any to satisfy strict generic constraints in react-hook-form.
    resolver: yupResolver(schema) as any,
  });

  const handleApiError = (err: unknown) => {
    if (typeof err === 'object' && err !== null && 'code' in err) {
      const errorWithCode = err as { code?: string; message?: string };

      switch (errorWithCode.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.');
          return;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Invalid email or password.');
          return;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          return;
        case 'auth/invalid-email':
        case 'auth/missing-email':
          setError('Please enter a valid email address.');
          return;
        case 'auth/unauthorized-domain':
          setError(
            'Google Sign-In is not allowed from this domain. Please add this domain to the authorized domains in your Firebase project settings.',
          );
          return;
        case 'auth/network-request-failed':
          setError('Network error. Check your internet connection and try again.');
          return;
        case 'auth/operation-not-allowed':
        case 'auth/invalid-api-key':
        case 'auth/configuration-not-found':
          setError('Authentication is temporarily unavailable. Please try again later.');
          return;
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
          return;
        case 'auth/popup-blocked':
          setError('Please allow pop-ups for Google Sign-In in your browser.');
          return;
        default:
          break;
      }
    }

    setError('An error occurred. Please try again.');
  };

  const onSubmit: SubmitHandler<AuthFormValues> = async (data) => {
    setError(null);

    try {
        if (isRegister) {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(userCredential.user, { displayName: data.name });
        } else {
            await signInWithEmailAndPassword(auth, data.email, data.password);
        }
        onClose();
    } catch (err: any) {
        handleApiError(err);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isSubmitting) return;
    setIsGoogleLoading(true);
    setError(null);

    try {
        await signInWithGoogle();
        onClose();
    } catch (err: any) {
        handleApiError(err);
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <div className="p-16 animate-slideUp">
      <h2 className="text-stone-900 text-4xl font-medium leading-[48px] mb-5">
          {isRegister ? 'Registration' : 'Log In'}
      </h2>
      <p className="text-stone-900/50 text-base font-normal leading-5 mb-10 w-full max-w-sm">
          {isRegister 
            ? "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information." 
            : "Welcome back! Please enter your credentials to access your account and continue your search for a psychologist."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isRegister && (
          <div className="relative">
            <input 
              {...register("name")}
              placeholder="Name"
              className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.name ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 transition-all duration-300`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 absolute">
                {String((errors.name as { message?: string }).message || '')}
              </p>
            )}
          </div>
        )}
        
        <div className="relative">
          <input 
            {...register("email")}
            placeholder="Email"
            className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.email ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 transition-all duration-300`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 absolute">
              {String((errors.email as { message?: string }).message || '')}
            </p>
          )}
        </div>

        <div className="relative">
          <input 
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.password ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 pr-12 transition-all duration-300`}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-stone-900 hover:text-emerald-500 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 absolute">
              {String((errors.password as { message?: string }).message || '')}
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>}

        <Button
          type="submit"
          size="md"
          disabled={isSubmitting}
          className="w-full mt-4 !py-4 bg-emerald-400 hover:bg-emerald-500 text-neutral-50 rounded-[30px] text-base font-medium transition-all shadow-md hover:-translate-y-1 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isRegister ? 'Sign Up' : 'Log In'}
        </Button>

        {/* Google Sign In */}
        <div className="flex items-center gap-2 mt-4">
             <div className="h-px bg-stone-900/10 flex-1"></div>
             <span className="text-stone-900/50 text-sm">or</span>
             <div className="h-px bg-stone-900/10 flex-1"></div>
        </div>

        <Button 
            type="button" 
            variant="outline"
            size="md" 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className={`w-full !py-4 rounded-[30px] text-base font-medium hover:bg-zinc-50 transition-all hover:-translate-y-1 active:scale-95 duration-200 ${isGoogleLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
             {isGoogleLoading ? (
               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
             ) : (
               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
             )}
            {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </form>
    </div>
  );
};