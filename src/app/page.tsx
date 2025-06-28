'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { motion } from 'framer-motion'

type Item = {
  _id: string
  titulo: string
  legenda: string
  imagens?: string[]   // array opcional
  imagem?: string      // string opcional
}

export default function Home() {
  const [itens, setItens] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/itens')
      .then((res) => res.json())
      .then((data) => setItens(data))
  }, [])

  return (
    <main className="min-h-screen bg-[#fdf9f4] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-10 text-stone-800 text-center"
        >
          Nossa Vitrine
        </motion.h1>

        {itens.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum item encontrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {itens.map((item) => {
              // Garante que sempre teremos um array para iterar
              const mediaList = item.imagens ?? (item.imagem ? [item.imagem] : [])

              return (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative h-64">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 3000, disableOnInteraction: true }}
                      loop
                      className="h-full"
                    >
                      {mediaList.map((media, index) => (
                        <SwiperSlide key={index} className="relative h-64">
                          {media.endsWith('.mp4') ? (
                            <video
                              src={media}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                            />
                          ) : (
                            <Image
                              src={media}
                              alt={item.titulo}
                              fill
                              className="object-cover"
                            />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-stone-800">{item.titulo}</h2>
                    {item.legenda && (
                      <p className="text-sm text-stone-500 mt-1">{item.legenda}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
