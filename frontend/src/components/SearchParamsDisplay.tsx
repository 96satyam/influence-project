"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function SearchParamsDisplay() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  return (
    <p className="text-gray-300">User ID from Search Params: {userId || "N/A"}</p>
  );
}
