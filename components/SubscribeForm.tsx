"use client";

import { useActionState, useId } from "react";
import { subscribe, type SubscribeState } from "@/app/actions";
import type { ListKey } from "@/lib/newsletter";
import { buttonClass, type ButtonTone } from "@/lib/styles";

type Variant = "light" | "navy" | "accent";

type SubscribeFormProps = {
  list: ListKey;
  label: string;
  buttonLabel: string;
  successMessage: string;
  variant?: Variant;
  buttonTone?: ButtonTone;
};

const variantStyles = {
  light: {
    label: "text-ink",
    input: "text-ink placeholder:text-[#64748B]",
    error: "text-[#B91C1C]",
    success: "text-ink",
  },
  navy: {
    label: "text-on-navy",
    input:
      "rounded-xl border border-navy-input-border bg-navy-input px-4 text-on-navy placeholder:text-[#8E9AB0]",
    error: "text-[#FCA5A5]",
    success: "text-on-navy",
  },
  accent: {
    label: "text-ink",
    input: "rounded-xl bg-navy px-4 text-on-navy placeholder:text-[#8E9AB0]",
    error: "text-[#7F1D1D]",
    success: "text-ink",
  },
};

const initialState: SubscribeState = { status: "idle" };

export function SubscribeForm({
  list,
  label,
  buttonLabel,
  successMessage,
  variant = "light",
  buttonTone = "dark",
}: SubscribeFormProps) {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const styles = variantStyles[variant];
  const hasError = state.status === "error";

  const input = (
    <input
      id={inputId}
      name="email"
      type="email"
      autoComplete="email"
      required
      placeholder="you@company.com"
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : undefined}
      className={`min-h-12 w-full min-w-0 text-[17px] ${styles.input} ${
        variant === "light" ? "flex-[1_1_12rem] bg-transparent px-4 focus-visible:outline-none" : ""
      }`}
    />
  );

  return (
    <div aria-live="polite">
      {state.status === "success" ? (
        <p className={`text-[17px] font-semibold ${styles.success}`}>{successMessage}</p>
      ) : (
        <form action={formAction} noValidate>
          <input type="hidden" name="list" value={list} />
          <label htmlFor={inputId} className={`mb-2.5 block font-semibold ${styles.label}`}>
            {label}
          </label>

          {variant === "light" ? (
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border-form bg-surface p-1.5 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-ink">
              {input}
              <button type="submit" disabled={pending} className={buttonClass(buttonTone, "md")}>
                {buttonLabel}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <div className="min-w-0 flex-[1_1_14rem]">{input}</div>
              <button
                type="submit"
                disabled={pending}
                className={buttonClass(variant === "navy" ? "accent" : "outline", "lg")}
              >
                {buttonLabel}
              </button>
            </div>
          )}

          {hasError && (
            <p id={errorId} className={`mt-2 text-[15px] font-medium ${styles.error}`}>
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
