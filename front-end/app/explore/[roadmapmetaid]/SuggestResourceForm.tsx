import { Box, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react";
import { modalStyle } from "../../create/createModalStyle";
import { SuggestResourceType } from "@/app/components/RoadmapResourcesSection";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

type SuggestResourceFormType = {
    setSuggestResourceData: Dispatch<SetStateAction<SuggestResourceType>>;
    resetForm: Dispatch<SetStateAction<SuggestResourceType>>;
};

const SuggestResourceForm = (setSuggestResourceData: SuggestResourceFormType) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState("");
    const [link, setLink] = useState<string>("");
    const [titleError, setTitleError] = useState<string | null>(null);
    const [typeError, setTypeError] = useState<string | null>(null);
    const [linkError, setLinkError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value);
    };

    const showHideModel = () => {
        const open = queryClient.getQueryData<boolean>(["showSuggestResourceForm"]);
        setOpen(open || false);
        queryClient.setQueryData(["showSuggestResourceForm"], false);
    };

    useQuery(["showSuggestResourceFormQuery"], showHideModel);

    const capitalizeFirstLetter = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleSubmit = () => {
        if (!title) {
            setTitleError("Title is required");
            setTimeout(() => setTitleError(null), 3000);
        }
        if (!type) {
            setTypeError("Type is required");
            setTimeout(() => setTypeError(null), 3000);
        }
        if (!link) {
            setLinkError("Link is required");
            setTimeout(() => setLinkError(null), 3000);
        }
        console.log(title + " " + type + " " + link);
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <div>
                    <InputLabel
                        className="ml-3 form-control"
                        id="demo-simple-topic-autowidth-label"
                    >
                        Title:
                    </InputLabel>
                    <TextField
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(capitalizeFirstLetter(e.target.value))}
                        placeholder="Enter Title!"
                        sx={{ m: 1, minWidth: "90%" }}
                        className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 form-control"
                    />

                    <FormControl sx={{ m: 1, minWidth: "90%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">
                            Type:
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={type}
                            onChange={handleChange}
                            autoWidth
                            label="Type: "
                            className="border-white"
                        >
                            <MenuItem value={"book"}>Book</MenuItem>
                            <MenuItem value={"website"}>Website</MenuItem>
                            <MenuItem value={"course"}>Online Course</MenuItem>
                        </Select>
                    </FormControl>

                    <InputLabel>
                    </InputLabel>
                    <TextField
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enter Link!"
                        sx={{ m: 1, minWidth: "90%" }}
                        className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 form-control"
                    />

                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            className="w-3/6 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                        >
                            Suggest
                        </button>
                    </div>
                </div>
            </Box>

        </Modal>
    )
}

export default SuggestResourceForm