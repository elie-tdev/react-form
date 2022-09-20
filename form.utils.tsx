import { isNil } from 'lodash';
import { FocusEventHandler, Ref, useMemo } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form';

type ControlledPropKeys =
  | keyof Omit<ControllerRenderProps<FieldValues, string>, 'ref'>
  | 'inputRef'
  | 'label';
export interface ControlledProps
  extends Omit<ControllerRenderProps<FieldValues, string>, 'ref' | 'onBlur'> {
  inputRef?: Ref<unknown>;
  onBlur?: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
  >;
}

type ExportedComponentProps<T> = Omit<T, ControlledPropKeys> & {
  helperText?: string;
};

export interface UseFormInputProps<
  T extends Partial<ControlledProps>,
  TVal = T['value'],
> {
  name: string;
  label: string;
  Input: (props: T) => JSX.Element;
  mapOnChange?: (arg1: any, arg2: any) => TVal;
}

export function useFormInput<
  T extends Partial<ControlledProps>,
  TVal = T['value'],
>({
  name,
  label,
  Input,
  mapOnChange,
}: UseFormInputProps<T, TVal>): (
  props: ExportedComponentProps<T>,
) => JSX.Element {
  return useMemo(
    () =>
      function FormInput({ helperText, ...props }: ExportedComponentProps<T>) {
        return (
          <Controller
            name={name}
            render={({
              field: { ref, value = '', onChange, ...field },
              fieldState,
            }) => {
              const inputValue = value as TVal;
              const inputProps = {
                ...(inputValue && { value: inputValue }),
                ...props,
                ...field,
                label,
                inputRef: ref,
                error: !isNil(fieldState.error),
                onChange(...args: unknown[]) {
                  if (!isNil(mapOnChange))
                    onChange(mapOnChange(args[0], args[1]));
                  else onChange(...args);
                },
                helperText: !isNil(fieldState.error)
                  ? fieldState.error.message
                  : helperText,
              } as unknown as T; // TODO: Verify this casting is accurate...
              // NOTE: I hate casting to T here, but it seems there's no other way to do this.
              // Typescript has issues merging types when using generics and Omit.
              // The big downside to using `as` here is that if someoone tries using `forForm`
              // with a component that doesn't correctly implement `ControlledProps`, it will
              // give an unhelpful error. It does give an error though, so that's good.
              // I just wish it was more clear what the issue is.
              // Source: https://github.com/microsoft/TypeScript/issues/35858
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              return <Input {...inputProps} />;
            }}
          />
        );
      },
    [name, label, Input, mapOnChange],
  );
}
