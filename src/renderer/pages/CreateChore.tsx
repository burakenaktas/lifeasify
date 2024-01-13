import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import dayjs from 'dayjs';
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
    fetch('http://localhost:8000/add-chore', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return push('/main');
      })
      .catch((err) => {});
  };

  return (
    <div>
      <div className="flex flex-row">
        <div>
          <h1 className="text-2xl mb-4 w-full text-center">Create Chore</h1>

          <div
            className="flex flex-col gap-4 p-8 rounded-lg"
            style={{
              background:
                'linear-gradient(to right bottom, #fffbe4 40%, #FFF5EE 100%)',
            }}
          >
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

            {!values.isOneTime && (
              <TextField
                label="Repeat Frequency (day)"
                value={values.repeatFrequencyDays}
                onChange={handleChange}
                name="repeatFrequencyDays"
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                }}
                variant="standard"
              />
            )}

            <TextField
              label="Note"
              value={values.note}
              onChange={handleChange}
              name="note"
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

            <div className="flex">
              <input
                type="checkbox"
                name="isOneTime"
                value={values.isOneTime}
                onChange={() => {
                  console.log(values.isOneTime);
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
            className="bg-blue-600 rounded-full px-2 mt-4 py-1 text-center text-md cursor-pointer hover:bg-blue-700"
            onClick={handleCreate}
          >
            Create
          </div>
          <div
            className="mt-2 text-center cursor-pointer rounded-full hover:bg-gray-500 hover:bg-opacity-50 px-2 py-1"
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
                          values.repeatFrequencyDays,
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
