import AddCandidateMenuItem from "@/components/menus/AddCandidateMenu/AddCandidateMenuItem";
import BatchAddCandidateMenuItem from "@/components/menus/AddCandidateMenu/BatchAddCandidateMenuItem";
import { Mutate } from "@/hooks/useFetch";
import { GetCandidatesResponse } from "@/types/api";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Menu } from "@mui/material";
import { FC, MouseEvent, useState } from "react";

type Props = {
  voteEventId: number;
  mutate: Mutate<GetCandidatesResponse>;
};

const AddCandidateMenuFactory = {
  generateItems: (
    voteEventId: number,
    handleCloseMenu: () => void,
    mutateCandidates: Mutate<GetCandidatesResponse>
  ) => {
    const menuItems = [
      <AddCandidateMenuItem
        key={"add-candidate-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateCandidates={mutateCandidates}
      />,
      <BatchAddCandidateMenuItem
        key={"batch-add-candidate-modal-item"}
        voteEventId={voteEventId}
        handleCloseMenu={handleCloseMenu}
        mutateCandidates={mutateCandidates}
      />,
    ];

    return menuItems;
  },
};

const AddCandidateMenu: FC<Props> = ({ voteEventId, mutate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="add-candidate-menu-button"
        variant="outlined"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
      >
        Add Candidates
      </Button>
      <Menu
        id="add-external-voter-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {AddCandidateMenuFactory.generateItems(
          voteEventId,
          handleClose,
          mutate
        )}
      </Menu>
    </>
  );
};
export default AddCandidateMenu;
