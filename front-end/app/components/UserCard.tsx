"use client"
import { UserCardProps } from "../util/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Card({ user }: UserCardProps) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [cookies] = useCookies(["user"]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log(user);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        if (user?.email == undefined) return;
        const response = await fetch(`${BACKEND_URL}/api/users/${user.email}/profileImage`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + cookies.user,
          },
          body: formData,
        });

        if (response.ok) {
          const responseText = await response.text();
          console.log(responseText);
          console.log("Profile picture uploaded successfully");
        } else {
          console.error("Profile picture upload failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const fetchImageSource = async () => {
    if (user?.email == undefined) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${user.email}/profileImage`, {
        headers: {
          Authorization: "Bearer " + cookies.user,
        },
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setImageSrc(imageUrl);
      } else {
        console.error("Failed to fetch image source");
      }
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
      <div className="border-4 dark:border-slate-500 drop-shadow-xl text-slate-300 rounded-full mx-auto ">
        {imageSrc ? (
          <Image src={imageSrc} width={220} height={220} alt="User profile picture" />
        ) : (
          <Image src="/icon-profile.png" width={220} height={220} alt="User profile picture" />
        )}
      </div>
      <input type="file" onChange={handleFileChange} required />
      <button onClick={handleUpload}>Confirm</button>
    </section>
  );
}
