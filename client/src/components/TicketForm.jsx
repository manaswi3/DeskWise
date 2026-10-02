import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ticketSchema } from '../lib/schemas';
import { CATEGORIES, PRIORITIES } from '../lib/constants';
import { applyServerErrors, getErrorMessage } from '../lib/utils';
import { Field } from './Field';
import { Spinner } from './States';

export default function TicketForm({ defaultValues, onSubmit, submitLabel, onCancel }) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: { title: '', category: '', priority: 'Medium', description: '', ...defaultValues },
  });

  const submit = async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      if (!applyServerErrors(err, setError)) toast.error(getErrorMessage(err));
    }
  };

  const descriptionLength = watch('description')?.length ?? 0;

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Field label="Title" id="title" error={errors.title?.message}>
        <input
          id="title"
          className="input"
          placeholder="e.g. Cannot reset my password"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          maxLength={120}
          {...register('title')}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" id="category" error={errors.category?.message}>
          <select id="category" className="input" aria-invalid={!!errors.category} {...register('category')}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <fieldset>
          <legend className="label">Priority</legend>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => (
              <label key={p} className="cursor-pointer">
                <input type="radio" value={p} className="peer sr-only" {...register('priority')} />
                <span className="flex min-h-[44px] items-center justify-center rounded-lg border border-line bg-white text-sm font-medium transition-colors peer-checked:border-brand peer-checked:bg-brand-tint peer-checked:text-brand-dark peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                  {p}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <Field label="Description" id="description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={7}
          className="input resize-y"
          placeholder="What happened, what you expected, and any steps to reproduce it"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
          maxLength={2000}
          {...register('description')}
        />
        <p className="mt-1.5 text-right text-xs text-ink-mute">{descriptionLength} / 2000</p>
      </Field>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="h-4 w-4" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
