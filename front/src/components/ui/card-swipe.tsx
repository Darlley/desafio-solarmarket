"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css/effect-cards"
import { EffectCards } from "swiper/modules"

import "swiper/css"
import "swiper/css/effect-coverflow"
import { SparklesIcon } from "lucide-react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"

import { Badge } from "@/components/ui/badge"
import { useBooks } from "@/hooks/books"
import { BookType } from "@/schemas/book"

interface CarouselProps {
  images?: { src: string; alt: string }[]
  autoplayDelay?: number
  slideShadows: boolean
}

export const CardSwipe: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  slideShadows = false,
}) => {
  const { data, isLoading, error } = useBooks()
  const [currentBookIndex, setCurrentBookIndex] = useState(0)

  const css = `
  .swiper {
    width: 50%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
   display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  
  `

  if (isLoading) {
    return (
      <section className="w-full space-y-4">
        <div className="mx-auto w-full max-w-xl rounded-[24px] border border-black/5 p-2 shadow-sm">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto mb-4"></div>
              <p className="text-neutral-600">Carregando livros...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full space-y-4">
        <div className="mx-auto w-full max-w-xl rounded-[24px] border border-red-200 p-2 shadow-sm">
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-600">
              <p className="font-semibold">Erro ao carregar livros</p>
              <p className="text-sm mt-2">Tente novamente mais tarde</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!data || data.length === 0) {
    return (
      <section className="w-full space-y-4">
        <div className="mx-auto w-full max-w-xl rounded-[24px] border border-black/5 p-2 shadow-sm">
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-neutral-600">
              <SparklesIcon className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
              <p className="font-semibold">Nenhum livro encontrado</p>
              <p className="text-sm mt-2">Adicione alguns livros para vê-los aqui</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const currentBook = data[currentBookIndex] || data[0]

  return (
    <section className="w-ace-y-4">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Últimos livros cadastrados
          </Badge>
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl opacity-85 font-bold tracking-tight line-clamp-2">
                  {currentBook.title}
                </h3>
                <p className="flex items-center gap-1 line-clamp-4">
                  {currentBook.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"cards"}
                grabCursor={true}
                loop={true}
                slidesPerView={"auto"}
                rewind={true}
                cardsEffect={{
                  slideShadows: slideShadows,
                }}
                modules={[EffectCards, Autoplay, Pagination, Navigation]}
              >
                {data.map((book: BookType, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <Image
                        src={book.coverUrl}
                        width={400}
                        height={400}
                        className="size-full rounded-xl"
                        alt={`Capa do livro ${book.title} de ${book.author}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {data.map((book: BookType, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <Image
                        src={book.coverUrl}
                        width={100}
                        height={100}
                        className="size-full rounded-xl"
                        alt={`Capa do livro ${book.title} de ${book.author}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
