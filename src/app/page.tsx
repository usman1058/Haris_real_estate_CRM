"use client";
import Image from "next/image";
import Head from "next/head";
import React from "react";
import Dashboard from "./Dashboard/page";
import Header from "./components/Header/Header";
import Sidemenu from "./components/sidemenu/Sidemenu";
import Login from "./components/Login/Login";
import { useSession } from "next-auth/react";
import scss from "./home.module.scss";
import "@/style/globals.css";



export default function Home() {
  const { data: session } = useSession();
  return (
    <main className={scss.main}>
      {session && <Dashboard /> }
      {!session && <Login /> }
    </main>

  );
}
