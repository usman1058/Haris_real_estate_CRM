"use client";
import Image from "next/image";
import Head from "next/head";
import React from "react";
import Dashboard from "./Dashboard/page";

import Login from "./components/Login/Login";
import { useSession } from "next-auth/react";
import scss from "./home.module.scss";
import "./globals.css";



export default function Home() {
  const { data: session } = useSession();
  return (
    <main className={scss.main}>
      {session && <Dashboard /> }
      {!session && <Login /> }
    </main>

  );
}