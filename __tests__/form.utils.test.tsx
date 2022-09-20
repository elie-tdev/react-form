import React from 'react';

import { TextInput } from '../../text-input/text-input';
import { useFormInput } from '../form.utils';

describe('useFormInput', () => {
  let useMemo: jest.SpyInstance;
  beforeEach(() => {
    useMemo = jest.spyOn(React, 'useMemo');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    useMemo.mockImplementation((m) => m());
  });

  it('should return memoized component', () => {
    const Input = useFormInput({
      name: 'InputName',
      label: 'inputLabel',
      Input: TextInput,
    });

    expect(useMemo).toHaveBeenCalledTimes(1);
    expect(typeof Input).toBe('function');
  });
});
