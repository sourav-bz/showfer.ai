"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { comma } from "postcss/lib/list";
import { parse } from "node-html-parser";
import { createWorker } from "tesseract.js";

const getFileName = (link: string): string => {
  const hostname = new URL(link).hostname;
  return `links/${hostname.replace(/\./g, "-")}-links.md`;
};

export default function BotTraining() {
  const router = useRouter();
  const [link, setLink] = useState<string>("");
  const [links, setLinks] = useState<unknown[]>([]);
  const [botTrained, setBotTrained] = useState<boolean>(false);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set()); // New state for selected links
  const [selectAll, setSelectAll] = useState(false);

  const supabase = createClientComponentClient();

  // Add this function to get the user session
  const getUserSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  const handleFetchLinks = async () => {
    if (!link) {
      return;
    }

    const fileName = getFileName(link);

    // Get the user
    const user = await getUserSession();
    console.log("User:", user);

    if (!user) {
      console.error("User not authenticated");
      // Handle unauthenticated user (e.g., redirect to login)
      router.push("/login"); // Adjust the path as needed
      return;
    }

    // Check if links exist in Supabase storage
    const { data, error } = await supabase.storage
      .from("showfer")
      .download(fileName);

    if (data) {
      console.log("file exists", data);
      // If file exists, read its content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const storedLinks = content.split("\n").filter(Boolean);
        setLinks(storedLinks);
      };
      reader.readAsText(data);
    } else {
      console.log("file does not exist");
      // If file doesn't exist, fetch links from ScrapingBee
      const response = await axios.get("https://app.scrapingbee.com/api/v1/", {
        params: {
          api_key:
            "67UFI64EESFW50EFRX6ZP9ROHUW1FC4U685A3PBDR6QQZZA9PR45KJVWHMTM0D87O6733AYT0CAYDW2N",
          url: link,
          extract_rules: '{"all_links":{"selector":"a@href","type":"list"}}',
        },
      });

      const uniqueLinks = Array.from(new Set(response.data.all_links));
      setLinks(uniqueLinks);

      // Create and store the Markdown file
      const content = uniqueLinks.join("\n");
      const { error: uploadError } = await supabase.storage
        .from("showfer")
        .upload(fileName, content, {
          contentType: "text/markdown",
          upsert: true, // Add this line to allow overwriting existing files
        });
      if (uploadError) {
        console.error("Error storing links:", uploadError);
      }
    }
  };

  const handleStartTraining = async () => {
    console.log("Starting training");

    const user = await getUserSession();
    if (!user) {
      console.error("User not authenticated");
      router.push("/login");
      return;
    }

    const baseUrl = new URL(link).origin;
    const domainFolder = baseUrl
      .replace(/^https?:\/\//, "")
      .replace(/\./g, "-");

    console.log("domainFolder", domainFolder);
    console.log("selectedLinks", selectedLinks);

    // Convert Set to Array and process each link
    const selectedLinksArray = Array.from(selectedLinks);
    for (let i = 0; i < selectedLinksArray.length; i++) {
      const selectedLink = selectedLinksArray[i];
      console.log(
        `Processing link ${i + 1}/${selectedLinksArray.length}: ${selectedLink}`
      );

      const fullUrl = selectedLink.startsWith("/")
        ? `${baseUrl}${selectedLink}`
        : selectedLink;
      const fileName = `${fullUrl.split("/").pop() || "index"}.md`;

      console.log("fullUrl", fullUrl);
      console.log("fileName", fileName);

      try {
        // Scrape content and images
        const response = await axios.get(
          "https://app.scrapingbee.com/api/v1/",
          {
            params: {
              api_key:
                "67UFI64EESFW50EFRX6ZP9ROHUW1FC4U685A3PBDR6QQZZA9PR45KJVWHMTM0D87O6733AYT0CAYDW2N",
              url: fullUrl,
              extract_rules:
                '{"content":"body","images":{"selector":"img","type":"list","output":"@src"}}',
            },
          }
        );

        let content = response.data.content;
        const images = response.data.images;

        console.log("image and content scrapped");

        // Perform OCR on images
        let imageTexts = [];
        try {
          const worker = await createWorker("eng");
          imageTexts = await Promise.all(
            images.map(async (img) => {
              try {
                const {
                  data: { text },
                } = await worker.recognize(img);
                return text;
              } catch (ocrError) {
                console.error(`OCR failed for image: ${img}`, ocrError);
                return "OCR failed for this image";
              }
            })
          );
          await worker.terminate();
          console.log("OCR done on images");
        } catch (workerError) {
          console.error("Error creating or using OCR worker:", workerError);
          console.log("Skipping OCR due to error");
        }

        // Format content
        content = content.replace(/\s+/g, " ").trim();

        // Create markdown content
        let markdownContent = `# ${fullUrl}\n\n## Content\n\n${content}\n\n## Images\n\n`;
        images.forEach((img, index) => {
          markdownContent += `![Image ${index + 1}](${img})\n\n${
            imageTexts[index]
          }\n\n`;
        });

        console.log("markdown content created");

        // Store file in Supabase
        const { error: uploadError } = await supabase.storage
          .from("showfer")
          .upload(`${domainFolder}/${fileName}`, markdownContent, {
            contentType: "text/markdown",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Error storing file for ${fullUrl}:`, uploadError);
        } else {
          console.log(`Successfully stored file for ${fullUrl}`);
        }
      } catch (error) {
        console.error(`Error processing ${fullUrl}:`, error);
      }
    }

    // TODO: Create OpenAI assistant with the content and images
    // TODO: Store the assistant ID and document reference in Supabase
  };

  const toggleLinkSelection = (link: string) => {
    setSelectedLinks((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(link)) {
        newSelected.delete(link);
      } else {
        newSelected.add(link);
      }
      return newSelected;
    });
  };

  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
    setSelectedLinks(new Set(selectAll ? [] : (links as string[])));
  }, [selectAll, links]);

  const handleDeleteLink = useCallback((linkToDelete: string) => {
    setLinks((prevLinks) =>
      (prevLinks as string[]).filter((link) => link !== linkToDelete)
    );
    setSelectedLinks((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(linkToDelete);
      return newSelected;
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <main className="flex h-full">
        <div className="w-2/3 h-full p-[40px] relative flex flex-col items-center justify-center">
          {links.length > 0 && (
            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E3E4EC] to-transparent"></div>
          )}
          <div>
            <h1 className="text-[24px] font-medium mb-4 text-left w-full flex items-center">
              <Image
                src="/icons/back.svg"
                alt="Back"
                width={24}
                height={24}
                className="mr-2 cursor-pointer"
                onClick={() => router.back()}
              />
              Train your website here.
            </h1>
            <p className="mb-[46px] text-[#8F93A5] text-[14px] max-w-[500px] leading-[1.5] ">
              Give your own personality to your website by training them here or
              you can connect to the Shopify as well.
            </p>

            <div className="flex">
              <div
                className="bg-white pt-[30px] px-[30px] rounded-[15px] w-[700px]"
                style={{
                  boxShadow: `0px 585px 164px 0px rgba(98, 95, 145, 0.00), 0px 374px 150px 0px rgba(98, 95, 145, 0.01), 0px 211px 126px 0px rgba(98, 95, 145, 0.05), 0px 23px 51px 0px rgba(98, 95, 145, 0.10)`,
                }}
              >
                <h2 className="text-[24px] font-medium mb-1">Add new link</h2>
                <div className="text-[#8F93A5] text-[14px] mb-[30px]">
                  You can add new additional links here
                </div>
                <div className=" text-[16px] mb-1">Website URL</div>
                <input
                  type="text"
                  placeholder="Paste your website URL here"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2 rounded-[10px] mb-[50px] bg-[#F0F2F7] outline-none placeholder:text-[#8F93A5] placeholder:text-[14px]"
                />
                <div className="border-t border-[#E3E4EC] py-[15px] flex justify-end">
                  <button
                    className="bg-[#6D67E4] text-white px-4 py-2 rounded-[10px] w-[135px] h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFetchLinks}
                    disabled={!link || links.length > 0}
                  >
                    Fetch Links
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-[40px] flex flex-col items-center relative">
              <div className="w-[452px] h-[1px] bg-gradient-to-r from-transparent via-[#E3E4EC] to-transparent"></div>
              <p className="text-center text-gray-500 bg-[#F0F2F7] px-2 absolute top-0 -mt-2.5">
                or connect with
              </p>
              <button className="mt-[40px] flex items-center justify-center bg-[#E3E4EC] px-[25px] py-[10px] rounded-[10px]">
                <Image
                  src="/icons/shopify-logo.svg"
                  alt="Shopify"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Shopify
              </button>
            </div>
          </div>
        </div>
        {links.length > 0 && (
          <div className="w-1/3 p-8 flex items-center justify-center">
            <div className="w-[450px]">
              <div className="text-center text-sm text-gray-500 flex items-center mb-[40px]">
                <Image
                  src="/icons/info-circle.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <div className="text-[16px] text-[#FF3B30]">
                  You can train up to 10 links for free.
                </div>
              </div>
              <h2 className="text-[16px] font-medium mb-[15px] flex items-center">
                <Image
                  src={
                    selectAll
                      ? "/icons/tick-square.svg"
                      : "/icons/untick-square.svg"
                  }
                  alt="Select All"
                  width={16}
                  height={16}
                  className="mr-[5px] cursor-pointer"
                  onClick={handleSelectAll}
                />
                <div>Links found ({links.length})</div>
              </h2>
              <div className="overflow-y-auto h-[500px]">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded mb-[15px] relative group"
                  >
                    <Image
                      src={
                        selectedLinks.has(link)
                          ? "/icons/tick-square.svg"
                          : "/icons/untick-square.svg"
                      }
                      alt="Link"
                      width={16}
                      height={16}
                      className="mr-[5px] cursor-pointer"
                      onClick={() => toggleLinkSelection(link)}
                    />
                    <span className="text-[14px] w-[250px] truncate">
                      {link}
                    </span>
                    <span className="absolute top-0 left-0 transform -translate-y-full bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {link}
                    </span>
                    <div
                      className="cursor-pointer bg-[#FF3B301A] rounded-[6px] w-[30px] h-[30px] flex items-center justify-center ml-auto"
                      onClick={() => handleDeleteLink(link)}
                    >
                      <Image
                        src="/icons/delete.svg"
                        alt="Delete"
                        width={16}
                        height={16}
                        className=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-6 flex justify-end mt-auto">
        {
          <button
            className={`bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center ${
              links.length > 0 ? "" : "invisible"
            }`}
            onClick={handleStartTraining}
          >
            Start Training
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M10.5198 5.32L13.7298 8.53L15.6998 10.49C16.5298 11.32 16.5298 12.67 15.6998 13.5L10.5198 18.68C9.83977 19.36 8.67977 18.87 8.67977 17.92V12.31V6.08C8.67977 5.12 9.83977 4.64 10.5198 5.32Z"
                fill="white"
              />
            </svg>
          </button>
        }
      </footer>
    </div>
  );
}
