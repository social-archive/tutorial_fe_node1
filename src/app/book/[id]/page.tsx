import { notFound } from "next/navigation";
import style from "./page.module.css";
import { ReviewData } from "@/types";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";
import booksData from "@/mock/books.json";

// export const dynamicParams = false;
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function BookDetail({ bookId }: { bookId: string }) {
  let book;
  
  // API 서버가 설정되어 있으면 API 호출 시도
  if (process.env.NEXT_PUBLIC_API_SERVER_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`,
        { cache: "force-cache" }
      );

      if (response.ok) {
        book = await response.json();
      } else {
        if (response.status === 404) {
          notFound();
        }
        // API 실패 시 mock 데이터로 fallback
        book = booksData.find((b) => b.id.toString() === bookId);
        if (!book) {
          notFound();
        }
      }
    } catch (error) {
      // 네트워크 에러 등 발생 시 mock 데이터로 fallback
      book = booksData.find((b) => b.id.toString() === bookId);
      if (!book) {
        notFound();
      }
    }
  } else {
    // API 서버 URL이 없으면 mock 데이터 사용
    book = booksData.find((b) => b.id.toString() === bookId);
    if (!book) {
      notFound();
    }
  }

  const {
    id,
    title,
    subTitle,
    description,
    author,
    publisher,
    coverImgUrl,
  } = book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image
          src={coverImgUrl}
          width={240}
          height={300}
          alt={`도서 ${title}의 표지 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  let reviews: ReviewData[] = [];
  
  // API 서버가 설정되어 있으면 API 호출 시도
  if (process.env.NEXT_PUBLIC_API_SERVER_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
        { next: { tags: [`review-${bookId}`] } }
      );

      if (response.ok) {
        reviews = await response.json();
      }
      // API 실패 시 빈 배열로 처리 (에러를 throw하지 않음)
    } catch (error) {
      // 네트워크 에러 등 발생 시 빈 배열로 처리
      reviews = [];
    }
  }
  // API 서버 URL이 없으면 빈 배열 사용

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className={style.container}>
      <BookDetail bookId={params.id} />
      <ReviewEditor bookId={params.id} />
      <ReviewList bookId={params.id} />
    </div>
  );
}
