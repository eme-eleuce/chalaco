import Head from "next/head";
import Hero from "./components/Hero.jsx";
import Casa from "./components/Casa.jsx";

export default function Home() {
  return (
    <div >
      <Head>
        
        <link 
         rel="icon" 
         href="/icon.png" 
         type="image/<generated>"
         sizes="32x32"/>
      </Head>
      <Hero />
      <Casa />
    </div>
  );
}