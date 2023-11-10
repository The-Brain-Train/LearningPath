import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type FavoriteButtonProps = {
  onClick: () => void;
  isFavorite: boolean;
};

export const FavoriteButton = ({ onClick, isFavorite }: FavoriteButtonProps) => (
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm md:text-xl" onClick={onClick}>
    {isFavorite ? (
      <p>
        <FavoriteIcon /> Remove from favorites
      </p>
    ) : (
      <p>
        <FavoriteBorderIcon /> Add to favorites
      </p>
    )}
  </button>
);
