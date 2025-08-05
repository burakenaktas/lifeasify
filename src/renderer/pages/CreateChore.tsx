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
  });
  const [noTimeEffort, setNoTimeEffort] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = () => {
    // VALIDATIONS AND CONTROLS
    if (!values.timeEffortMinutes) {
      setNoTimeEffort(true);
      return;
    }

    const creatingChore = values;

    fetch('https://api.burak.solutions/add-chore', {
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
    <div className="w-full h-full">
      <div className="relative h-full w-full flex flex-col items-center p-6">
        <div className="flex flex-col h-full justify-center items-center w-full max-w-2xl">
          <div className="text-4xl font-bold mb-8 w-full text-center">
            <span className="bg-clip-text text-transparent text-white from-blue-400 to-purple-500">
              Create Chore
            </span>
          </div>

          <div className="w-full bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-600 shadow-lg">
            <div className="flex flex-col gap-6">
              <TextField
                id="standard-basic"
                color="primary"
                name="name"
                label="Chore Name"
                variant="standard"
                onChange={handleChange}
                value={values.name}
                className="text-white"
                InputLabelProps={{
                  className: 'text-gray-300',
                  style: { color: '#E5E7EB' },
                }}
                InputProps={{
                  className: 'text-white',
                  style: { color: '#FFFFFF' },
                }}
                sx={{
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#4B5563',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#6B7280',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#3B82F6',
                  },
                }}
              />

              <TextField
                id="formatted-numberformat-input"
                onChange={handleChange}
                label="Time Effort (minute)"
                name="timeEffortMinutes"
                error={noTimeEffort}
                value={values.timeEffortMinutes}
                InputProps={{
                  inputComponent: NumericFormatCustom as any,
                  className: 'text-white',
                  style: { color: '#FFFFFF' },
                }}
                InputLabelProps={{
                  className: 'text-gray-300',
                  style: { color: '#E5E7EB' },
                }}
                sx={{
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#4B5563',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#6B7280',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#3B82F6',
                  },
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
                  className: 'text-white',
                  style: { color: '#FFFFFF' },
                }}
                InputLabelProps={{
                  className: 'text-gray-300',
                  style: { color: '#E5E7EB' },
                }}
                sx={{
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#4B5563',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#6B7280',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#3B82F6',
                  },
                }}
                variant="standard"
              />

              <div className="flex flex-col gap-2 w-full">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                  htmlFor="start-date"
                  className="text-sm text-gray-300 w-full"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full"
                  name="nextDue"
                  value={values.nextDue}
                  onChange={handleChange}
                />
              </div>

              <TextField
                label="Note"
                value={values.note}
                onChange={handleChange}
                name="note"
                variant="standard"
                InputLabelProps={{
                  className: 'text-gray-300',
                  style: { color: '#E5E7EB' },
                }}
                InputProps={{
                  className: 'text-white',
                  style: { color: '#FFFFFF' },
                }}
                sx={{
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#4B5563',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#6B7280',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#3B82F6',
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all rounded-full px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleCreate}
              >
                Create
              </button>

              <button
                type="button"
                className="w-full bg-gray-700 hover:bg-gray-600 transition-colors rounded-full px-8 py-3 text-lg font-medium"
                onClick={() => push('/main')}
              >
                Back
              </button>
            </div>

            {values.timeEffortMinutes && values.repeatFrequencyDays && (
              <div className="w-40 mt-6 text-center">
                <div className="text-gray-300 text-sm">
                  * It will take{' '}
                  <span className="text-blue-400 font-medium">
                    {ConvertMinutes(
                      (values.timeEffortMinutes * 75 * 365) /
                        values.repeatFrequencyDays,
                    )}
                  </span>{' '}
                  days along your life.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateChore;
