import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton, Tooltip } from "@mui/material";

type FavoriteButtonProps = {
  onClick: () => void;
  isFavorite: boolean;
};

export const FavoriteButton = ({
  onClick,
  isFavorite,
}: FavoriteButtonProps) => (
  <IconButton className="text-white cursor-pointer" onClick={onClick}>
    {isFavorite ? (
      <Tooltip title="Favorite">
        <FavoriteIcon />
      </Tooltip>
    ) : (
      <Tooltip title="Unfavorite">
        <FavoriteBorderIcon />
      </Tooltip>
    )}
  </IconButton>
);
