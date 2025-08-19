import React from "react";
import { IconButton } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const ArrowBack = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <IconButton
      className="!mb-8"
      sx={{ display: { xs: "block", sm: "none" } }}
      aria-label="back"
      size="small"
      onClick={handleBack}
    >
      <ArrowBackIos fontSize="inherit" />
    </IconButton>
  );
};

export default ArrowBack;
