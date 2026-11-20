import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <span className="mt-1 text-left text-[10px] text-[#E05555]">
          {field.state.meta.errors.join(',')}
        </span>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
