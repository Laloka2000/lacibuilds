export type ListKey = "newsletter" | "waitlist";

export async function addSubscriber(email: string, list: ListKey) {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const endpoint = process.env.NEWSLETTER_ENDPOINT;
  const tag = list === "waitlist" ? process.env.WAITLIST_TAG : process.env.NEWSLETTER_TAG;

  if (!apiKey || !endpoint) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[newsletter] dev mode, not sent: ${email} -> ${tag ?? list}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return;
    }
    throw new Error("Newsletter provider is not configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, tags: tag ? [tag] : [] }),
  });

  if (!res.ok) {
    throw new Error(`Provider error ${res.status}: ${await res.text()}`);
  }
}
