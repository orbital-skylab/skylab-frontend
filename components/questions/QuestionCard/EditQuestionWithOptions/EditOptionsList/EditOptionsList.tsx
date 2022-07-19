import { ChangeEvent, FC } from "react";
// Types
import { Option } from "@/types/deadlines";
// Components
import { Delete } from "@mui/icons-material";
import { IconButton, Stack, TextField } from "@mui/material";

type Props = {
  options?: Option[];
  generateSetOption: (idx: number) => (option?: Option) => void;
  isOnlyOption: boolean;
};

const EditOptionsList: FC<Props> = ({
  options = [],
  generateSetOption,
  isOnlyOption,
}) => {
  const generateHandleChangeOption = (idx: number) => {
    const setOption = generateSetOption(idx);
    const handleChangeOption = (e: ChangeEvent<HTMLInputElement>) => {
      setOption(e.target.value);
    };
    return handleChangeOption;
  };

  const generateHandleDeleteOption = (idx: number) => {
    const setOption = generateSetOption(idx);
    const handleDeleteOption = () => {
      setOption();
    };
    return handleDeleteOption;
  };

  return (
    <Stack spacing="0.25rem" direction="column">
      {options.map((option, idx) => (
        <Stack key={idx} direction="row" spacing="0.5rem">
          <TextField
            className="option-input"
            value={option}
            onChange={generateHandleChangeOption(idx)}
            size="small"
            fullWidth
          />
          {!isOnlyOption ? (
            <IconButton color="error" onClick={generateHandleDeleteOption(idx)}>
              <Delete />
            </IconButton>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
};
export default EditOptionsList;
