import Image from "next/image";
import textLogo from "/public/Text.png"
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full text-purple-300">
      <nav className="top-0 left-0 w-full py-6 px-5 flex justify-between">
        <h1 className="md:text-3xl md:flex hidden text-2xl font-bold text-sky-500">Crowd Source</h1>
        <ul className="flex gap-7 md:gap-12">
          <li className="text-xl font-bold hover:text-purple-400 duration-300 cursor-pointer">Home</li>
          <Link href={"/auth"}>
          <li className="text-xl font-bold hover:text-purple-400 duration-300 cursor-pointer">Start Here</li>
          </Link>
          <Link href={"https://linktr.ee/subhraneel"}>
          <li className="text-xl font-bold hover:text-purple-400 duration-300 cursor-pointer">About Me</li>
          </Link>
        </ul>
      </nav>
        <div className="w-full min-h-screen flex justify-center items-center">
          <div className="block space-y-6">
            <h1 className="text-center font-semibold md:text-[6vw] text-5xl">Welcome to Crowd Source 💵</h1>
            <div className="w-full h-full flex justify-center items-center">
            <Link href={"/allCommunities"}>
            <button class="btn btn-accent">Explore Communities 🌸</button>
            </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
