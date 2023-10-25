"use client";
import { UserCardProps } from "../util/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getUserProfilePicture, postUserProfilePicture } from "../functions/httpRequests";

export default function Card({ user }: UserCardProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [cookies] = useCookies(["user"]);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      if (user?.email == undefined) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const profilePictureUrl = await postUserProfilePicture(user?.email, formData, cookies.user)
          setImageSrc(profilePictureUrl);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const fetchImageSource = async () => {
    if (user?.email == undefined) return;
    try {
      const profilePictureUrl = await getUserProfilePicture(user?.email, cookies.user);
      setImageSrc(profilePictureUrl);
    } catch (error) {
      console.error("An error occurred while fetching image source:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchImageSource();
    }
  }, [user]);

  return (
    <section className="flex flex-col gap-1 ">
      <div className="flex flex-col text-center items-center p-6  rounded-lg font-bold text-2xl text-white">
        Hello {user?.name}!
      </div>
      <div className="h-64 w-64 relative rounded-full overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            width={250}
            height={250}
            layout="responsive"
            alt="User profile picture"
            className="rounded-full"
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
      <div className="ml-14">
          <label className="text-white underline cursor-pointer text-sm">
            Change Profile Picture
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>
    </section>
  );
}
