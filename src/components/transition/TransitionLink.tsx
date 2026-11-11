"use client";

import NextLink from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionRouter } from "./TransitionProvider";

/** Drop-in replacement for next/link that closes the blast door while the next page loads. */
export default function TransitionLink({
  href,
  onClick,
  replace,
  target,
  ...rest
}: ComponentProps<typeof NextLink>) {
  const { navigate } = useTransitionRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || typeof href !== "string") return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;
    if (/^(https?:)?\/\//.test(href) || href.startsWith("#")) return;

    event.preventDefault();
    navigate(href, { replace });
  }

  return <NextLink href={href} replace={replace} target={target} onClick={handleClick} {...rest} />;
}
