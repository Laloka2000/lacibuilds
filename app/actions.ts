"use server";

import { addSubscriber, type ListKey } from "@/lib/newsletter";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim();
  const list: ListKey = formData.get("list") === "waitlist" ? "waitlist" : "newsletter";

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    await addSubscriber(email, list);
    return { status: "success" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
