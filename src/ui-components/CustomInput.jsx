import TextField from '@mui/material/TextField';
import "./input.css";

function CustomInputField({
  type,
  name,
  value,
  placeholder,
  onChange,
  fullWidth,
  size,
  inputProps,
  InputProps,
  error,
  helperText,
  onBlur,
  disabled,
  id,
  onClick,
  select,
  color,
  sx
}) {
  return (
    <>
      <TextField
        onClick={onClick}
        id={id}
        select={select}
        fullWidth={fullWidth}
        variant="outlined"
        size={size || "small"}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        error={error}
        inputProps={{ ...inputProps }}
        InputProps={InputProps}
        placeholder={placeholder}
        onChange={onChange}
        helperText={helperText}
        onBlur={onBlur}        
        className={
          error
            ? "custom-textfield-error"
            : disabled
            ? "disabled-textfield"
            : color === "purple"
            ? "custom-textfield-purple"
            : "custom-textfield"
        }
        style={{...sx}}
      />
    </>
  );
}

export default CustomInputField;
