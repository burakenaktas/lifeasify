import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
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
    choreName: '',
    timeEffortMinute: null,
    redoAfterDays: null,
    date: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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
                'linear-gradient(to right bottom, #FFDEAD 40%, #FFF5EE 100%)',
            }}
          >
            <TextField
              id="standard-basic"
              color="info"
              name="choreName"
              label="Chore Name"
              variant="standard"
              onChange={handleChange}
              value={values.choreName}
            />

            <TextField
              id="formatted-numberformat-input"
              onChange={handleChange}
              label="Time Effort (minute)"
              name="timeEffortMinute"
              value={values.timeEffortMinute}
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
              variant="standard"
            />

            <TextField
              label="Repeat Frequency (day)"
              value={values.redoAfterDays}
              onChange={handleChange}
              name="redoAfterDays"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
              variant="standard"
            />

            <div className="text-xs mt-2 -mb-2 text-gray-800">Start Date</div>
            <input
              type="date"
              className="px-2 text-gray-700"
              placeholder="Start date"
              name="date"
              value={values.date}
              onChange={handleChange}
            />
          </div>

          <div
            className="bg-blue-600 rounded-full px-2 mt-4 py-1 text-center text-md cursor-pointer hover:bg-blue-700"
            onClick={}
          >
            Create
          </div>
          <div
            className="mt-2 text-center cursor-pointer rounded-full hover:bg-gray-500 hover:bg-opacity-50 px-2 py-1"
            onClick={() => push('/main')}
          >
            Back
          </div>

          <div className="mt-2 max-w-xs mx-auto text-center">
            {values.timeEffortMinute && values.redoAfterDays && (
              <div className="text-gray-400 opacity-50 text-xs">
                * It will take{' '}
                {ConvertMinutes(
                  (values.timeEffortMinute * 75 * 365) / values.redoAfterDays,
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