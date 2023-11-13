import Board from "./_components/board/Board";
import Fetch from "@/util/fetch";
import ServerError from "./_components/error/Error";
import { categoryEN2KO } from "@/config/category";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("./_components/slider/Slider"));

export default async function HomePage(props) {
  const category = categoryEN2KO[props.params.topic];
  const querys = props.searchParams;
  const page = querys.page ?? 1;

  try {
    const path =
      process.env.NEXT_PUBLIC_PATH_PAGING + `/best?page=${page - 1}&size=30`;
    const res = await Fetch.get(path);
    const postData = await res.json();

    return (
      <>
        <Slider />
        <Board
          posts={postData}
          title={category ?? "BEST"}
          isThumbnail={true}
        ></Board>
      </>
    );
  } catch (err) {
    console.error(err);
    return <ServerError />;
  }
}
