import dynamic from "next/dynamic";

const TicTacToeClassic = dynamic(() => import("./TicTacToeClassic"), {
  ssr: false,
});

export default function Home() {
  return <TicTacToeClassic />;
}
