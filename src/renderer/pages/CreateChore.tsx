import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import ConvertMinutes from '../../helpers/ConvertMinutes';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        valueIsNumericString
      />
    );
  },
);

function CreateChore() {
  const push = useNavigate();
  const [values, setValues] = useState({
    name: '',
    timeEffortMinutes: null,
    repeatFrequencyDays: null,
    note: '',
    nextDue: dayjs().format('YYYY-MM-DD'),
    isOneTime: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = () => {
    const creatingChore = values;

    if (creatingChore.repeatFrequencyDays === null) {
      console.log(creatingChore);
      creatingChore.isOneTime = true;
    }

    console.log(creatingChore);

    fetch('http://localhost:8000/add-chore', {
      body: JSON.stringify(creatingChore),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        return push('/main');
      })
      .catch(() => {});
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl mb-4 w-full text-center text-white">
          Create Chore
        </h1>

        <div className="bg-gray-200 p-6 py-2 rounded-lg">
          <div className="flex flex-col gap-4 p-8 py-4 rounded-lg">
            <TextField
              id="standard-basic"
              color="info"
              name="name"
              label="Chore Name"
              variant="standard"
              onChange={handleChange}
              value={values.name}
            />

            <TextField
              id="formatted-numberformat-input"
              onChange={handleChange}
              label="Time Effort (minute)"
              name="timeEffortMinutes"
              value={values.timeEffortMinutes}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
              variant="standard"
            />

            <TextField
              label="Repeat Frequency (day)"
              value={values.repeatFrequencyDays}
              onChange={handleChange}
              name="repeatFrequencyDays"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
              className={classNames(
                'transition duration-300',
                values.isOneTime && 'opacity-0 invisible',
              )}
              variant="standard"
            />

            <div className="text-xs mt-2 -mb-2 text-gray-800">Start Date</div>
            <input
              type="date"
              className="px-2 text-gray-700"
              name="nextDue"
              value={values.nextDue}
              onChange={handleChange}
            />

            <TextField
              label="Note"
              value={values.note}
              onChange={handleChange}
              name="note"
              variant="standard"
            />

            <div className="flex">
              <input
                type="checkbox"
                name="isOneTime"
                value={values.isOneTime ? 1 : 0}
                onChange={() => {
                  setValues({
                    ...values,
                    isOneTime: !values.isOneTime,
                    repeatFrequencyDays: null,
                  });
                }}
              />
              <div className="ml-1 text-black text-xs">One time chore</div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="bg-black rounded-full px-2 mt-4 py-1 text-center text-md cursor-pointer  hover:bg-gray-800"
            onClick={handleCreate}
          >
            Create
          </div>

          <div
            aria-hidden="true"
            className="mt-2 text-center cursor-pointer rounded-full text-gray-800 hover:bg-gray-300 hover:bg-opacity-50 px-2 py-1"
            onClick={() => push('/main')}
          >
            Back
          </div>

          <div className="mt-2 text-center w-60 h-12">
            {values.timeEffortMinutes &&
              (values.repeatFrequencyDays || values.isOneTime) && (
                <div className="text-gray-400 opacity-50 text-xs">
                  * It will take{' '}
                  {ConvertMinutes(
                    values.isOneTime
                      ? values.timeEffortMinutes
                      : (values.timeEffortMinutes * 75 * 365) /
                          (values.repeatFrequencyDays ?? 1),
                  )}{' '}
                  days along your life.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateChore;
