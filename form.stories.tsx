import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { Meta, Story } from '@storybook/react';
import { isNil } from 'lodash';
import { FieldValues, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, ButtonVariant } from '../button/button';
import { SelectGroup } from '../select-group/select-group';
import { Ticket, tickets } from '../select-group/select-group.stories';
import { TextInput } from '../text-input/text-input';
import { Text } from '../text/text';

import { Form, FormProps } from './form';
import { useFormInput } from './form.utils';

interface FormTemplateProps<TFieldValues = FieldValues>
  extends FormProps<TFieldValues> {
  schema?: Parameters<typeof yupResolver>[0];
}

const extractLabel = (ticket: Ticket) => ticket.label;
const extractName = (ticket: Ticket) => ticket.name;

const Template: Story<FormTemplateProps> = function FormTemplate({
  enableDevtools = false,
  schema,
  onSubmitError,
  onSubmitSuccess,
}: FormTemplateProps) {
  const useFormProps: Parameters<typeof useForm>[0] = {};
  if (!isNil(schema)) {
    useFormProps.resolver = yupResolver(schema);
  }
  const formMethods = useForm(useFormProps);
  const NameInput = useFormInput({
    name: 'name',
    label: 'Name',
    Input: TextInput,
  });
  const TitleInput = useFormInput({
    label: 'Title',
    name: 'title',
    Input: TextInput,
  });
  const SuffixInput = useFormInput({
    name: 'suffix',
    label: 'Suffix',
    Input: TextInput,
  });

  const SelectGroupInput = useFormInput({
    name: 'remember',
    label: 'Remember me',
    Input: SelectGroup,
  });

  return (
    <Form
      {...formMethods}
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      enableDevtools={enableDevtools}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TitleInput fullWidth label="Title" />
        </Grid>
        <Grid item xs={6}>
          <NameInput fullWidth label="Name" />
        </Grid>
        <Grid item xs={3}>
          <SuffixInput fullWidth label="Suffix" />
        </Grid>
        <Grid item xs={12}>
          <SelectGroupInput
            options={tickets}
            extractLabel={extractLabel}
            extractName={extractName}
            label="Remember me"
            register={formMethods.register}
          />
        </Grid>
        <Grid item xs={4}>
          <Button type="submit" variant={ButtonVariant.ROUNDED}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Text>You can put anything in here!</Text>
        </Grid>
      </Grid>
    </Form>
  );
};

export default {
  component: Form,
  title: 'Form',
  argTypes: {
    schema: {
      table: {
        disable: true,
      },
    },
    onSubmitSuccess: {
      action: 'submitSuccess',
    },
    onSubmitError: {
      action: 'submitError',
    },
  },
} as Meta;

export const Primary = Template.bind({});
Primary.args = {
  enableDevtools: false,
};

export const Validation = Template.bind({});
Validation.args = {
  enableDevtools: false,
  schema: yup
    .object({
      name: yup.string().required(),
      title: yup.string().required(),
      suffix: yup.string(),
    })
    .required(),
};

export const Devtools = Template.bind({});
Devtools.args = {
  enableDevtools: true,
};
