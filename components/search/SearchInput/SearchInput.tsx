import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  id: string;
  label: string;
  onChange: (searchText: string) => void;
};

const SearchInput: FC<Props> = ({ id, label, onChange }) => {
  const [searchTextInput, setSearchTextInput] = useState("");

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    onChange(e.target.value);
  };

  return (
    <TextField
      id={id}
      label={label}
      value={searchTextInput}
      onChange={handleSearchInputChange}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
};
export default SearchInput;
