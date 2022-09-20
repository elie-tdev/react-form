import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

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
  describe('TextInput', () => {
    it('should update form state when user types', async () => {
      const user = userEvent.setup();
      const onSubmitSuccess = jest.fn();
      const onSubmitError = jest.fn();
      let getValues;

      function Wrapper() {
        const formMethods = useForm();
        getValues = formMethods.getValues;

        const Input = useFormInput({
          name: 'textInputName',
          label: 'Text Input Label',
          Input: TextInput,
        });

        return (
          <Form
            {...formMethods}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitError={onSubmitError}
          >
            <Input />
            <Button type="submit" variant={ButtonVariant.ROUNDED}>
              Submit
            </Button>
          </Form>
        );
      }

      const { queryByRole } = render(<Wrapper />);

      const input = queryByRole('textbox', { name: 'Text Input Label' });
      expect(input).toBeInTheDocument();
      await user.type(input as HTMLElement, 'This is a value that I typed');

      const button = queryByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
      await user.click(button as HTMLElement);

      expect((getValues as unknown as () => unknown)()).toEqual({
        textInputName: 'This is a value that I typed',
      });

      expect(onSubmitError).not.toHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenCalledWith(
        {
          textInputName: 'This is a value that I typed',
        },
        expect.anything(),
      );
    });
  });

  describe('DatePicker', () => {
    beforeAll(() => {
      // Mobile mode is rendered unless this is changed
      window.matchMedia = (query: string): MediaQueryList => ({
        media: query,
        // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
        matches: query === '(pointer: fine)',
        onchange: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      });
    });

    it('should update form state when user picks date', async () => {
      const user = userEvent.setup();
      const onSubmitSuccess = jest.fn();
      const onSubmitError = jest.fn();
      let getValues;

      function Wrapper() {
        const formMethods = useForm<{
          datePickerName: Date;
        }>({
          defaultValues: {
            datePickerName: new Date('04/06/2022'),
          },
        });
        getValues = formMethods.getValues;

        const Input = useFormInput({
          name: 'datePickerName',
          label: 'Date Picker Label',
          Input: DatePicker,
        });

        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form
              {...formMethods}
              onSubmitSuccess={onSubmitSuccess}
              onSubmitError={onSubmitError}
            >
              <Input />
              <Button type="submit" variant={ButtonVariant.ROUNDED}>
                Submit
              </Button>
            </Form>
          </LocalizationProvider>
        );
      }

      const { getByRole } = render(<Wrapper />);

      const calButton = getByRole('button', {
        name: 'Choose date, selected date is Apr 6, 2022',
      });
      await user.click(calButton);

      const dayButton = getByRole('button', {
        name: 'Apr 10, 2022',
      });
      await user.click(dayButton);

      const button = getByRole('button', { name: 'Submit' });
      await user.click(button);

      expect((getValues as unknown as () => unknown)()).toEqual({
        datePickerName: new Date('04/10/2022'),
      });

      expect(onSubmitError).not.toHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenCalledWith(
        {
          datePickerName: new Date('04/10/2022'),
        },
        expect.anything(),
      );
    });
  });

  describe('SelectGroup', () => {
    it('should update form state when user types', async () => {
      const user = userEvent.setup();
      const onSubmitSuccess = jest.fn();
      const onSubmitError = jest.fn();
      let getValues;

      function Wrapper() {
        const formMethods = useForm();
        getValues = formMethods.getValues;
        const Input = useFormInput({
          name: 'SelectGroupName',
          label: 'SelectGroupLabel',
          Input: SelectGroup,
        });

        return (
          <Form
            {...formMethods}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitError={onSubmitError}
          >
            <Input
              options={tickets}
              extractLabel={(ticket: Ticket) => ticket.label}
              extractName={(ticket: Ticket) => ticket.name}
              label="Remember me"
              register={formMethods.register}
            />
            <Button type="submit" variant={ButtonVariant.ROUNDED}>
              Submit
            </Button>
          </Form>
        );
      }

      const { getByRole, getByLabelText } = render(<Wrapper />);
      await user.click(getByLabelText('billing issue'));

      const button = getByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
      await user.click(button);

      expect((getValues as unknown as () => unknown)()).toEqual({
        SelectGroupName: ['billing_issue'],
      });

      expect(onSubmitError).not.toHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenCalledWith(
        {
          SelectGroupName: ['billing_issue'],
        },
        expect.anything(),
      );
    });
  });

  describe('Dropdown', () => {
    it('should update form state when user types', async () => {
      const user = userEvent.setup();
      const onSubmitSuccess = jest.fn();
      const onSubmitError = jest.fn();
      let getValues;

      function Wrapper() {
        const formMethods = useForm();
        getValues = formMethods.getValues;
        const Input = useFormInput({
          name: 'DropdownFieldName',
          label: 'DropdownFieldLabel',
          Input: Dropdown,
        });

        return (
          <Form
            {...formMethods}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitError={onSubmitError}
          >
            <Input
              label="User Selection"
              options={users}
              extractLabel={(u: string) => u}
              extractKey={(u: string) => u}
            />
            <Button type="submit" variant={ButtonVariant.ROUNDED}>
              Submit
            </Button>
          </Form>
        );
      }

      const { getByRole } = render(<Wrapper />);
      await user.selectOptions(getByRole('combobox'), 'user2');

      const button = getByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
      await user.click(button);

      expect((getValues as unknown as () => unknown)()).toEqual({
        DropdownFieldName: 'user2',
      });

      expect(onSubmitError).not.toHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
      expect(onSubmitSuccess).toHaveBeenCalledWith(
        {
          DropdownFieldName: 'user2',
        },
        expect.anything(),
      );
    });
  });
});

describe('Form', () => {
  it("should submit form with <Button type='submit' />", async () => {
    const user = userEvent.setup();
    const onSubmitSuccess = jest.fn();
    const onSubmitError = jest.fn();

    function Wrapper() {
      const formMethods = useForm();
      const Input = useFormInput({
        name: 'textInputName',
        label: 'Text Input Label',
        Input: TextInput,
      });

      return (
        <Form
          {...formMethods}
          onSubmitSuccess={onSubmitSuccess}
          onSubmitError={onSubmitError}
        >
          <Input />
          <Button type="submit" variant={ButtonVariant.ROUNDED}>
            Submit
          </Button>
        </Form>
      );
    }

    const { queryByRole } = render(<Wrapper />);
    const button = queryByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    await user.click(button as HTMLElement);

    expect(onSubmitError).not.toHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    expect(onSubmitSuccess).toHaveBeenCalledWith(
      {
        textInputName: undefined,
      },
      expect.anything(),
    );
  });

  it('should submit form with custom function', async () => {
    const user = userEvent.setup();
    const onSubmitSuccess = jest.fn();
    const onSubmitError = jest.fn();

    function Wrapper() {
      const formMethods = useForm();
      const Input = useFormInput({
        name: 'textInputName',
        label: 'Text Input Label',
        Input: TextInput,
      });

      return (
        <Form {...formMethods}>
          <Input />
          <Button
            onClick={formMethods.handleSubmit(onSubmitSuccess, onSubmitError)}
            variant={ButtonVariant.ROUNDED}
          >
            Submit
          </Button>
        </Form>
      );
    }

    const { queryByRole } = render(<Wrapper />);
    const button = queryByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    await user.click(button as HTMLElement);

    expect(onSubmitError).not.toHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    expect(onSubmitSuccess).toHaveBeenCalledWith(
      {
        textInputName: undefined,
      },
      expect.anything(),
    );
  });

  it('should update form value when typing', async () => {
    const user = userEvent.setup();
    const onSubmitSuccess = jest.fn();
    const onSubmitError = jest.fn();
    let getValues;

    function Wrapper() {
      const formMethods = useForm();
      getValues = formMethods.getValues;
      const Input = useFormInput({
        name: 'textInputName',
        label: 'Text Input Label',
        Input: TextInput,
      });

      return (
        <Form
          {...formMethods}
          onSubmitSuccess={onSubmitSuccess}
          onSubmitError={onSubmitError}
        >
          <Input />
        </Form>
      );
    }

    const { queryByRole } = render(<Wrapper />);
    const input = queryByRole('textbox', { name: 'Text Input Label' });
    expect(input).toBeInTheDocument();
    await user.type(input as HTMLElement, 'This is a value that I typed');
    expect((getValues as unknown as () => unknown)()).toEqual({
      textInputName: 'This is a value that I typed',
    });
  });
});
