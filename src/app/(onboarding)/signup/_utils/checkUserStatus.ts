export const checkUserStatus = async (email: string) => {
  try {
    const response = await fetch("/api/users/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("User status:", data);

    return data;
  } catch (error) {
    console.error("Error checking user status:", error);
  }
};
