"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ClipLoader from "react-spinners/ClipLoader";

const getFileName = (link: string): string => {
  const hostname = new URL(link).hostname;
  return `links/${hostname.replace(/\./g, "-")}-links.md`;
};

export default function BotTraining() {
  const router = useRouter();
  const [link, setLink] = useState<string>("");
  const [links, setLinks] = useState<string[]>([]);
  const [botTrained, setBotTrained] = useState<boolean>(false);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set()); // New state for selected links
  const [selectAll, setSelectAll] = useState(false);
  const [isFetchingLinks, setIsFetchingLinks] = useState(false);

  const [trainingStatus, setTrainingStatus] = useState<string>("untrained");
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [trainingLevels, setTrainingLevels] = useState([
    { name: "Fetching the information from the link", status: "not_started" },
    {
      name: "Structuring the information for AI to understand",
      status: "not_started",
    },
    { name: "We are creating your assistant", status: "not_started" },
    { name: "The assistant is ready", status: "not_started" },
  ]);
  const [progress, setProgress] = useState(0);

  const supabase = createClientComponentClient();

  type PayloadType = {
    new: {
      overall_status: string;
    };
  };

  const changes = supabase
    .channel("table-db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload: any) => {
        console.log("payload", payload);
        setTrainingStatus(payload.new.overall_status);
        if (payload.new.overall_status === "untrained") {
          setTrainingLevels([
            {
              name: "Fetching the information from the link",
              status: "in_progress",
            },
            {
              name: "Structuring the information for AI to understand",
              status: "not_started",
            },
            { name: "We are creating your assistant", status: "not_started" },
            { name: "The assistant is ready", status: "not_started" },
          ]);
          setProgress(20);
        } else if (payload.new.overall_status === "fetching_info") {
          setTrainingLevels([
            {
              name: "Fetching the information from the link",
              status: "completed",
            },
            {
              name: "Structuring the information for AI to understand",
              status: "in_progress",
            },
            { name: "We are creating your assistant", status: "not_started" },
            { name: "The assistant is ready", status: "not_started" },
          ]);
          setProgress(40);
        } else if (payload.new.overall_status === "structuring_info") {
          setTrainingLevels([
            {
              name: "Fetching the information from the link",
              status: "completed",
            },
            {
              name: "Structuring the information for AI to understand",
              status: "completed",
            },
            { name: "We are creating your assistant", status: "in_progress" },
            { name: "The assistant is ready", status: "not_started" },
          ]);
          setProgress(60);
        } else if (payload.new.overall_status === "creating_assistant") {
          setTrainingLevels([
            {
              name: "Fetching the information from the link",
              status: "completed",
            },
            {
              name: "Structuring the information for AI to understand",
              status: "completed",
            },
            { name: "We are creating your assistant", status: "completed" },
            { name: "The assistant is ready", status: "in_progress" },
          ]);
          setProgress(80);
        } else if (payload.new.overall_status === "trained") {
          setTrainingLevels([
            {
              name: "Fetching the information from the link",
              status: "completed",
            },
            {
              name: "Structuring the information for AI to understand",
              status: "completed",
            },
            { name: "We are creating your assistant", status: "completed" },
            { name: "The assistant is ready", status: "completed" },
          ]);
          setProgress(100);
          setTimeout(async () => {
            setIsTrainingDialogOpen(false);
            const updateUserOnboardingStatus = await fetch(
              "/api/users/update-onboarding",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ onboardingStatus: "training_done" }),
              }
            );
            router.push("/onboarding/playground");
          }, 2000);
        }
      }
    )
    .subscribe();

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

    // Get the user
    const user = await getUserSession();

    if (!user) {
      console.error("User not authenticated");
      router.push("/signin");
      return;
    }

    setIsFetchingLinks(true);
    // Check if links exist in Supabase storage
    const fileName = getFileName(link);

    const { data: files, error: listError } = await supabase.storage
      .from("showfer")
      .list();

    console.log("files", files);

    const { data, error } = await supabase.storage
      .from("showfer")
      .download(fileName);

    if (data) {
      console.log("file exists", data);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const storedLinks = content.split("\n").filter(Boolean);
        setLinks(storedLinks);
        setIsFetchingLinks(false);
      };
      reader.readAsText(data);
    } else {
      console.log("file does not exist");
      try {
        const session = await supabase.auth.getSession();
        const response = await axios.post(
          "http://127.0.0.1:3033/get-all-links",
          { url: link },
          {
            headers: {
              Authorization: `Bearer ${session.data.session?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const uniqueLinks = Array.from(new Set(response.data.links));
        setLinks(uniqueLinks as string[]);
        setIsFetchingLinks(false);
        const content = uniqueLinks.join("\n");
        const { error: uploadError } = await supabase.storage
          .from("showfer")
          .upload(fileName, content, {
            contentType: "text/markdown",
            upsert: true,
            metadata: {
              owner: user.id, // Set the owner metadata
            },
          });
        if (uploadError) {
          console.error("Error storing links:", uploadError);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    }
  };

  const handleStartTraining = async () => {
    console.log("Starting training");

    setIsTrainingDialogOpen(true);
    const user = await getUserSession();

    if (!user) {
      console.error("User not authenticated");
      router.push("/login");
      return;
    }

    try {
      // First, check if an assistant already exists for the user
      const checkResponse = await axios.get(
        `/api/assistant-settings?userId=${user.id}`
      );

      const domain = new URL(link).hostname;
      const botName = `${domain} Bot`;

      const assistantSettings = {
        name: botName,
        website_url: link,
        overall_status: "untrained",
        openai_assistant_id: null,
      };

      let response;
      if (false) {
        // Assistant exists, update it
        response = await axios.put(`/api/assistant-settings`, {
          ...assistantSettings,
          id: checkResponse.data.assistant.id,
        });
      } else {
        // Assistant doesn't exist, create a new one
        response = await axios.post(
          "/api/assistant-settings",
          assistantSettings
        );
      }

      if (response.status === 200) {
        console.log("Assistant settings saved successfully:", response.data);
        // You can update your UI or state here based on the response
        // setBotTrained(true);
        const session = await supabase.auth.getSession();
        const createAssistantResponse = await axios.post(
          "http://127.0.0.1:3033/create-assistant",
          {
            ...assistantSettings,
            id: response.data.data[0].id,
            list_of_links: Array.from(selectedLinks),
          },
          {
            headers: {
              Authorization: `Bearer ${session.data.session?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("createAssistantResponse", createAssistantResponse);
      } else {
        console.error("Error saving assistant settings:", response.data.error);
      }
    } catch (error) {
      console.error("Error in API call:", error);
    }
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
    setSelectedLinks(new Set(selectAll ? [] : links));
  }, [selectAll, links]);

  const handleDeleteLink = useCallback((linkToDelete: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link !== linkToDelete));
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
                    disabled={isFetchingLinks}
                    // disabled={!link || links.length > 0}
                  >
                    {isFetchingLinks ? (
                      <div className="flex items-center">
                        <ClipLoader
                          color="#ffffff"
                          size={16}
                          className="mr-2"
                        />
                        <span>Fetching...</span>
                      </div>
                    ) : (
                      "Fetch Links"
                    )}
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
              {/* {selectedLinks.size > 10 && (
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
              )} */}
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
                      {link as string}
                    </span>
                    <span className="absolute top-0 left-0 transform -translate-y-full bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {link as string}
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
        {trainingStatus === "trained" ? (
          <button
            className={`bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center ${
              links.length > 0 ? "" : "invisible"
            }`}
            onClick={() => router.push("/onboarding/playground")}
          >
            Next
            <Image
              src="/icons/right-arrow.svg"
              alt="Next"
              width={25}
              height={24}
            />
          </button>
        ) : (
          <button
            className={`bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
              links.length > 0 ? "" : "invisible"
            }`}
            onClick={handleStartTraining}
            disabled={
              isTrainingDialogOpen || selectedLinks.size === 0
              // || selectedLinks.size > 10
            }
          >
            {isTrainingDialogOpen ? (
              <div className="flex items-center">
                <ClipLoader color="#ffffff" size={16} className="mr-2" />
                Training...
              </div>
            ) : (
              <div className="flex items-center">
                Start Training
                <Image
                  src="/icons/right-arrow.svg"
                  alt="Next"
                  width={25}
                  height={24}
                />
              </div>
            )}
          </button>
        )}
      </footer>
      <Dialog
        open={isTrainingDialogOpen}
        onClose={() => {}}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w space-y-4 border bg-white p-12 rounded-lg">
            <DialogTitle className="text-[24px] font-medium mb-[24px]">
              Getting ready
            </DialogTitle>
            <div className="flex flex-col h-[180px] w-[500px] overflow-y-auto">
              {trainingLevels.map(
                (level, index) =>
                  level.status !== "not_started" && (
                    <div key={index} className="flex items-center mb-4">
                      {level.status === "in_progress" && (
                        <div className="w-5 h-5 mr-3">
                          <ClipLoader color="#6D67E4" size={20} />
                        </div>
                      )}
                      {level.status === "completed" && (
                        <div className="w-5 h-5 mr-3">
                          <Image
                            src="/icons/tick-circle.svg"
                            alt="Completed"
                            width={20}
                            height={20}
                          />
                        </div>
                      )}
                      <div className="text-[16px]">{level.name}</div>
                    </div>
                  )
              )}
            </div>
            <div className="w-full bg-[#E3E4EC] rounded-full h-[14px]">
              <div
                className="bg-[#6D67E4] h-[14px] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
