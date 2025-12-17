'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Phone, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface Anuncio {
  id: string
  nomeArtistico: string
  idade: number
  cidade: {
    nome: string
    estado: string
  }
  destaque: boolean
  estrelas: number
  fotos: {
    url: string
    principal: boolean
  }[]
  whatsapp: string
  telefone?: string
}

interface Cidade {
  id: string
  nome: string
  estado: string
}

interface AnuncioCardProps {
  anuncio: Anuncio
  isDestaque: boolean
}

function AnuncioCard({ anuncio, isDestaque }: AnuncioCardProps) {
  const fotoPrincipal = anuncio.fotos.find(f => f.principal) || anuncio.fotos[0]
  
  const handleWhatsAppClick = () => {
    const message = `Olá ${anuncio.nomeArtistico}, vi seu anúncio e gostaria de mais informações.`
    window.open(`https://wa.me/${anuncio.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handlePhoneClick = () => {
    if (anuncio.telefone) {
      window.open(`tel:${anuncio.telefone}`, '_blank')
    }
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isDestaque ? 'ring-2 ring-amber-400 shadow-amber-200 dark:shadow-amber-800' : ''
    }`}>
      <div className="relative">
        {fotoPrincipal && (
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={fotoPrincipal.url}
              alt={anuncio.nomeArtistico}
              fill
              className="object-cover"
            />
          </div>
        )}
        {isDestaque && (
          <Badge className="absolute top-2 right-2 bg-amber-400 text-amber-900">
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{anuncio.nomeArtistico}</h3>
            <span className="text-sm text-muted-foreground">{anuncio.idade} anos</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{anuncio.cidade.nome} - {anuncio.cidade.estado}</span>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < anuncio.estrelas
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            {anuncio.telefone && (
              <Button
                onClick={handlePhoneClick}
                variant="outline"
                size="sm"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>('')
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarCidades()
    
    const cidadeSalva = localStorage.getItem('cidadeSelecionada')
    if (cidadeSalva) {
      setCidadeSelecionada(cidadeSalva)
    }
  }, [])

  useEffect(() => {
    if (cidadeSelecionada) {
      carregarAnuncios()
      localStorage.setItem('cidadeSelecionada', cidadeSelecionada)
    }
  }, [cidadeSelecionada])

  const carregarCidades = async () => {
    try {
      const response = await fetch('/api/cidades')
      const data = await response.json()
      setCidades(data)
    } catch (error) {
      console.error('Erro ao carregar cidades:', error)
    }
  }

  const carregarAnuncios = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/anuncios?cidadeId=${cidadeSelecionada}`)
      const data = await response.json()
      setAnuncios(data)
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const destaques = anuncios.filter(a => a.destaque)
  const normais = anuncios.filter(a => !a.destaque)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Acompanhantes VIP</h1>
            
            <div className="flex items-center gap-4">
              <Select value={cidadeSelecionada} onValueChange={setCidadeSelecionada}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade.id} value={cidade.id}>
                      {cidade.nome} - {cidade.estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" asChild>
                <a href="/admin">Admin</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!cidadeSelecionada ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Selecione uma cidade para visualizar os anúncios de acompanhantes disponíveis na sua região.
            </p>
            <Select onValueChange={setCidadeSelecionada}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade.id} value={cidade.id}>
                    {cidade.nome} - {cidade.estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Anúncios em Destaque */}
            {destaques.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Destaques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destaques.slice(0, 2).map((anuncio) => (
                    <AnuncioCard key={anuncio.id} anuncio={anuncio} isDestaque={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Anúncios Normais */}
            {normais.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Todos os Anúncios</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {normais.map((anuncio) => (
                    <AnuncioCard key={anuncio.id} anuncio={anuncio} isDestaque={false} />
                  ))}
                </div>
              </section>
            )}

            {anuncios.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum anúncio encontrado para esta cidade.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}