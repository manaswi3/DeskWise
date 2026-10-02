import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthShell from '../components/AuthShell';
import { Field, FormBanner, PasswordInput } from '../components/Field';
import { Spinner } from '../components/States';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../lib/schemas';
import { applyServerErrors, getErrorMessage } from '../lib/utils';

export default function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await signUp(values);
      toast.success('Account created');
      navigate('/tickets', { replace: true });
    } catch (err) {
      if (!applyServerErrors(err, setError)) setFormError(getErrorMessage(err));
    }
  };

  const describe = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes under a minute."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormBanner message={formError} />
        <Field label="Full name" id="name" error={errors.name?.message}>
          <input id="name" autoComplete="name" className="input" aria-invalid={!!errors.name} aria-describedby={describe('name')} {...register('name')} />
        </Field>
        <Field label="Email" id="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={describe('email')}
            {...register('email')}
          />
        </Field>
        <Field label="Password" id="password" error={errors.password?.message} hint="At least 8 characters, with a letter and a number.">
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby={describe('password')} {...register('password')} />
        </Field>
        <Field label="Confirm password" id="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={describe('confirmPassword')}
            {...register('confirmPassword')}
          />
        </Field>
        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="h-4 w-4" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
