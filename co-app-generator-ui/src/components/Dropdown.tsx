import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<ProjectOptionType>();

export const ProjectRepoDropdown = (props: any) => {
  const [value, setValue] = React.useState<ProjectOptionType | null>(null);
  return (
    <Autocomplete
      size="small"
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            key: newValue,
            name: newValue,
          });
          props.setSelected({ key: newValue, name: newValue });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            key: newValue.inputValue,
            name: newValue.inputValue,
          });
          props.setSelected({
            key: newValue.inputValue,
            name: newValue.inputValue,
          });
        } else {
          setValue(newValue);
          props.setSelected(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.key);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            key: `Add "${inputValue}"`,
            name: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      clearOnBlur
      handleHomeEndKeys
      id={props.label}
      options={props.list || []}
      disabled={props.list == null}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.key;
      }}
      renderOption={(props, option) => <li {...props}>{option.key}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
};

interface ProjectOptionType {
  inputValue?: string;
  name: string;
  key: string;
}
