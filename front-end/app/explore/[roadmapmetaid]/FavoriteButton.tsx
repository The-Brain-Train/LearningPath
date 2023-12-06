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
  <IconButton
    className="text-white cursor-pointer text-center"
    onClick={onClick}
  >
    {isFavorite ? (
      <Tooltip title="Favorite">
        <div>
          <FavoriteIcon />
          <div style={{ fontSize: "7px" }}>Unfavorite</div>
        </div>
      </Tooltip>
    ) : (
      <Tooltip title="Unfavorite">
        <div>
          <FavoriteBorderIcon />
          <div style={{ fontSize: "7px" }}>Favorite</div>
        </div>
      </Tooltip>
    )}
  </IconButton>
);
