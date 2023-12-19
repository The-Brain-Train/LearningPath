// File: PasswordRequirements.tsx

import React from "react";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface PasswordRequirementsProps {
  validationChecks: {
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
    minLength: boolean;
  };
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  validationChecks,
}) => {
  return (
    <div className=" mb-9" >
      <Typography variant="body2" className="text-white font-semibold">
        Password Requirements
      </Typography>
      <ul className="text-white text-xs">
        <li>
          {validationChecks.uppercase ? (
            <>
              <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} /> At
              least one Uppercase letter
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At least
              one Uppercase letter
            </>
          )}
        </li>
        <li>
          {validationChecks.lowercase ? (
            <>
              <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} /> At
              least one Lowercase letter
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At least
              one Lowercase letter
            </>
          )}
        </li>
        <li>
          {validationChecks.number ? (
            <>
              <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} /> At
              least one Number
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At least
              one Number
            </>
          )}
        </li>
        <li>
          {validationChecks.specialChar ? (
            <>
              <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} /> At
              least one Special character e.g.: @#$%^&+=*!-
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At least
              one Special character e.g.: @#$%^&+=*!-
            </>
          )}
        </li>
        <li>
          {validationChecks.minLength ? (
            <>
              <CheckCircleIcon sx={{ color: "#0e9f6e", fontSize: 15 }} /> At
              least 8 characters
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: "gray", fontSize: 15 }} /> At least
              8 characters
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
