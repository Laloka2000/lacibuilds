# 6. Feliratkozó és waitlist űrlap

Egyetlen űrlap komponens kell, ami négy helyen jelenik meg, három kinézettel:

| Hol | Variáns | Gomb |
|---|---|---|
| Kezdőlap hero | `light` (fehér keret, input és gomb együtt) | sötét "Subscribe" |
| Termékoldal hero | `light` | zöld "Join the waitlist" |
| Kezdőlap "Follow the build." sáv | `navy` | zöld "Subscribe" |
| Termékoldal "Get in before launch." sáv | `accent` | körvonalas sötét "Join the waitlist" |

Négy állapota van: **idle**, **submitting** (a gomb tiltva), **success** (szöveg cseréli le az űrlapot), **error** (szöveg az input alatt).

## A felépítés

```
SubscribeForm (client komponens)
   │  <form action={formAction}>
   ▼
app/actions.ts  subscribe()     ← Server Action, a szerveren fut
   │  validál, eldönti a listát
   ▼
lib/newsletter.ts  addSubscriber()   ← az egyetlen fájl, ami a szolgáltatót ismeri
   │  fetch(...)
   ▼
Buttondown / Kit / Beehiiv
```

**Server Action:** egy `'use server'` jelölésű függvény, amit a kliens űrlapja közvetlenül meghív. Nem kell hozzá API route-ot írni, és az API kulcs sosem jut el a böngészőbe.

## 6.1 `lib/newsletter.ts`

A szolgáltató még nincs kiválasztva. Ez a példa a Buttondown API-t használja. Ha mást választasz, csak a `fetch` részt kell átírnod.

```ts
export type ListKey = "newsletter" | "waitlist";

export async function addSubscriber(email: string, list: ListKey) {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const endpoint = process.env.NEWSLETTER_ENDPOINT;
  const tag = list === "waitlist" ? process.env.WAITLIST_TAG : process.env.NEWSLETTER_TAG;

  // Kulcs nélkül fejlesztés közben csak naplózunk, hogy az űrlap kipróbálható legyen
  if (!apiKey || !endpoint) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[newsletter] dev mode, not sent: ${email} -> ${tag ?? list}`);
      await new Promise((resolve) => setTimeout(resolve, 800)); // látszódjon a "submitting" állapot
      return;
    }
    throw new Error("Newsletter provider is not configured");
  }

  // Buttondown példa: https://docs.buttondown.com/api-subscribers-create
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
```

## 6.2 `.env.local`

A projekt gyökerében hozd létre (a `.gitignore` már kizárja, nem kerül fel GitHubra):

```bash
# Hagyd üresen, amíg nincs szolgáltató: akkor dev módban fut
NEWSLETTER_API_KEY=
NEWSLETTER_ENDPOINT=https://api.buttondown.com/v1/subscribers
NEWSLETTER_TAG=newsletter
WAITLIST_TAG=crawlguard-waitlist
```

Egy listán, két taggel kezeled a hírlevelet és a waitlistet. Ha majd több termék kap waitlistet, a `ListKey` típust és a tag választást bővíted.

## 6.3 `app/actions.ts`

```ts
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
  // A kliens adatában nem bízunk meg: csak ismert listát fogadunk el
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
```

### Mit tanulsz ebből?

- **`"use server"` a fájl tetején:** minden exportált async függvény Server Action lesz.
- **`_prevState`:** a `useActionState` hook minden hívásnál átadja az előző állapotot. Most nem használjuk, az aláhúzás jelzi, hogy ez szándékos.
- **Szerver oldali validálás:** a böngészős ellenőrzés kikerülhető, a szerveren lévő nem.
- **A hiba részleteit csak naplózzuk:** a felhasználó általános üzenetet kap, a részletek a Vercel logjában látszanak.

## 6.4 `components/SubscribeForm.tsx`

```tsx
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
  buttonTone?: ButtonTone; // csak a light variánsnál számít
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
    // Az aria-live miatt a képernyőolvasó felolvassa a hibát és a sikerüzenetet
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
            // Input és gomb egy közös keretben. A fókuszkeret a keretre kerül.
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
```

### Mit tanulsz ebből?

- **`useActionState(action, kezdőÁllapot)`** (React 19): három dolgot ad vissza: az aktuális állapotot (amit a Server Action visszaadott), a `formAction`-t (ezt kapja a `<form action>`), és a `pending` értéket (fut-e épp). A `pending` tiltja a gombot, így nem lehet kétszer elküldeni.
- **`useId()`:** egyedi, szerver és kliens között stabil azonosító. Egy oldalon két űrlap is van, így nem ütköznek a `label`/`input` párok.
- **`noValidate`:** kikapcsolja a böngésző saját buborékját, így a hibaüzenet a mi stílusunkban, az input alatt jelenik meg. A `type="email"` és a `required` attól még segít a mobil billentyűzetnek és a képernyőolvasónak.
- **`aria-invalid` és `aria-describedby`:** a képernyőolvasó a mezőre lépve felolvassa a hibaüzenetet is.
- **`has-[input:focus-visible]:`:** a szülő stílusa a gyerek állapotától függ (CSS `:has()`). A light variánsnál az inputnak nincs saját kerete, ezért a közös keret kapja a fókuszjelzést.
- **`flex-[1_1_12rem]` és `flex-wrap`:** ha elfér, az input és a gomb egy sorban van. Ha nem (mobilon a hosszabb "Join the waitlist"), a gomb új sorba törik, pont ahogy a mobil terven.
- **A hibaszín az accent sávon:** a CLAUDE.md-ben lévő `#B91C1C` a zöld háttéren csak 3.8:1 kontrasztot ad, a minimum 4.5:1. Ezért ott sötétebb pirosat (`#7F1D1D`, kb. 7:1) használunk.

> A siker szövegek (`successMessage`) nincsenek benne a CLAUDE.md copy-ban. A következő fejezetekben javasolt szöveget írok, de ha a választott szolgáltató nem kér email megerősítést, igazítsd hozzá.

## Ellenőrzés

Próbaként az `app/page.tsx`-ben:

```tsx
<div className="max-w-[520px]">
  <SubscribeForm
    list="newsletter"
    label="Get the build log, every other week"
    buttonLabel="Subscribe"
    successMessage="Thanks, you're subscribed. Check your inbox to confirm."
  />
</div>
```

- [ ] üres vagy hibás emailre piros hibaüzenet jelenik meg az input alatt
- [ ] helyes emailre a gomb kb. 0.8 másodpercre tiltott lesz, utána megjelenik a siker szöveg
- [ ] a terminálban (ahol az `npm run dev` fut) látszik a `[newsletter] dev mode` sor
- [ ] Tab-bal az inputra lépve a teljes fehér keret kap fókuszkeretet
- [ ] 390px-en az input és a "Subscribe" gomb egy sorban marad
