import { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FaCloudUploadAlt, FaEye, FaEyeSlash, FaSearch as SearchIcon } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { countryCode } from '../constants/codeCountry.constant';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export const InputField = ({
    inputType,
    isRequired,
    label,
    type = 'text',
    value = "",
    name,
    minDate,
    maxDate,
    prefix,
    suffix,
    fullWidth = false,
    error = false,
    hidden = false,
    errorMessage,
    onChange,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedCode, setSelectedCode] = useState('+226');
    const [fileName, setFileName] = useState(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handlePhoneChange = useCallback((e) => {
        const sanitizedPhone = DOMPurify.sanitize(e.target.value.replace(/[^0-9]/g, ''));
        const event = {
            target: {
                name: name,
                value: `${selectedCode}${sanitizedPhone}`,
            }
        };
        onChange(event);
    }, [onChange, selectedCode, name]);

    const handleCountryCodeChange = useCallback((event) => {
        setSelectedCode(event.target.value);
        const eventObject = {
            target: {
                name: name,
                value: `${event.target.value}${value.replace(selectedCode, '')}`,
            }
        };
        onChange(eventObject);
    }, [onChange, selectedCode, value, name]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(DOMPurify.sanitize(file.name));
            onChange(e);
        }
    }, [onChange]);

    return (
        <FormControl sx={{mb:3}} variant="outlined" fullWidth={fullWidth} error={error}>
            {label && (
                <InputLabel sx={{ fontSize: "13px", display: 'flex', alignItems: 'center' }}>
                    {label}
                    {isRequired && (
                        <span style={{ color: 'red', marginLeft: 5 }}>*</span>
                    )}
                </InputLabel>
            )}

            {inputType === 'file' ? (
                <>
                    <OutlinedInput
                        startAdornment={<InputAdornment position='start'><FaCloudUploadAlt /></InputAdornment>}
                        type='file'
                        label={label}
                        id={name}
                        name={name}
                        hidden={hidden}
                        onChange={handleFileChange}
                        {...props}
                    />
                    {/* Display file name for user reference */}
                    {fileName && (
                        <FormHelperText sx={{ display: "none" }} >{fileName}</FormHelperText>
                    )}
                </>
            ) : (
                <OutlinedInput
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={inputType === 'phone' ? value.replace(selectedCode, '') : value}
                    onChange={inputType === 'phone' ? handlePhoneChange : onChange}
                    name={name}
                    inputProps={type === 'date' ? { min: minDate, max: maxDate } : {}} startAdornment={
                        inputType === 'phone' ? (
                            <InputAdornment position="start">
                                <Select
                                    variant="standard"
                                    value={selectedCode}
                                    onChange={handleCountryCodeChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Country Code' }}
                                    sx={{ minWidth: 80 }}
                                >
                                    {countryCode.map((country) => (
                                        <MenuItem key={country.code} value={country.code}>
                                            {`${country.flag} ${country.code} ${country.label}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </InputAdornment>
                        ) : (
                            prefix && <InputAdornment position="start">{prefix}</InputAdornment>
                        )
                    }
                    endAdornment={
                        suffix ? (
                            <InputAdornment position="end">{suffix}</InputAdornment>
                        ) : (
                            type === 'password' && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        )
                    }
                    label={label}
                    {...props}
                />
            )}
            {error && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
};

InputField.propTypes = {
    inputType: PropTypes.oneOf(['phone', 'email', 'file']),
    label: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'password', 'file', 'date', 'number', 'time']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    fullWidth: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    onChange: PropTypes.func,
    hidden: PropTypes.bool,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    isRequired: PropTypes.bool,
};


export const SelectField = ({
    name,
    label,
    options,
    value,
    onChange,
    isRequired,
    helperText,
    error,
    hidden = false,
    native = false,
    multiple = false,
    enableSearch = true,
    searchPlaceholder = "Search options...",
    prefixIcon = null, // ADD THIS - Optional prefix icon for the select input
    showIconInValue = true, // New prop to control icon display in selected value
    ...props
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);

    // Ensure value is always an array if multiple is true
    const valueToUse = multiple ? (Array.isArray(value) ? value : []) : value;

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!enableSearch || !searchTerm.trim()) {
            return options || [];
        }

        const term = searchTerm.toLowerCase();
        return options?.filter((option) =>
            option.value.toLowerCase().includes(term) ||
            option.key.toLowerCase().includes(term) ||
            (option.description && option.description.toLowerCase().includes(term))
        ) || [];
    }, [options, searchTerm, enableSearch]);

    const handleChange = (event) => {
        const { value } = event.target;
        // Pass both name and value to onChange so handleInputChange receives them
        onChange({
            target: {
                name,
                value: multiple
                    ? typeof value === 'string' ? value.split(',') : value
                    : value,
            },
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
        setSearchTerm(''); // Reset search when opening
    };

    const handleClose = () => {
        setOpen(false);
        setSearchTerm(''); // Reset search when closing
    };

    // Helper function to render option content with icon
    const renderOptionContent = (option, showIcon = true) => (
        <Box display="flex" alignItems="center" gap={1}>
            {showIcon && option.icon && (
                <Box 
                    component="span" 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        minWidth: '20px',
                        '& > *': {
                            fontSize: '1.2rem'
                        }
                    }}
                >
                    {option.icon}
                </Box>
            )}
            <span>{option.value}</span>
        </Box>
    );

    // Custom MenuProps to include search input
    const menuProps = {
        PaperProps: {
            style: {
                maxHeight: enableSearch ? 48 * 4.5 + 8 + 56 : 48 * 4.5 + 8, // Extra height for search input
                width: 250,
            },
        },
        autoFocus: false,
        onClose: handleClose,
    };

    return (
        <Box sx={{ width: '100%' }}>
            <FormControl fullWidth variant="outlined" error={error}>
                {label && (
                    <InputLabel sx={{ fontSize: "13px", display: 'flex', alignItems: 'center' }}>
                        {label}
                        {isRequired && (
                            <span style={{ color: 'red', marginLeft: 2 }}>*</span>
                        )}
                    </InputLabel>
                )}
                <Select
                    label={label}
                    value={multiple ? valueToUse : value}
                    onChange={handleChange}
                    input={
                        <OutlinedInput 
                            label={label}
                            startAdornment={prefixIcon && (
                                <InputAdornment position="start">
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            color: 'action.active',
                                            '& > *': {
                                                fontSize: '1.25rem'
                                            }
                                        }}
                                    >
                                        {prefixIcon}
                                    </Box>
                                </InputAdornment>
                            )}
                        />
                    }
                    multiple={multiple}
                    hidden={hidden}
                    open={open}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    renderValue={(selected) => {
                        if (multiple) {
                            const selectedOptions = selected
                                .map((sel) => {
                                    const option = options?.find((opt) => opt.key === sel);
                                    return option;
                                })
                                .filter(Boolean);

                            return (
                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                    {selectedOptions?.map((option) => (
                                        <Chip
                                            key={option.key}
                                            size="small"
                                            label={
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    {showIconInValue && option.icon && (
                                                        <Box 
                                                            component="span" 
                                                            sx={{ 
                                                                display: 'flex', 
                                                                alignItems: 'center',
                                                                '& > *': {
                                                                    fontSize: '0.875rem'
                                                                }
                                                            }}
                                                        >
                                                            {option.icon}
                                                        </Box>
                                                    )}
                                                    <span>{option.value}</span>
                                                </Box>
                                            }
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            );
                        } else {
                            const selectedOption = options?.find((opt) => opt.key === selected);
                            return selectedOption 
                                ? renderOptionContent(selectedOption, showIconInValue)
                                : '';
                        }
                    }}
                    MenuProps={menuProps}
                    native={native && !multiple}
                    {...props}
                >
                    {/* Search Input - only show if enableSearch is true and not native */}
                    {enableSearch && !native && (
                        <Box sx={{ px: 2, py: 1, position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onClick={(e) => e.stopPropagation()} // Prevent menu from closing
                                onKeyDown={(e) => e.stopPropagation()} // Prevent menu from closing
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'background.default',
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {/* No results message */}
                    {enableSearch && !native && filteredOptions.length === 0 && searchTerm && (
                        <MenuItem disabled>
                            <ListItemText primary="No options found" />
                        </MenuItem>
                    )}

                    {/* Render options */}
                    {native && !multiple
                        ? options?.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))
                        : filteredOptions?.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                <Tooltip title={option.description} arrow>
                                    <Box display={'flex'} alignItems='center' width="100%">
                                        {multiple && <Checkbox checked={valueToUse?.includes(option.key)} />}
                                        <ListItemText
                                            primary={renderOptionContent(option)}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        // Highlight search term
                                                        ...(enableSearch && searchTerm && {
                                                            '& mark': {
                                                                backgroundColor: 'primary.light',
                                                                color: 'primary.contrastText',
                                                                padding: '0 2px',
                                                                borderRadius: '2px',
                                                            }
                                                        })
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Tooltip>
                            </MenuItem>
                        ))}
                </Select>
                {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </Box>
    );
};

SelectField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            value: PropTypes.string,
            description: PropTypes.string, // Optional description for tooltip
            icon: PropTypes.node, // Optional icon for individual options
        })
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    onChange: PropTypes.func,
    helperText: PropTypes.string,
    native: PropTypes.bool,
    error: PropTypes.bool,
    multiple: PropTypes.bool,
    hidden: PropTypes.bool,
    isRequired: PropTypes.bool,
    enableSearch: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    prefixIcon: PropTypes.node, // Optional prefix icon for the select input
    showIconInValue: PropTypes.bool, // Control icon display in selected value
};


export const TextArea = ({
  id,
  label,
  placeholder = '',
  multiline = true,
  maxRows,
  rows,
  isRequired = false,
  defaultValue,
  value = '',
  onChange,
  name,
  error = false,
  helperText = '',
  variant = 'outlined',
  maxWordCount = 400,
  ...props
}) => {
  const [wordCount, setWordCount] = useState(() =>
    value?.trim()?.split(/\s+/)?.filter(Boolean)?.length || 0
  );
  const [wordCountError, setWordCountError] = useState('');

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const count = inputValue.trim().split(/\s+/).filter(Boolean).length;

    if (count > maxWordCount) {
      setWordCountError(`Maximum word count of ${maxWordCount} exceeded.`);
    } else {
      setWordCountError('');
    }

    setWordCount(count);
    onChange?.(event);
  };

  return (
    <Box>
      {label && (
        <InputLabel htmlFor={id} sx={{ fontSize: 13, mb: 0.5 }}>
          {label} {isRequired && <span style={{ color: 'red' }}>*</span>}
        </InputLabel>
      )}

      <TextField
        id={id}
        name={name}
        placeholder={placeholder}
        multiline={multiline}
        maxRows={maxRows}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        error={error || Boolean(wordCountError)}
        helperText={wordCountError || helperText}
        variant={variant}
        fullWidth
        {...props}
      />

      <Typography
        variant="body2"
        color={wordCount > maxWordCount ? 'error' : 'text.secondary'}
        align="right"
        mt={1}
      >
        {`Word Count: ${wordCount} / ${maxWordCount}`}
      </Typography>
    </Box>
  );
};

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  maxRows: PropTypes.number,
  rows: PropTypes.number,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.bool,
  isRequired: PropTypes.bool,
  helperText: PropTypes.string,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  maxWordCount: PropTypes.number,
};

