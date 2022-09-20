import styled from '@emotion/styled';
import { DevTool } from '@hookform/devtools';
import { noop } from 'lodash';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import type { ReactNode } from 'react';

export interface FormProps<TFieldValues> extends UseFormReturn<TFieldValues> {
  children: ReactNode;
  onSubmitSuccess?: Parameters<UseFormReturn['handleSubmit']>[0];
  onSubmitError?: Parameters<UseFormReturn['handleSubmit']>[1];
  enableDevtools?: boolean;
}

const StyledForm = styled.form``;

/**
 * Custom Reusable Form Component
 * It solves the problem where data is passed through the component tree without having to pass props down manually at every level.
 * This component tree triggers a re-render when React Hook Form triggers a state update.
 * The useFormInput Component into the Form uses to prevent re-render.
 */

export function Form<TFieldValues>({
  children,
  onSubmitSuccess = noop,
  onSubmitError = noop,
  enableDevtools = false,
  ...formProps
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...formProps}>
      <StyledForm
        onSubmit={formProps.handleSubmit(onSubmitSuccess, onSubmitError)}
      >
        {children}
      </StyledForm>
      {enableDevtools && process.env['NODE_ENV'] !== 'production' && (
        <DevTool control={formProps.control} />
      )}
    </FormProvider>
  );
}
export default Form;
