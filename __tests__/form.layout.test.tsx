import { yupResolver } from '@hookform/resolvers/yup';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, ButtonVariant } from '../../button/button';
import { DatePicker } from '../../date-picker/date-picker';
import { Dropdown } from '../../dropdown/dropdown';
import { SelectGroup } from '../../select-group/select-group';
import { Ticket, tickets } from '../../select-group/select-group.stories';
import { TextInput } from '../../text-input/text-input';
import { Form } from '../form';
import { useFormInput } from '../form.utils';

const users = ['user1', 'user2', 'user3'];

describe('FormInput', () => {
  let useMemo: jest.SpyInstance;
  beforeEach(() => {
    useMemo = jest.spyOn(React, 'useMemo');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    useMemo.mockImplementation((m) => m());
  });

  describe('TextInput', () => {
    it('should render', () => {
      const Input = useFormInput({
        name: 'TextInputName',
        label: 'textInputLabel',
        Input: TextInput,
      });

      function Wrapper() {
        const formMethods = useForm();

        return (
          <FormProvider {...formMethods}>
            <Input />
          </FormProvider>
        );
      }

      const { baseElement } = render(<Wrapper />);

      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('DatePicker', () => {
    it('should render', () => {
      const Input = useFormInput({
        name: 'DatePickerName',
        label: 'datePickerLabel',
        Input: DatePicker,
      });

      function Wrapper() {
        const formMethods = useForm({
          defaultValues: {
            DatePickerName: new Date('5/5/2022'),
          },
        });

        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormProvider {...formMethods}>
              <Input />
            </FormProvider>
          </LocalizationProvider>
        );
      }

      const { baseElement } = render(<Wrapper />);

      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('SelectGroup', () => {
    it('should render', () => {
      const Input = useFormInput({
        name: 'SelectGroupName',
        label: 'SelectGroupLabel',
        Input: SelectGroup,
      });

      function SelectGroupWrapper() {
        const formMethods = useForm();
        return (
          <Form {...formMethods}>
            <Input
              options={tickets}
              extractLabel={(ticket: Ticket) => ticket.label}
              extractName={(ticket: Ticket) => ticket.name}
              label="Remember me"
              register={formMethods.register}
            />
          </Form>
        );
      }
      const { container } = render(<SelectGroupWrapper />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Dropdown', () => {
    it('should render', () => {
      const Input = useFormInput({
        name: 'DropdownFieldName',
        label: 'DropdownFieldLabel',
        Input: Dropdown,
      });

      function DropdownWrapper() {
        const formMethods = useForm();
        return (
          <Form {...formMethods}>
            <Input
              options={users}
              extractLabel={(u: string) => u}
              extractKey={(u: string) => u}
            />
          </Form>
        );
      }
      const { container } = render(<DropdownWrapper />);
      expect(container).toMatchSnapshot();
    });
  });
});

describe('Form', () => {
  it('should render', () => {
    function Wrapper() {
      const formMethods = useForm();
      const Input = useFormInput({
        name: 'TextInputName',
        label: 'textInputLabel',
        Input: TextInput,
      });

      return (
        <Form {...formMethods}>
          <Input />
        </Form>
      );
    }

    const { baseElement } = render(<Wrapper />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with devtools', () => {
    // TODO: Looks like this isn't showing up in snapshots at all
    function Wrapper() {
      const formMethods = useForm();
      const Input = useFormInput({
        name: 'TextInputName',
        label: 'textInputLabel',
        Input: TextInput,
      });

      return (
        <Form {...formMethods} enableDevtools>
          <Input />
        </Form>
      );
    }

    const { baseElement } = render(<Wrapper />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render with error state', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const formMethods = useForm({
        resolver: yupResolver(
          yup
            .object({
              textInputName: yup.string().required(),
            })
            .required(),
        ),
      });
      const Input = useFormInput({
        name: 'textInputName',
        label: 'TextInputLabel',
        Input: TextInput,
      });

      return (
        <Form {...formMethods}>
          <Input />
          <Button type="submit" variant={ButtonVariant.ROUNDED}>
            Submit
          </Button>
        </Form>
      );
    }

    const { baseElement, queryByRole } = render(<Wrapper />);
    const button = queryByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    await user.click(button as HTMLElement);

    expect(baseElement).toMatchSnapshot();
  });
});
