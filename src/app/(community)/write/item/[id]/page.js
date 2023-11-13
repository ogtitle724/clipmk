"use client";
import Fetch from "@/util/fetch";
import dynamic from "next/dynamic";
import ImgReceiver from "@/app/_components/img_receiver/ImgReceiver";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slice/signSlice";
import { district as Districts } from "@/config/district";
import "../style.css";

const Editor = dynamic(() => import("@components/editor/editor"), {
  ssr: false,
});

export default function ItemUpload({ params }) {
  const [imgs, setImgs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [city, setCity] = useState("");
  const [districts, setDistricts] = useState();
  const [district, setDistrict] = useState();
  const [dongs, setDongs] = useState();
  const [dong, setDong] = useState();

  const user = useSelector(selectUser);
  const router = useRouter();
  const initialImgs = useRef();

  //prevent "resizeobserver loop limit exceeded" error appearing
  useEffect(() => {
    const getUpdateData = async () => {
      const postId = params?.id;
      try {
        const path = process.env.NEXT_PUBLIC_PATH_ITEM + `/${postId}`;
        const res = await Fetch.get(path);
        const itemDetail = await res.json();
        return itemDetail;
      } catch (err) {
        alert("서버와 연결이 불안정합니다 :(");
        console.error(err);
        return router.back();
      }
    };

    const fetchDataAndUpdate = async () => {
      try {
        const itemDetail = await getUpdateData();
        console.log(itemDetail, user);

        if (itemDetail.user_id !== user.id) throw new Error("No permission");

        setTitle(itemDetail.title);
        setContent(itemDetail.content);
        setImgs(itemDetail.img_src);
        initialImgs.current = itemDetail.img_src.slice();
      } catch (err) {
        console.error(err);
        alert("넌 수정 안되는거 알지???");
        router.back();
      }
    };

    fetchDataAndUpdate();
  }, [params?.id, router, user]);

  useEffect(() => {
    const getDistrict = async () => {
      try {
        const res = await fetch(`/district/${city}.json`);
        setDistricts(await res.json());
      } catch (err) {
        console.error(err);
      }
    };

    if (city) {
      getDistrict();
    }
  }, [city]);

  useEffect(() => {
    if (district) {
      setDongs(Object.keys(districts[district]));
    }
  }, [district, districts]);

  const handleClkBtnUpload = async () => {
    //TODO: 수정시 S3에서 기존 데이터 삭제
    try {
      if (!title.length) {
        alert("제목을 작성을 주세요!");
        return;
      } else if (!content.length) {
        alert("내용을 작성해 주세요!");
        return;
      }

      //TODO: 여기서 현재 imgs랑 비교해서 삭제 하면될듯(initialImgs)
      initialImgs.current.forEach((img, idx) => {
        if (imgs.includes(img)) {
          //여기서 삭제 수행
        }
      });

      //aws createPreSignedPost를 이용해 클라이언트 사이드에서 s3업로드
      const preSignedArgs = [];
      const preSignedUrl = [];

      //next api로 이미지의 key, type 전달
      for (let i = 0; i < imgs.length; i++) {
        preSignedArgs.push({ key: imgs[i].name, contentType: imgs[i].type });
      }

      const res = await fetch(
        process.env.NEXT_PUBLIC_URL_CLI + process.env.NEXT_PUBLIC_API_IMG,
        {
          body: JSON.stringify(preSignedArgs),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await res.json();

      //res로 받은 presigned posts를 promise.all을 통해 순차적으로 fetch
      await Promise.all(
        response.map(({ url, fields }, idx) => {
          //할당된 url에는 formdata를 body에 담아 전송하며 각 formData는 아래와 같은 순서로 key-value를 할당
          const formData = new FormData();
          formData.append("key", fields.key);
          formData.append("Content-Type", imgs[idx].type);

          Object.entries(fields).forEach(([key, value]) => {
            if (key !== "key") {
              formData.append(key, value);
            }
          });

          formData.append("file", imgs[idx]);
          preSignedUrl.push(url + fields.key);
          return fetch(url, { method: "POST", body: formData });
        })
      );

      const option = { headers: { "Content-Type": "application/json" } };
      const body = JSON.stringify({
        title,
        content,
        thumbnail: preSignedUrl[0],
        imgSrc: preSignedUrl,
      });

      await Fetch.patch(
        process.env.NEXT_PUBLIC_PATH_ITEM + `/${params.id}`,
        body,
        option
      );
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCity = (e) => {
    setCity(e.target.value);
    setDistrict("");
    setDistricts("");
    setDong("");
    setDongs("");
  };

  const handleSelectDistrict = (e) => {
    setDistrict(e.target.value);
    setDong("");
    setDongs("");
  };

  const handleSelectDong = (e) => {
    setDong(e.target.value);
  };

  return (
    <section className="item-upload">
      <ImgReceiver setImgs={setImgs} imgs={imgs} />
      <input
        type="text"
        className="item-upload__title"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <Editor onChange={setContent} data={content} isImg={false} />
      <section className="item-upload__btn-wrapper">
        <select
          name="category-city"
          className="item-upload__select"
          onChange={(e) => handleSelectCity(e)}
        >
          <option value={""}>{"시/도"}</option>
          {Districts.map((group, idx) => {
            return (
              <option key={"select-opt-category-grp" + idx} value={group}>
                {group}
              </option>
            );
          })}
        </select>
        <select
          name="category-city"
          className="item-upload__select"
          onChange={(e) => handleSelectDistrict(e)}
        >
          <option value={""}>{"시/군/구"}</option>
          {districts &&
            Object.keys(districts).map((group, idx) => {
              return (
                <option key={"select-opt-category-grp" + idx} value={group}>
                  {group}
                </option>
              );
            })}
        </select>
        <select
          name="category-city"
          className="item-upload__select"
          onChange={(e) => handleSelectDong(e)}
        >
          <option value={""}>{"읍/면/동"}</option>
          {dongs &&
            dongs.map((group, idx) => {
              return (
                <option key={"select-opt-category-grp" + idx} value={group}>
                  {group}
                </option>
              );
            })}
        </select>
        <button
          className="item-upload__btn-submit"
          onClick={handleClkBtnUpload}
        >
          완료
        </button>
      </section>
    </section>
  );
}
