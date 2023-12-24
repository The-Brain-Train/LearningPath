"use client";
import { UserProps } from "../util/types";
import Image from "next/legacy/image";
import { useCookies } from "react-cookie";
import {
  getUserProfilePicture,
  postUserProfilePicture,
} from "../functions/httpRequests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "@mui/material";

export default function Card({ currentUser }: UserProps) {
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const uploadProfilePicture = useMutation<string, Error, FormData>(
    (formData: FormData) => {
      if (currentUser?.email == undefined) {
        throw new Error("User email is undefined.");
      }
      return postUserProfilePicture(currentUser.email, formData, cookies.user);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["profilePictureUrl"]);
      },
      onError: (error) => {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(null), 5000);
      },
    }
  );

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await uploadProfilePicture.mutateAsync(formData);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const { data: profilePictureUrl } = useQuery<string>(
    ["profilePictureUrl"],
    () => getUserProfilePicture(currentUser?.email as string, cookies.user),
    {
      enabled: !!cookies.user,
    }
  );

  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <div className="flex flex-col text-center items-center p-6  rounded-lg font-bold text-2xl text-white">
        Hello {currentUser?.name}!
      </div>
      <div className="h-64 w-64 rounded-full overflow-hidden">
        {profilePictureUrl ? (
          <Image
            src={profilePictureUrl}
            width={250}
            height={250}
            layout="responsive"
            alt="User profile picture"
            className="rounded-full"
            priority
          />
        ) : (
          <Image
            src="/icon-profile.png"
            width={250}
            height={250}
            alt="User profile picture"
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <label className="text-white underline cursor-pointer text-sm">
          Change Profile Picture
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            required
          />
        </label>
        {errorMessage &&
          <Alert className="mt-3" severity="error" variant="filled">
            {errorMessage}
          </Alert>
        }
      </div>
    </div>
  );
}
