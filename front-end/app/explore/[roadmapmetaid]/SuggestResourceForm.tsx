import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { useState } from "react";
import { modalStyle } from "../../util/modalStyle";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { postNotification } from "../../functions/httpRequests";
import { ResourceListType, RoadmapMeta } from "../../util/types";
import { resourceSuggestedMessage } from "../../util/constants";

type SuggestResourceFormType = {
  roadmapMetaId: string | undefined;
  userEmail: string | null | undefined;
  cookiesUser: string;
};

const SuggestResourceForm = (props: SuggestResourceFormType) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState("");
  const [link, setLink] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const showHideModel = () => {
    const open =
      queryClient.getQueryData<boolean>(["showSuggestResourceForm"]) || false;
    setOpen(open);
    queryClient.setQueryData(["showSuggestResourceForm"], false);
    return open;
  };

  const { data: showSuggestResourceFormQuery } =
    useQuery(["showSuggestResourceFormQuery"], showHideModel);

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const resetForm = () => {
    setName("");
    setType("");
    setLink("");
  };

  const handleSubmit = () => {
    if (!name) {
      setNameError("Name is required");
      setTimeout(() => setNameError(null), 3000);
    }
    if (!type) {
      setTypeError("Type is required");
      setTimeout(() => setTypeError(null), 3000);
    }
    if (!link) {
      setLinkError("Link is required");
      setTimeout(() => setLinkError(null), 3000);
    }

    const body: ResourceListType = {
      resources: [{ name: name, type: type, link: link }]
    };
    const roadmapMeta =
      queryClient.getQueryData<RoadmapMeta>(
        [`roadmapMeta-${props.roadmapMetaId}`]
      );

    postNotification(
      resourceSuggestedMessage,
      JSON.stringify(body),
      props.userEmail,
      roadmapMeta?.userEmail,
      roadmapMeta?.id,
      "ROADMAP_RESOURCE_SUGGESTED",
      props.cookiesUser
    );

    resetForm();
    handleClose();
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
            className="ml-3 form-control text-center mb-4"
            id="demo-simple-topic-autowidth-label"
          >
            Suggest Resource
          </InputLabel>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
            placeholder="Enter Resource Name!"
            sx={{ m: 1, minWidth: "90%" }}
            className="pt-0 rounded-l-md focus:outline-none focus:placeholder-gray-400 text-center placeholder-gray-60 form-control"
          />

          <FormControl sx={{ m: 1, minWidth: "90%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Type of Resource
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
              <MenuItem value={"Book"}>Book</MenuItem>
              <MenuItem value={"Website"}>Website</MenuItem>
              <MenuItem value={"Online Course"}>Online Course</MenuItem>
            </Select>
          </FormControl>

          <InputLabel>
          </InputLabel>
          <TextField
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter Resource Link!"
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
  );
};

export default SuggestResourceForm;