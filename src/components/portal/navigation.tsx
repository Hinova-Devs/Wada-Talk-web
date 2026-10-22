"use client";
import Link, {useLinkStatus} from "next/link";
import {useState, type ComponentProps} from "react";

function PendingNavigation() {
 const {pending} = useLinkStatus();
 return <span className="oa-nav-pending" role="status" aria-hidden={!pending}>{pending ? "Loading…" : ""}</span>;
}
export function PortalNavLink({children, ...props}: ComponentProps<typeof Link>) {
 const [intent, setIntent] = useState(false);
 return <Link {...props} prefetch={intent ? true : null} onMouseEnter={event => {setIntent(true); props.onMouseEnter?.(event);}} onFocus={event => {setIntent(true); props.onFocus?.(event);}} onPointerDown={event => {setIntent(true); props.onPointerDown?.(event);}}>{children}<PendingNavigation/></Link>;
}
